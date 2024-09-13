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
  blockId: string
  date: string
  id: string
  exercise: Exercise
  tags: VideoTag[]
  thumbnail: string
  weekId: string
  workoutId: string
}

export enum Scale {
  All = 'all',
  Block = 'block',
  Week = 'week',
  Workout = 'workout',
  Exercise = 'exercise',
  Set = 'set'
}

export type VideoTag = 'comment' | 'fail' | 'great' | 'pass' | 'pb' | 'review'
