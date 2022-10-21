<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workouts</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="activeWorkout">
      <ion-fab vertical="top" horizontal="end" slot="fixed" class="mt-4 flex">
        <ion-fab-button color="success" size="small" @click="confirmComplete">
          <ion-icon name="checkmark-outline" />
        </ion-fab-button>
        <ion-fab-button color="danger" size="small" @click="confirmDiscard">
          <ion-icon name="trash-outline" />
        </ion-fab-button>
      </ion-fab>
    </div>
    <div class="h-2/3">
      <div class="flex justify-center items-center h-full">
        <div v-if="!activeWorkout">
          <ion-button expand="full" size="large" @click="newWorkout('weights')">
            Upper Body Workout
          </ion-button>
          <ion-button
            expand="full"
            size="large"
            class="my-3"
            @click="newWorkout('core')">
            Core Workout
          </ion-button>
        </div>
        <div v-else class="w-full m-5">
          <div class="flex justify-center mb-5 text-4xl font-bold uppercase">
            {{ activeWorkout.type }}
          </div>
          <div
            v-if="
              activeWorkout.type === 'weights' || activeWorkout.type === 'core'
            ">
            <div class="col-span-3 text-center text-white">
              <ion-select
                v-model="currentExercise"
                interface="action-sheet"
                placeholder="Select Exercise"
                class="bg-blue-500 uppercase text-2xl"
                @ionChange="addExercise">
                <ion-select-option
                  v-for="exercise in filteredExercises"
                  :value="exercise"
                  :key="exercise"
                  class="uppercase font-bold">
                  {{ exercise.text }}
                </ion-select-option>
              </ion-select>
            </div>
            <div
              v-if="currentExercise"
              class="w-full text-center my-2 text-2xl font-semibold flex justify-between">
              <div class="mt-2">{{ currentExercise.text }}</div>
              <div v-if="currentExercise.inputType === 'duration'" class="flex">
                <div>
                  <ion-button
                    size="default"
                    @click="toggleTimer"
                    class="mb-2"
                    :color="timerInstance === 0 ? 'primary' : 'danger'">
                    {{ timerInstance === 0 ? 'START' : 'STOP' }}
                  </ion-button>
                </div>
                <div class="font-normal mt-2 ml-2">{{ timer }}</div>
              </div>
            </div>
            <div
              v-if="activeWorkout.exercises.length > 0"
              class="mt-3 grid grid-cols-3 gap-5 w-full text-center justify-between font-bold text-4xl">
              <div v-for="(val, index) in activeExercise" :key="index">
                <div
                  v-if="currentExercise.inputType === 'number'"
                  class="border border-gray-400 items-center pt-1">
                  <ion-select
                    v-model="activeExercise[index]"
                    interface="action-sheet"
                    class="pr-3">
                    <ion-select-option
                      :value="weight"
                      v-for="weight in weights"
                      :key="weight">
                      {{ weight }}
                    </ion-select-option>
                  </ion-select>
                </div>
                <div v-if="currentExercise.inputType === 'duration'">
                  <input
                    v-model="activeExercise[index]"
                    v-maska="'##:##'"
                    class="input p-[10px] w-full text-center text-2xl border border-gray-400"
                    pattern="[0-9]*"
                    inputmode="numeric" />
                </div>
              </div>
            </div>
            <div v-show="currentExercise" class="flex mt-5">
              <ion-button
                expand="block"
                size="large"
                class="w-1/2 m-0 mr-5"
                @click="navigateExercise('prev')">
                Prev
              </ion-button>
              <ion-button
                expand="block"
                size="large"
                fill="solid"
                class="w-1/2 m-0"
                @click="navigateExercise('next')">
                Next
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-gray-600 border-t h-1/3">
      <ion-content>
        <ion-item v-for="(workout, index) in sortedWorkouts" :key="index">
          <ion-label class="font-thin">
            <div class="text-left w-full justify-between flex">
              <div>
                <span class="font-semibold uppercase">{{ workout.type }}</span>
                for
                {{
                  useDateFormat(
                    new Date(workout.endDate).getTime() -
                      new Date(workout.startDate).getTime(),
                    'm'
                  ).value
                }}
                minutes
              </div>
              <div>
                {{ useTimeAgo(new Date(workout.endDate)).value }}
              </div>
            </div>
          </ion-label>
        </ion-item>
      </ion-content>
    </div>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/vue'
import { computed, toRaw } from '@vue/reactivity'
import { useDateFormat, useTimeAgo } from '@vueuse/core'
import { alertController } from '@ionic/core'
import { exercises, workouts as data } from '@/data'

if (!localStorage.getItem('workouts')) {
  localStorage.setItem('workouts', JSON.stringify(data))
}

const workouts = reactive(JSON.parse(localStorage.getItem('workouts')).workouts)
const activeWorkout = ref(null)
const currentExercise = ref(null)
const weights = []
for (let w = 0; w <= 180; w += 5) weights.push(w)

const newWorkout = (type: string) => {
  currentExercise.value = undefined
  activeWorkout.value = {
    startDate: new Date().toString(),
    endDate: null,
    type: type,
  }
  activeWorkout.value.exercises = []
}

const addExercise = () => {
  clearInterval(timerInstance.value)
  timerInstance.value = 0
  timer.value = '00:00'

  // don't add if exercise has already
  // been added to this workout
  if (
    activeWorkout.value.exercises.find(
      (e: any) => e.id === currentExercise.value.id
    )
  ) {
    return
  }

  // get the previous workout's values
  // (e.g., what weights were used last)
  // and add to current workout
  const lastValues = sortedWorkouts.value
    .filter((sw) => sw.type === activeWorkout.value.type)[0]
    .exercises.find((ex) => ex.id === currentExercise.value.id)

  activeWorkout.value.exercises.splice(0, 0, {
    id: currentExercise.value.id,
    values: toRaw(lastValues ? lastValues.values : [0, 0, 0]),
  })
}

const navigateExercise = (dir) => {
  // grab the exercise's current index
  let exerciseIndex = filteredExercises.value.findIndex(
    (e) => e.id === currentExercise.value.id
  )

  // navigate and check if bounds are exceeded
  dir === 'prev' ? exerciseIndex-- : exerciseIndex++
  if (exerciseIndex < 0 || exerciseIndex >= filteredExercises.value.length) {
    return
  }

  currentExercise.value = filteredExercises.value[exerciseIndex]
  addExercise()
}

const timerInstance = ref(0)
const timer = ref('00:00')
const toggleTimer = () => {
  let seconds = 0
  if (timerInstance.value !== 0) {
    clearInterval(timerInstance.value)
    timerInstance.value = 0
    return
  }

  timerInstance.value = setInterval(() => {
    seconds++
    timer.value = `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')}:${(seconds - Math.floor(seconds / 60) * 60)
      .toString()
      .padStart(2, '0')}`
  }, 1000)
}

const completeWorkout = () => {
  activeWorkout.value.endDate = new Date().toString()
  workouts.push(activeWorkout.value)

  localStorage.setItem('workouts', JSON.stringify({ workouts: workouts }))
  activeWorkout.value = undefined
}

const sortedWorkouts = computed(() => {
  return workouts.sort(
    (a: any, b: any) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
})

const filteredExercises = computed(() => {
  return exercises.filter((e) => e.type === activeWorkout.value.type)
})

const activeExercise = computed(() => {
  return activeWorkout.value.exercises.find(
    (ex) => ex.id === currentExercise.value.id
  ).values
})

const confirmComplete = async () => {
  const alert = await alertController.create({
    header: 'Complete this workout session?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Complete',
        role: 'confirm',
        handler() {
          completeWorkout()
        },
      },
    ],
  })
  await alert.present()
}

const confirmDiscard = async () => {
  const alert = await alertController.create({
    header: 'Discard this workout?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Discard',
        role: 'confirm',
        handler() {
          activeWorkout.value = null
          activeWorkout.value = undefined
        },
      },
    ],
  })
  await alert.present()
}
</script>

<style scoped>
ion-select::part(icon) {
  display: none !important;
  --placeholder-color: white;
}

ion-select::part(placeholder) {
  color: white;
  opacity: 1;
}
</style>
