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
  [videoTag in VideoTag]: number
}

const VIDEOS_PER_WORKOUT = 3
const WORKOUTS_PER_WEEK = 5
const WEEKS_PER_BLOCK = 4
const BLOCKS = 3
const VIDEOS = VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK * BLOCKS
const VIDEO_DELAY = [15, 'minutes']
const WORKOUT_DELAY = [1, 'day']
const LIFT_PROBABILITY = 0.6
const VARIANT_PROBABILITY = 0.3
const ACCESSORY_PROBABILITY = 0.1
const COMMENT_TAG_PROBABILITY = 0.8
const FAIL_TAG_PROBABILITY = 0.1
const GREAT_TAG_PROBABILITY = 0.3
const PASS_TAG_PROBABILITY = 0.8
const PB_TAG_PROBABILITY = 0.05
const REVIEW_TAG_PROBABILITY = 0.95
const STARTING_DATE = '2024-02-08'
const THUMBNAIL_URL = 'https://picsum.photos/seed/{id}/{size}'

const getThumbnailUrl = (id: string, size: number = 500): string =>
  THUMBNAIL_URL.replace('{id}', id).replace('{size}', size.toString())

const exerciseProbability: ExerciseProbability = {
  [ExerciseType.Lift]: {
    expected: LIFT_PROBABILITY,
    actual: 0
  },
  [ExerciseType.Variant]: {
    expected: VARIANT_PROBABILITY,
    actual: 0
  },
  [ExerciseType.Accessory]: {
    expected: ACCESSORY_PROBABILITY,
    actual: 0
  }
}

const tagProbability: TagProbability = {
  comment: COMMENT_TAG_PROBABILITY,
  fail: FAIL_TAG_PROBABILITY,
  great: GREAT_TAG_PROBABILITY,
  pass: PASS_TAG_PROBABILITY,
  pb: PB_TAG_PROBABILITY,
  review: REVIEW_TAG_PROBABILITY
}

const pickExercise = (): Exercise | null => {
  const remainingProbabilities = Object.entries(exerciseProbability).filter(
    ([, { expected, actual }]) => actual <= expected
  )
  if (remainingProbabilities.length > 0) {
    const remainingProbabilityIndex = Math.floor(Math.random() * remainingProbabilities.length)
    const [exerciseType, probability] = remainingProbabilities[remainingProbabilityIndex]
    probability.actual += 1 / VIDEOS
    const typedExercises = exercises.filter(({ type }) => type === exerciseType)
    const typedExerciseIndex = Math.floor(Math.random() * typedExercises.length)
    return typedExercises[typedExerciseIndex]
  }
  return null
}

let video: Video | null
let date = moment(STARTING_DATE)
let block: Block = { id: '', index: 0 }
let week: Week = { id: '', index: 0 }
let workout: Workout = { id: '', index: 0 }
let set: Set = { id: '', index: 0 }
const videos: Video[] = []
const videoTags: VideoTag[] = ['pass', 'fail', 'review', 'comment', 'great', 'pb']

const generateVideo = (): Video | null => {
  date =
    videos.length % VIDEOS_PER_WORKOUT
      ? date.add(...VIDEO_DELAY).clone()
      : date.add(...WORKOUT_DELAY).startOf('day')

  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK * WEEKS_PER_BLOCK) === 0) {
    block = { id: v4(), index: block.index + 1 }
    week = { id: v4(), index: 0 }
    workout = { id: v4(), index: 0 }
  }
  if (videos.length % (VIDEOS_PER_WORKOUT * WORKOUTS_PER_WEEK) === 0) {
    week = { id: v4(), index: week.index + 1 }
    workout = { id: v4(), index: 0 }
  }
  if (videos.length % VIDEOS_PER_WORKOUT === 0) {
    workout = { id: v4(), index: workout.index + 1 }
    set = { id: v4(), index: 1 }
    date.add(...WORKOUT_DELAY).startOf('day')
  } else {
    set = { id: v4(), index: set.index + 1 }
    date.add(...VIDEO_DELAY).clone()
  }

  const id = v4()
  const exercise = pickExercise()

  return exercise
    ? {
        block,
        date: date.toISOString(),
        exercise,
        id,
        set,
        tags: videoTags.filter((tag) => Math.random() <= tagProbability[tag]),
        thumbnail: getThumbnailUrl(id),
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
