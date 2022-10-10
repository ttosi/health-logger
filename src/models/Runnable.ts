import { BaseClass } from './BaseInterface'
import { Run } from './Run'

interface SaveableInterface extends BaseClass {
  get(): void
  save(): void
}

interface TimedInterface extends BaseClass {
  startDate?: string
  endDate?: string
  start(): void
  finish(run: Run): void
}

abstract class Timed implements TimedInterface, SaveableInterface {
  public startDate?: string
  public endDate?: string

  start(): void {
    console.log('start')
    this.startDate = new Date().toString()
  }
  finish(run: Run): void {
    this.endDate = new Date().toString()
    console.log('finish', run)
  }
  get(): void {
    console.log('get')
    // this.startDate = new Date().toString()
  }
  save(): void {
    console.log('save')
    // this.endDate = new Date().toString()
  }
}

// abstract class Saveable

// interface base {
//   startTime: string,
//   endTime: string,
//   start(): void,
//   finish(): void
// }

// interface

// abstract class Runnable implements BaseInterface {
//   public startDate: string
//   public endDate?: string

//   start(): void {
//     this.startDate = new Date().toString()
//   }

//   end(): void {
//     this.endDate = new Date().toString()
//   }
// }

// abstract class Saveable {
//   constructor(public key: string) {}

//   load(): object {
//     console.log(this.key)
//     const test = {
//       testing: "df"
//     }
//     return test
//   }

//   save(data: object) {
//     console.log(data)
//   }
// }

export { TimedInterface, SaveableInterface, Timed }
