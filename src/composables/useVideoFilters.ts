import moment from 'moment'
import { type Video, type VideoControl } from '@/types'

type VideoControlKey = keyof VideoControl
type VideoFilter<K extends VideoControlKey> = (videos: Video[], control: VideoControl[K]) => Video[]

export const filterVideosByFromDate: VideoFilter<'fromDate'> = (videos, fromDate) =>
  fromDate ? videos.filter((video) => moment(video.date).diff(fromDate) >= 0) : videos

export const filterVideosByToDate: VideoFilter<'toDate'> = (videos, toDate) =>
  toDate ? videos.filter((video) => moment(video.date).diff(toDate) < 0) : videos

export const filterMap = new Map<VideoControlKey, VideoFilter<'fromDate'> | VideoFilter<'toDate'>>([
  ['fromDate', filterVideosByFromDate],
  ['toDate', filterVideosByToDate]
])

const getVideoControlKeys = (videoControl: VideoControl): VideoControlKey[] =>
  Object.keys(videoControl) as VideoControlKey[]

export const useVideoFilters = (videos: Video[], videoControl: VideoControl): Video[] =>
  getVideoControlKeys(videoControl).reduce(
    (videos, key) => filterMap.get(key)?.(videos, videoControl[key]) ?? videos,
    videos
  )
