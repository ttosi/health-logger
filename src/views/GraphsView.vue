<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Graphs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item v-for="(chart, index) in weightData" :key="index">
        <canvas :id="chart.id" width="200" height="40"></canvas>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
} from '@ionic/vue'
import { useDateFormat } from '@vueuse/core'
import { chartconfig, exercises } from '@/data'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const workouts = JSON.parse(localStorage.getItem('workouts')).workouts
const weightWorkouts = workouts.filter((w) => w.type === 'weights')
const chartLabels = weightWorkouts.map(
  (w: any) => useDateFormat(new Date(w.startDate), 'D').value
)

let chartData = {}
weightWorkouts.forEach((wo: any) => {
  const exercises = wo.exercises.map((ex: any) => {
    return {
      id: ex.id,
      value: Math.round(ex.values.reduce((sum: any, w: any) => sum + w) / 3),
    }
  })
  exercises.forEach((ex: any) => {
    if (!chartData[ex.id]) {
      chartData[ex.id] = []
    }
    chartData[ex.id].push(ex.value)
  })
})

const weightData = Object.keys(chartData).map((k) => {
  return {
    label: exercises.find((e) => e.id === k).text,
    id: k,
    data: chartData[k],
    fill: true,
    borderWidth: 2,
    borderColor: '#3880FF',
    backgroundColor: '#b0c5e8',
  }
})

onMounted(() => {
  weightData.forEach((w) => {
    const context = document.getElementById(w.id) as HTMLCanvasElement
    const config = {
      ...chartconfig,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: w.label,
            fill: true,
            borderWidth: 2,
            borderColor: '#3880FF',
            backgroundColor: '#b0c5e8',
            data: w.data,
          },
        ],
      },
    }
    new Chart(context, config)
  })
})
</script>
