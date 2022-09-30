<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Graphs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div>
        <div>
          <canvas id="weightChart" />
        </div>
        <div>
          <canvas id="coreChart" />
        </div>
        <div>
          <canvas id="runChart" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { Chart, registerables } from "chart.js";
import { useDateFormat } from "@vueuse/core";
import { chartcolors } from "@/data";
Chart.register(...registerables);

const workouts = JSON.parse(localStorage.getItem("workouts")).workouts;

let chartData = {};
workouts.forEach((wo: any) => {
  const exercises = wo.exercises.map((ex: any) => {
    return {
      exercise: ex.exercise,
      weight: Math.round(ex.weights.reduce((sum: any, w: any) => sum + w) / 3),
    };
  });
  exercises.forEach((ex: any) => {
    if (!chartData[ex.exercise]) {
      chartData[ex.exercise] = [];
    }
    chartData[ex.exercise].push(ex.weight);
  });
});

const weightData = Object.keys(chartData).map((k, index) => {
  return {
    label: k,
    data: chartData[k],
    borderWidth: 2,
    backgroundColor: chartcolors[index],
    borderColor: chartcolors[index],
  };
});

const weights = {
  config: {},
  context: undefined,
  labels: workouts.map(
    (w: any) => useDateFormat(new Date(w.startDate), "D").value
  ),
  render() {
    new Chart(this.context, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: weightData,
      },
      plugins: [
        {
          id: "canvas_backgroundColor",
          beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ],
      options: {
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return value + " lbs";
              },
            },
          },
        },
      },
    });
  },
};

onMounted(() => {
  weights.context = (
    document.getElementById("weightChart") as HTMLCanvasElement
  )?.getContext("2d");
  weights.render();
});
</script>
