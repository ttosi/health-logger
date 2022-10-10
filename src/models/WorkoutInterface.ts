import { BaseClass } from './BaseInterface'
import { ExerciseInterface } from './ExerciseInterface'

type WorkoutType = 'weights' | 'core'

interface WorkoutInterface extends BaseClass {
  type: WorkoutType
  exercises?: Array<ExerciseInterface>
}

export { WorkoutInterface }
