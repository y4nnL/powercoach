import { v4 } from 'uuid'
import moment from 'moment'
import { ExerciseType, type Exercise, type Video, type VideoTag } from '@/types'
import exercises from '@/api/fixtures/exercises'

const VIDEOS_PER_WORKOUT = 3
const WORKOUTS_PER_WEEK = 5
const WEEKS_PER_BLOCK = 4
const BLOCKS = 3
const VIDEOS = VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK * BLOCKS

type ExerciseProbability = {
  [type in ExerciseType]: {
    expected: number
    actual: number
  }
}

type TagProbability = {
  [name in VideoTag]: number
}

const exerciseProbability: ExerciseProbability = {
  [ExerciseType.Lift]: {
    expected: 6 / 10,
    actual: 0
  },
  [ExerciseType.Variant]: {
    expected: 3 / 10,
    actual: 0
  },
  [ExerciseType.Accessory]: {
    expected: 1 / 10,
    actual: 0
  }
}

const tagProbability: TagProbability = {
  comment: 7 / 10,
  fail: 2 / 10,
  great: 3 / 10,
  pass: 8 / 10,
  pb: 0.2 / 10,
  review: 9.5 / 10
}

const pickExercise = (): Exercise | null => {
  const probabilityEntry = Object.entries(exerciseProbability).find(
    ([, { expected, actual }]) => actual <= expected
  )
  if (probabilityEntry) {
    const [exerciseType, probability] = probabilityEntry
    const filteredExercises = exercises.filter(({ type }) => type === exerciseType)
    const randomIndex: number = Math.floor(
      (Math.random() - 0.0000000000001) * filteredExercises.length
    )
    probability.actual += 1 / VIDEOS
    return filteredExercises[randomIndex]
  }
  return null
}

let video: Video | null
let date = moment('2024-02-08')
let blockId = v4()
let weekId = v4()
let workoutId = v4()
const videos: Video[] = []
const videoTags: VideoTag[] = ['pass', 'fail', 'review', 'comment', 'great', 'pb']

const generateVideo = (): Video | null => {
  date =
    videos.length % VIDEOS_PER_WORKOUT
      ? date.add(15, 'minutes').clone()
      : date.add(1, 'day').startOf('day')

  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK) === 0) {
    blockId = v4()
    weekId = v4()
    workoutId = v4()
  }
  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK) === 0) {
    weekId = v4()
    workoutId = v4()
  }
  if (videos.length % VIDEOS_PER_WORKOUT === 0) {
    workoutId = v4()
  }

  const id = v4()
  const exercise = pickExercise()

  return exercise
    ? {
        blockId,
        date: date.toISOString(),
        id,
        exercise,
        tags: videoTags.filter((tag) => Math.random() <= tagProbability[tag]),
        thumbnail: `https://picsum.photos/seed/${id}/500`,
        weekId,
        workoutId
      }
    : null
}

do {
  video = generateVideo()
  if (video) {
    videos.push(video)
  }
} while (video && videos.length < VIDEOS)

export default videos
