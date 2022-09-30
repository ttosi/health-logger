<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workouts</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="h-2/3">
      <div class="flex justify-center items-center h-full">
        <div v-if="!activeWorkout">
          <ion-button expand="full" size="large" class="" @click="newWorkout">
            Start New Workout
          </ion-button>
          <!-- <ion-input
            v-maska="'##:##'"
            class="border"
            pattern="[0-9]*"
            inputmode="numeric" /> -->
        </div>
        <div
          v-else
          class="grid grid-cols-3 gap-3 w-full m-5 text-3xl font-extrabold">
          <div class="col-span-3 text-center font-medium text-sm mb-0 pb-0">
            Working out on
            {{
              useDateFormat(activeWorkout.startDate, "M/DD/YYYY (ddd)").value
            }}
          </div>
          <ion-fab
            vertical="top"
            horizontal="end"
            slot="fixed"
            class="mt-4 flex">
            <ion-fab-button
              color="success"
              size="small"
              @click="confirmComplete">
              <ion-icon name="checkmark-outline"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="danger" size="small" @click="confirmDiscard">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
          <div class="col-span-3 text-center border">
            <ion-select
              v-model="currentExercise"
              interface="action-sheet"
              placeholder="Exercise"
              class="bg-blue-500 text-white font-normal"
              cancelText="Cancel">
              <ion-select-option
                v-for="exercise in exercises"
                :key="exercise.value"
                :value="exercise.value">
                {{ exercise.text }}
              </ion-select-option>
              <ion-select-option value="run">Run</ion-select-option>
            </ion-select>
          </div>
          <div
            v-if="currentExercise !== 'run'"
            class="grid grid-cols-3 gap-5 col-span-3 h-20">
            <div
              class="justify-center items-center flex border-gray-300 border">
              <ion-select
                v-model="currentWeights[0]"
                interface="action-sheet"
                cancelText="Cancel"
                class="pr-3">
                <ion-select-option
                  v-for="weight in weights"
                  :key="weight"
                  :value="weight">
                  {{ weight }}
                </ion-select-option>
              </ion-select>
            </div>
            <div
              class="justify-center items-center flex border-gray-300 border">
              <ion-select
                v-model="currentWeights[1]"
                interface="action-sheet"
                cancelText="Cancel"
                class="pr-3">
                <ion-select-option
                  v-for="weight in weights"
                  :key="weight"
                  :value="weight">
                  {{ weight }}
                </ion-select-option>
              </ion-select>
            </div>
            <div
              class="justify-center items-center flex border-gray-300 border">
              <ion-select
                v-model="currentWeights[2]"
                interface="action-sheet"
                cancelText="Cancel"
                class="pr-3">
                <ion-select-option
                  v-for="weight in weights"
                  :key="weight"
                  :value="weight">
                  {{ weight }}
                </ion-select-option>
              </ion-select>
            </div>
          </div>
          <div v-else class="col-span-3">
            <div class="grid grid-cols-2 gap-3 text-center font-normal text-lg">
              <div>
                <ion-input
                  v-model="activeWorkout.run.duration"
                  type="number"
                  placeholder="Duration"
                  class="border" />
              </div>
              <div>
                <ion-input
                  v-model="activeWorkout.run.distance"
                  type="number"
                  placeholder="Distance"
                  class="border" />
              </div>
              <div>
                <ion-input
                  v-model="activeWorkout.run.pace"
                  type="number"
                  placeholder="Pace"
                  class="border" />
              </div>
              <div>
                <ion-input
                  v-model="activeWorkout.run.average_pace"
                  type="number"
                  placeholder="Average Pace"
                  class="border" />
              </div>
            </div>
          </div>
          <div class="col-span-3 text-center flex">
            <ion-button
              expand="block"
              size="large"
              class="w-1/2 mx-2"
              @click="prevExercise">
              Prev
            </ion-button>
            <ion-button
              expand="block"
              size="large"
              fill="solid"
              class="w-1/2 mx-2"
              @click="nextExercise">
              Next
            </ion-button>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-gray-600 border-t h-1/3">
      <ion-content>
        <ion-item v-for="(workout, index) in sortedWorkouts" :key="index">
          <div class="flex w-full">
            <div class="text-left w-full">
              <ion-label class="font-thin">
                {{ useDateFormat(new Date(workout.startDate), "dddd").value }},
                {{ useTimeAgo(new Date(workout.endDate)).value }}
                for
                <span>
                  {{
                    useDateFormat(
                      new Date(workout.endDate).getTime() -
                        new Date(workout.startDate).getTime(),
                      "m"
                    ).value
                  }}
                  minutes
                </span>
              </ion-label>
            </div>
            <div class="text-right w-full">
              <ion-icon
                name="close-circle-outline"
                size="small"
                color="danger"
                class="mr-3"
                @click="deleteWorkout(workout)"></ion-icon>
            </div>
          </div>
        </ion-item>
      </ion-content>
    </div>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from "@ionic/vue";
import { computed, toRaw } from "@vue/reactivity";
import { useDateFormat, useTimeAgo } from "@vueuse/core";
import { exercises, weights, workouts as data } from "@/data";
import { alertController } from "@ionic/core";

if (!localStorage.getItem("workouts")) {
  localStorage.setItem("workouts", JSON.stringify(data));
}

const workouts = reactive(
  JSON.parse(localStorage.getItem("workouts")).workouts
);
const activeWorkout = ref(null);
const currentExercise = ref("dip");

const currentWeights = computed(() => {
  const exercise = activeWorkout.value.exercises.find(
    (e: any) => e.exercise === currentExercise.value
  );
  return exercise.weights;
});

const sortedWorkouts = computed(() => {
  return workouts.sort(
    (a: any, b: any) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
});

const prevExercise = () => {
  const idx = getExerciseIndex() - 1;
  if (idx < 0) {
    currentExercise.value =
      activeWorkout.value.exercises[
        activeWorkout.value.exercises.length - 1
      ].exercise;
    return;
  }
  currentExercise.value = activeWorkout.value.exercises[idx].exercise;
};

const nextExercise = () => {
  const idx = getExerciseIndex() + 1;
  if (idx >= activeWorkout.value.exercises.length) {
    currentExercise.value = activeWorkout.value.exercises[0].exercise;
    return;
  }
  currentExercise.value = activeWorkout.value.exercises[idx].exercise;
};

function getExerciseIndex() {
  return activeWorkout.value.exercises.findIndex(
    (e) => e.exercise === currentExercise.value
  );
}

const newWorkout = () => {
  currentExercise.value = "dip";
  const lastWorkout = sortedWorkouts.value[0];
  activeWorkout.value = {
    startDate: new Date().toString(),
    endDate: null,
    exercises: toRaw(lastWorkout.exercises),
    run: {
      duration: null,
      distance: null,
      pace: null,
      average_pace: null,
    },
  };
};

const deleteWorkout = (workout) => {
  workouts.splice(workouts.indexOf(workout), 1);
  localStorage.setItem("workouts", JSON.stringify({ workouts: workouts }));
};

const completeExercise = () => {
  activeWorkout.value.endDate = new Date().toString();
  workouts.push(activeWorkout.value);
  activeWorkout.value = undefined;
  localStorage.setItem("workouts", JSON.stringify({ workouts: workouts }));
};

const confirmComplete = async () => {
  const alert = await alertController.create({
    header: "Complete this workout session?",
    buttons: [
      {
        text: "Complete",
        role: "confirm",
        handler() {
          completeExercise();
        },
      },
      { text: "Cancel", role: "cancel" },
    ],
  });
  await alert.present();
};

const confirmDiscard = async () => {
  const alert = await alertController.create({
    header: "Discard this workout?",
    buttons: [
      {
        text: "Discard",
        role: "confirm",
        handler() {
          activeWorkout.value = null;
        },
      },
      { text: "Cancel", role: "cancel" },
    ],
  });
  await alert.present();
};
</script>

<style scoped>
ion-select::part(icon) {
  display: none !important;
}
</style>
