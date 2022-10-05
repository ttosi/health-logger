import Base from './Base'
import Exercise from './Exercise'

export default interface Workout extends Base {
  exercises: Array<Exercise>
}
