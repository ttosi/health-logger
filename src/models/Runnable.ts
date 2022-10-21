import { BaseClass } from './BaseInterface'
// import { Run } from './Run'

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
  public startDate: string
  public endDate?: string

  start(): void {
    this.startDate = new Date().toString()
  }
  finish(): void {
    this.endDate = new Date().toString()
  }
  get(): void {
    console.log('get')
  }
  save(): void {
    console.log('save')
  }
}

class Run extends Timed {
  public duration: number
  public distance: number
}

const run = new Run()
run.start()
setTimeout(() => {
  run.finish()
  console.log(run)
}, 7250)

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
