<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Body Weight</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="h-1/6">
      <div class="flex m-10">
        <ion-input
          v-model="bodyweight"
          type="number"
          class="text-xl mr-3 border border-gray-600"
          placeholder="Weight" />
        <ion-button size="large">Add Weight</ion-button>
      </div>
    </div>
    <div class="h-3/6">
      <ion-content>
        <ion-item
          v-for="(bodyweight, index) in bodyweights"
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
      <LineChart
        :chartData="testData"
        :height="200"
        class="m-3"
        :options="chartOptions" />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useDateFormat } from "@vueuse/shared";
import { bodyweights as data } from "@/data";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartOptions = {
  // responsive: true,
  // height: 100,
  legend: {
    display: false,
  },
  options: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    yAxis: [
      {
        min: 200,
        max: 100,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

if (!localStorage.getItem("bodyweights")) {
  localStorage.setItem("bodyweights", JSON.stringify(data));
}

const bodyweights = reactive(
  JSON.parse(localStorage.getItem("bodyweights")).bodyWeights
);

console.log(bodyweights);

const bodyweight = ref();

const weights = bodyweights.map((w) => w.weight);
const labels = bodyweights.map(
  (w) => useDateFormat(new Date(w.date), "D").value
);
console.log(labels);

// const labels =  Chart.Utils.months({count: 7});?\
const testData = {
  labels: labels,
  datasets: [
    {
      label: "Body Weight",
      data: weights,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      // tension: 0.1,
    },
  ],
  options: {
    legend: {
      display: false,
    },
  },
};
</script>

<style scoped></style>
