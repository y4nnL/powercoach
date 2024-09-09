import { v4 } from 'uuid'
import { ExerciseType, type Exercise, type Video, type VideoTag } from '@/types'
import exercises from '@/api/fixtures/exercises'

const NUMBER_OF_VIDEOS = 500

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
    probability.actual += 1 / NUMBER_OF_VIDEOS
    return filteredExercises[randomIndex]
  }
  return null
}

const videoTags: VideoTag[] = ['pass', 'fail', 'review', 'comment', 'great', 'pb']

const generateVideo = (): Video | null => {
  const id = v4()
  const exercise = pickExercise()
  return exercise
    ? {
        id,
        exercise,
        tags: videoTags.filter((tag) => Math.random() <= tagProbability[tag]),
        thumbnail: `https://picsum.photos/seed/${id}/500`
      }
    : null
}

let video: Video | null
const videos: Video[] = []

do {
  video = generateVideo()
  if (video) {
    videos.push(video)
  }
} while (video && videos.length < NUMBER_OF_VIDEOS)

export default videos
