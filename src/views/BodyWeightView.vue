<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Body Weight</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="h-1/6">
      <div class="flex m-6">
        <ion-input
          v-model="bodyweight"
          type="number"
          class="text-xl mr-3 border border-gray-600"
          placeholder="Weight"
          @click="addWeight" />
        <ion-button size="large">Add Weight</ion-button>
      </div>
    </div>
    <div class="h-3/6">
      <ion-content>
        <ion-item
          v-for="(bodyweight, index) in sortedBodyweights"
          :key="index"
          class="text-gray-500">
          <ion-label class="font-thin">
            {{ useDateFormat(new Date(bodyweight.date), "MM/DD/YYYY").value }}
            -
            <span class="font-bold text-gray-600">
              {{ bodyweight.weight }} lbs
            </span>
          </ion-label>
        </ion-item>
      </ion-content>
    </div>
    <div class="h-2/6 items-start">
      <canvas id="bodyweightChart" height="190" class="m-3" />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useDateFormat } from "@vueuse/shared";
import { bodyweights as data } from "@/data";
import { Chart, registerables } from "chart.js";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/vue";

Chart.register(...registerables);
const bodyweight = ref(null);

if (!localStorage.getItem("bodyweights")) {
  localStorage.setItem("bodyweights", JSON.stringify(data));
}

const bodyweights = reactive(
  JSON.parse(localStorage.getItem("bodyweights")).bodyWeights
);

const sortedBodyweights = computed(() => {
  const bw = bodyweights;
  return bw.reverse();
});

const addWeight = () => {
  bodyweights.push({
    date: new Date().toString(),
    weight: bodyweight.value,
  });
  localStorage.setItem(
    "bodyweights",
    JSON.stringify({ bodyWeights: bodyweights })
  );
};

onMounted(() => {
  const chartContext = (
    document.getElementById("bodyweightChart") as HTMLCanvasElement
  )?.getContext("2d");
  new Chart(chartContext, {
    type: "line",
    data: {
      labels: bodyweights.map(
        (w) => useDateFormat(new Date(w.date), "D").value
      ),
      datasets: [
        {
          label: "Body Weight",
          data: bodyweights.map((w) => w.weight),
          borderWidth: 2,
          borderColor: "#3880FF",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 160,
          max: 190,
          ticks: {
            callback: function (value) {
              return value + " lbs";
            },
          },
        },
      },
    },
  });
});
</script>

<style scoped></style>
