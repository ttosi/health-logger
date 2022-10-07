import { Base } from './Base'
import { Exercise } from './'

type WorkoutType = 'weights' | 'core'

type Workout = Base & {
  type: WorkoutType
  exercises?: Array<Exercise>
}

export { Workout }
