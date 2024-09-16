import { useI18n } from 'vue-i18n'
import { type Block, type Video, type Week } from '@/types'

export type HumanReadability = {
  getBlockName(block: Block): string
  getBlockScaleDate(videos: Video[]): string
  getWeekName(week: Week): string
  getWeekScaleDate(videos: Video[]): string
}

export function useHumanReadability(): HumanReadability {
  const { t, locale } = useI18n()

  function format(
    date: Date,
    options: { day?: boolean; month?: boolean; year?: boolean } = {}
  ): string {
    const dateTimeFormat = new Intl.DateTimeFormat(locale.value, {
      ...((options.day ?? true) && { day: '2-digit' }),
      ...((options.month ?? true) && { month: 'long' }),
      ...((options.year ?? true) && { year: 'numeric' })
    })
    return dateTimeFormat.format(date)
  }

  function getFirstAndLastDates(videos: Video[]): { first: Date; last: Date } {
    const dates = videos
      .map(({ date }) => new Date(date))
      .sort((dateA, dateB) => dateA.getTime() - dateB.getTime())
    return {
      first: dates[0],
      last: [...dates].pop()!
    }
  }

  function getBlockName(block: Block): string {
    return block.name ?? `${t('common_block')} ${block.index + 1}`
  }

  function getBlockScaleDate(videos: Video[]): string {
    const { first, last } = getFirstAndLastDates(videos)

    if (first === last) {
      return format(first, { day: false })
    }

    if (first.getFullYear() !== last.getFullYear()) {
      return [format(first, { day: false }), format(last, { day: false })].join(' - ')
    }

    return [format(first, { day: false, year: false }), format(last, { day: false })].join(' - ')
  }

  function getWeekName(week: Week): string {
    return week.name ?? `${t('common_week')} ${week.index + 1}`
  }

  function getWeekScaleDate(videos: Video[]): string {
    const { first, last } = getFirstAndLastDates(videos)

    if (first === last) {
      return t('date_on', { date: format(first) })
    }

    if (first.getFullYear() !== last.getFullYear()) {
      return t('date_fromTo', { from: format(first), to: format(last) })
    }

    if (first.getMonth() !== last.getMonth()) {
      return t('date_fromTo', { from: format(first, { year: false }), to: format(last) })
    }

    return t('date_fromTo', {
      from: format(first, { month: false, year: false }),
      to: format(last)
    })
  }

  return {
    getBlockName,
    getBlockScaleDate,
    getWeekName,
    getWeekScaleDate
  }
}
