import { BaseClass } from './BaseInterface'

interface RunInterface extends BaseClass {
  distance?: number
  duration?: string
  pace?: string
  average_pace?: string
}

export { RunInterface }
