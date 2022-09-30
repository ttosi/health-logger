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
          <ion-button
            expand="full"
            size="large"
            class=""
            @click="newWorkout('weight')">
            Start New Weight Workout
          </ion-button>
          <ion-button
            expand="full"
            size="large"
            class=""
            @click="newWorkout('core')">
            Start New Core Workout
          </ion-button>
          <ion-button
            expand="full"
            size="large"
            class=""
            @click="newWorkout('run')">
            Start New Run
          </ion-button>
        </div>
        <div v-else class="w-full m-5">
          <div class="col-span-3 text-center text-white">
            <ion-select
              v-model="currentExercise"
              interface="action-sheet"
              placeholder="Select Exercise"
              class="bg-blue-500 uppercase text-2xl"
              @ionChange="addExercise">
              <ion-select-option
                v-for="exercise in filteredExercises"
                :value="exercise.id"
                :key="exercise.id"
                class="uppercase font-bold">
                {{ exercise.text }}
              </ion-select-option>
            </ion-select>
          </div>
          <div
            v-if="activeWorkout.exercises.length > 0"
            class="mt-3 grid grid-cols-3 gap-5 w-full text-center justify-between font-bold text-4xl">
            <div
              v-for="(lastValue, index) in activeWorkout.exercises[0].values"
              :key="index"
              class="border border-gray-400 items-center">
              <ion-select
                v-model="activeWorkout.exercises[0].values[index]"
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
          </div>
          <div class="flex mt-3">
            <ion-button
              expand="block"
              size="large"
              class="w-1/2"
              @click="navigateExercise('prev')">
              Prev
            </ion-button>
            <ion-button
              expand="block"
              size="large"
              fill="solid"
              class="w-1/2"
              @click="navigateExercise('next')">
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
              <!-- <ion-icon
                name="close-circle-outline"
                size="small"
                color="danger"
                class="mr-3"
                @click="deleteWorkout(workout)"></ion-icon> -->
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
import { alertController } from "@ionic/core";
// import { maska } from "maska";
import { exercises, weights, workouts as data } from "@/data";

if (!localStorage.getItem("workouts")) {
  localStorage.setItem("workouts", JSON.stringify(data));
}

const activeWorkout = ref(null);
const currentExercise = ref(null);
const workouts = reactive(
  JSON.parse(localStorage.getItem("workouts")).workouts
);

const newWorkout = (type) => {
  activeWorkout.value = {
    startDate: new Date().toString(),
    endDate: null,
    type: type,
  };

  if (type === "run") {
    activeWorkout.value.run = {
      duration: 0,
      distance: 0,
      pace: 0,
      average_pace: 0,
    };
  } else {
    activeWorkout.value.exercises = [];
  }
};

// const lastWorkout = computed(() => {
//   return workouts[0];
// });

const activeExercise = computed(() => {
  return null;
});

const sortedWorkouts = computed(() => {
  return workouts.sort(
    (a: any, b: any) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
});

const filteredExercises = computed(() => {
  return exercises.filter((e) => e.type === activeWorkout.value.type);
});

// const currentExerciseValues = computed(() => {
//   const exercise = lastWorkout.value.exercises[0];
//   return exercise.value;
// });

const addExercise = () => {
  // console.log("last", sortedWorkouts.value[0].exercises);
  // console.log("act-->", currentExercise);
  if (
    activeWorkout.value.exercises.findIndex(
      (e) => e.id === currentExercise.value
    ) >= 0
  ) {
    return;
  }

  const lastValues = sortedWorkouts.value[0].exercises.find(
    (e) => e.id === currentExercise.value
  );
  // console.log("lv", lastValues);
  activeWorkout.value.exercises.splice(0, 0, {
    id: currentExercise.value,
    values: lastValues.values,
  });
  // console.log("add", activeWorkout.value);
};

// const navigateExercise = (dir) => {
//   const currentExerciseIndex = exercises.findIndex(
//     (e) => e.id === currentExercise.value
//   );
//   console.log("idx", currentExerciseIndex);

//   switch (dir) {
//     case "prev":

//       break;
//     case "next":
//       break;
//   }

// const idx = getExerciseIndex() - 1;
// if (idx < 0) {
//   currentExercise.value =
//     activeWorkout.value.exercises[
//       activeWorkout.value.exercises.length - 1
//     ].exercise;
//   return;
// }
// currentExercise.value = activeWorkout.value.exercises[idx].exercise;
// };

const navigateExercise = (d) => {
  console.log(activeWorkout.value);
  // const idx = getExerciseIndex() + 1;
  // if (idx >= activeWorkout.value.exercises.length) {
  //   currentExercise.value = activeWorkout.value.exercises[0].exercise;
  //   return;
  // }
  // currentExercise.value = activeWorkout.value.exercises[idx].exercise;
};

// const currentWeights = computed(() => {
//   const exercise = activeWorkout.value.exercises.find(
//     (e: any) => e.exercise === currentExercise.value
//   );
//   return exercise.weights;
// });

// const sortedWorkouts = computed(() => {
//   return workouts.sort(
//     (a: any, b: any) =>
//       new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
//   );
// });

// const prevExercise = () => {
//   const idx = getExerciseIndex() - 1;
//   if (idx < 0) {
//     currentExercise.value =
//       activeWorkout.value.exercises[
//         activeWorkout.value.exercises.length - 1
//       ].exercise;
//     return;
//   }
//   currentExercise.value = activeWorkout.value.exercises[idx].exercise;
// };

// const nextExercise = () => {
//   const idx = getExerciseIndex() + 1;
//   if (idx >= activeWorkout.value.exercises.length) {
//     currentExercise.value = activeWorkout.value.exercises[0].exercise;
//     return;
//   }
//   currentExercise.value = activeWorkout.value.exercises[idx].exercise;
// };

// function getExerciseIndex() {
//   return activeWorkout.value.exercises.findIndex(
//     (e) => e.exercise === currentExercise.value
//   );
// }

// const newWorkout = () => {
//   currentExercise.value = "dip";
//   const lastWorkout = sortedWorkouts.value[0];
//   activeWorkout.value = {
//     startDate: new Date().toString(),
//     endDate: null,
//     exercises: toRaw(lastWorkout.exercises),
//     run: {
//       duration: null,
//       distance: null,
//       pace: null,
//       average_pace: null,
//     },
//   };
// };

// const deleteWorkout = (workout) => {
//   workouts.splice(workouts.indexOf(workout), 1);
//   localStorage.setItem("workouts", JSON.stringify({ workouts: workouts }));
// };

// const completeExercise = () => {
//   activeWorkout.value.endDate = new Date().toString();
//   workouts.push(activeWorkout.value);
//   activeWorkout.value = undefined;
//   localStorage.setItem("workouts", JSON.stringify({ workouts: workouts }));
// };

// const confirmComplete = async () => {
//   const alert = await alertController.create({
//     header: "Complete this workout session?",
//     buttons: [
//       {
//         text: "Complete",
//         role: "confirm",
//         handler() {
//           completeExercise();
//         },
//       },
//       { text: "Cancel", role: "cancel" },
//     ],
//   });
//   await alert.present();
// };

// const confirmDiscard = async () => {
//   const alert = await alertController.create({
//     header: "Discard this workout?",
//     buttons: [
//       {
//         text: "Discard",
//         role: "confirm",
//         handler() {
//           activeWorkout.value = null;
//         },
//       },
//       { text: "Cancel", role: "cancel" },
//     ],
//   });
//   await alert.present();
// };
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
