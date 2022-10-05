export default interface Base {
  startDate: string
  endDate?: string
  type: string
}

// const workouts: Array<Workout> = [
//   ...reactive(JSON.parse(localStorage.getItem('workouts')).workouts),
// ]
// let activeWorkout: Workout = ref(null) as Workout
// const activeWorkout: Ref<Workout> = ref(null)
