import messages from '@/locales'

export type API = {
  getVideo: (id: string) => Promise<Video>
  getVideos: () => Promise<Video[]>
}

export type Block = {
  id: string
  index: number
  name?: string
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
  BenchPress = 'bench_press',
  Deadlift = 'deadlift'
}

export type Video = {
  block: Block
  date: string
  id: string
  exercise: Exercise
  set: Set
  tags: VideoTag[]
  thumbnail: string
  week: Week
  workout: Workout
}

export enum Scale {
  All = 'all',
  Block = 'block',
  Week = 'week',
  Workout = 'workout',
  Exercise = 'exercise',
  Set = 'set'
}

export type Set = {
  id: string
  index: number
  name?: string
}

export type Week = {
  id: string
  index: number
  name?: string
}

export type Workout = {
  id: string
  index: number
  name?: string
}

export const VideoTags = ['review', 'comment', 'pass', 'fail', 'great', 'pb'] as const

export type VideoTag = (typeof VideoTags)[number]

export type Message = (typeof messages)['fr']
