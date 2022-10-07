import { Base } from './Base'

type Run = Base & {
  distance?: number
  duration?: string
  pace?: string
  average_pace?: string
}

export { Run }
