// import { TimedInterface } from './Runnable'
import { Timed } from './Runnable'

// class Run extends Saveable, Runnable {
//   constructor(public startDate: string, public endDate?: string) {
//     super()
//   }
// }

class Run extends Timed {
  constructor(
    public distance?: string,
    public duration?: string,
    public pace?: string,
    public average_pace?: string
  ) {
    super()
  }
}

export { Run }
