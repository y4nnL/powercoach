import { v4 } from 'uuid'
import moment from 'moment'
import {
  ExerciseType,
  type Block,
  type Exercise,
  type Set,
  type Video,
  type VideoTag,
  type Week,
  type Workout
} from '@/types'
import exercises from '@/api/fixtures/exercises'

type ExerciseProbability = {
  [type in ExerciseType]: {
    expected: number
    actual: number
  }
}

type TagProbability = {
  [name in VideoTag]: number
}

const VIDEOS_PER_WORKOUT = 3
const WORKOUTS_PER_WEEK = 5
const WEEKS_PER_BLOCK = 4
const BLOCKS = 3
const VIDEOS = VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK * BLOCKS

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
let block: Block = { id: '', index: 0 }
let week: Week = { id: '', index: 0 }
let workout: Workout = { id: '', index: 0 }
let set: Set = { id: '', index: 0 }
const videos: Video[] = []
const videoTags: VideoTag[] = ['pass', 'fail', 'review', 'comment', 'great', 'pb']

const generateVideo = (): Video | null => {
  date =
    videos.length % VIDEOS_PER_WORKOUT
      ? date.add(15, 'minutes').clone()
      : date.add(1, 'day').startOf('day')

  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK) === 0) {
    block = { id: v4(), index: block.index + 1, name: `Block #${block.index + 1}` }
    week = { id: v4(), index: 0 }
    workout = { id: v4(), index: 0 }
  }
  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK) === 0) {
    week = { id: v4(), index: week.index + 1, name: `Semaine #${week.index + 1}` }
    workout = { id: v4(), index: 0 }
  }
  if (videos.length % VIDEOS_PER_WORKOUT === 0) {
    workout = { id: v4(), index: workout.index + 1, name: `Séance #${workout.index + 1}` }
    set = { id: v4(), index: 1, name: `Série #1` }
    date.add(1, 'day').startOf('day')
  } else {
    set = { id: v4(), index: set.index + 1, name: `Série #${set.index + 1}` }
    date.add(15, 'minutes').clone()
  }

  const id = v4()
  const exercise = pickExercise()

  return exercise
    ? {
        block,
        date: date.toISOString(),
        id,
        exercise,
        set,
        tags: videoTags.filter((tag) => Math.random() <= tagProbability[tag]),
        thumbnail: `https://picsum.photos/seed/${id}/500`,
        week,
        workout
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
