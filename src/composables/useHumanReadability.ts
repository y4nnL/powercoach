import { useI18n } from 'vue-i18n'
import { type Block, type Video, type Week, type Workout } from '@/types'

export type HumanReadability = {
  blockName(block: Block | Pick<Block, 'index' | 'name'>): string
  blockScaleDate(videos: Video[]): string
  videoDate(video: Video): string
  weekName(week: Week | Pick<Week, 'index' | 'name'>): string
  weekScaleDate(videos: Video[]): string
  workoutName(workout: Workout | Pick<Workout, 'index' | 'name'>): string
  workoutScaleDate(videos: Video[]): string
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
    return block.name ?? `${t('common_block')} ${block.index}`
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
    return week.name ?? `${t('common_week')} ${week.index}`
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

  function getWorkoutName(workout: Workout): string {
    return workout.name ?? `${t('common_workout')} ${workout.index}`
  }

  function getWorkoutScaleDate(videos: Video[]): string {
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

    if (first.getDate() !== last.getDate()) {
      return t('date_fromTo', {
        from: format(first, { year: false, month: false }),
        to: format(last)
      })
    }

    return t('date_on', { date: format(first) })
  }

  function getVideoDate(video: Video): string {
    return format(new Date(video.date))
  }

  return {
    blockName: getBlockName,
    blockScaleDate: getBlockScaleDate,
    videoDate: getVideoDate,
    weekName: getWeekName,
    weekScaleDate: getWeekScaleDate,
    workoutName: getWorkoutName,
    workoutScaleDate: getWorkoutScaleDate
  }
}
