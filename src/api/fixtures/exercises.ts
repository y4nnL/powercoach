import { v4 } from 'uuid'
import { ExerciseType, Lift, type Exercise } from '@/types'

const lifts: Exercise[] = [
  {
    title: 'Competition squat',
    lift: Lift.Squat
  },
  {
    title: 'Competition bench press',
    lift: Lift.BenchPress
  },
  {
    title: 'Competition deadlift',
    lift: Lift.Deadlift
  }
].map(({ title, lift }) => ({
  id: v4(),
  lift,
  title,
  type: ExerciseType.Lift
}))

const variants: Exercise[] = [
  {
    title: 'Pin squat',
    lift: Lift.Squat
  },
  {
    title: 'High bar squat',
    lift: Lift.Squat
  },
  {
    title: 'Tempo squat',
    lift: Lift.Squat
  },
  {
    title: 'Pause squat',
    lift: Lift.Squat
  },
  {
    title: 'Bench press 3CT',
    lift: Lift.BenchPress
  },
  {
    title: 'Larsen bench press',
    lift: Lift.BenchPress
  },
  {
    title: 'Middle grip bench press',
    lift: Lift.BenchPress
  },
  {
    title: 'Close grip bench press',
    lift: Lift.BenchPress
  },
  {
    title: 'Pause deadlift',
    lift: Lift.Deadlift
  },
  {
    title: 'Romanian deadlift',
    lift: Lift.Deadlift
  },
  {
    title: 'Stiff leg deadlift',
    lift: Lift.Deadlift
  }
].map(({ title, lift }) => ({
  id: v4(),
  lift,
  title,
  type: ExerciseType.Variant
}))

const legAccessories: Exercise[] = [
  'Leg extension',
  'Leg curl',
  'Hack squat',
  'Belt squat',
  'Bulgarian split squat',
  'Leg press',
  'Dumbbell lunges'
].map((title) => ({
  id: v4(),
  lift: Lift.Squat,
  title,
  type: ExerciseType.Accessory
}))

const chestAccessories: Exercise[] = [
  'Dumbbell bench press',
  'Dumbbell overhead press',
  'Dumbbell chest fly',
  'Barbell incline bench press',
  'Barbell overhead press',
  'Cable chest press',
  'Cable chest fly',
  'Chest press machine',
  'Incline chest press machine',
  'Overhead press machine',
  'Chest fly machine'
].map((title) => ({
  id: v4(),
  lift: Lift.BenchPress,
  title,
  type: ExerciseType.Accessory
}))

const armAccessories: Exercise[] = [
  'Barbell biceps curl',
  'Dumbbell biceps curl',
  'Low pulley biceps curl',
  'Barbell skull crushers',
  'Dumbbell skull crushers',
  'high pulley triceps extension'
].map((title) => ({
  id: v4(),
  lift: Lift.BenchPress,
  title,
  type: ExerciseType.Accessory
}))

const shoulderAccessories: Exercise[] = [
  'Dumbbell side lateral raise',
  'Cable side lateral raise',
  'Cable reverse fly',
  'Shoulder press machine'
].map((title) => ({
  id: v4(),
  lift: Lift.BenchPress,
  title,
  type: ExerciseType.Accessory
}))

const backAccessories: Exercise[] = [
  'Chin up',
  'Pull up',
  'Cable lat pull down',
  'Cable low row',
  'Dumbbell row',
  'Barbell row'
].map((title) => ({
  id: v4(),
  lift: Lift.Deadlift,
  title,
  type: ExerciseType.Accessory
}))

const abdominalAccessories: Exercise[] = [
  'Plank',
  'Hollow extension',
  'Bird dog',
  'Toes to bar'
].map((title) => ({
  id: v4(),
  lift: null,
  title,
  type: ExerciseType.Accessory
}))

const exercises: Exercise[] = [
  ...lifts,
  ...variants,
  ...chestAccessories,
  ...backAccessories,
  ...legAccessories,
  ...armAccessories,
  ...shoulderAccessories,
  ...abdominalAccessories
]

export default exercises
