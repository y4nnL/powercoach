import type { UseQueryReturnType } from '@tanstack/vue-query'

export type API = {
  getVideo: (id: string) => Promise<Video>
  getVideos: () => Promise<Video[]>
}

export type Exercise = {
  id: string
  lift: Lift | null
  title: string
  type: ExerciseType
}

export enum ExerciseType {
  Accessory = 'accessory',
  Lift = 'lift',
  Variant = 'variant'
}

export enum Lift {
  Squat = 'squat',
  BenchPress = 'benchpress',
  Deadlift = 'deadlift'
}

export type Video = {
  id: string
  exercise: Exercise
  tags: VideoTag[]
  thumbnail: string
}

export type VideoTag = 'comment' | 'fail' | 'great' | 'pass' | 'pb' | 'review'

export type UseVideosQueryReturnType = UseQueryReturnType<Video[], Error>

export const isDefined = <T>(value: T | undefined): value is NonNullable<T> => {
  return value !== null && value !== undefined
}
