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
          placeholder="Weight" />
        <ion-button size="large" @click="addWeight()">Add Weight</ion-button>
      </div>
    </div>
    <div class="h-3/6">
      <ion-content>
        <ion-item
          v-for="(weight, index) in bodyweights"
          :key="index"
          class="text-gray-500">
          <ion-label class="font-thin">
            {{ useDateFormat(new Date(weight.date), 'MM/DD/YYYY').value }}
            -
            <span class="font-bold text-gray-600">{{ weight.weight }} lbs</span>
          </ion-label>
          <ion-icon
            name="trash-outline"
            color="danger"
            @click="deleteBodyweight(weight)" />
        </ion-item>
      </ion-content>
    </div>
    <div class="h-2/6 items-start border-t-gray-600 border-t-2">
      <canvas id="bodyweightChart" height="190" class="m-3" />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useDateFormat } from '@vueuse/shared'
import { alertController } from '@ionic/core'
import { bodyweights as data } from '@/data'
import { Chart, registerables } from 'chart.js'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/vue'

Chart.register(...registerables)
let bodyweightChart
const bodyweight = ref(null)

if (!localStorage.getItem('bodyweights')) {
  localStorage.setItem('bodyweights', JSON.stringify(data))
}

const bodyweights = reactive(
  JSON.parse(localStorage.getItem('bodyweights')).bodyWeights
)

const addWeight = () => {
  if (!bodyweight.value) {
    alert('Weight is required')
    return
  }
  bodyweights.unshift({
    date: new Date().toString(),
    weight: bodyweight.value,
  })
  bodyweight.value = undefined
  updateChart()

  localStorage.setItem(
    'bodyweights',
    JSON.stringify({ bodyWeights: bodyweights })
  )
}

let weightToDelete
const deleteBodyweight = (weight) => {
  weightToDelete = weight
  confirmDelete()
}

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'Discard this workout?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        handler() {
          bodyweights.splice(bodyweights.indexOf(weightToDelete), 1)
          localStorage.setItem(
            'bodyweights',
            JSON.stringify({ bodyWeights: bodyweights })
          )
          updateChart()
        },
      },
    ],
  })
  await alert.present()
}

const updateChart = () => {
  bodyweightChart.data.labels = bodyweights
    .map((w) => useDateFormat(new Date(w.date), 'D').value)
    .reverse()
  bodyweightChart.data.datasets[0].data = bodyweights
    .map((w) => w.weight)
    .reverse()
  bodyweightChart.update()
}

onMounted(() => {
  const chartContext = document.getElementById(
    'bodyweightChart'
  ) as HTMLCanvasElement
  bodyweightChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: bodyweights
        .map((w) => useDateFormat(new Date(w.date), 'D').value)
        .reverse(),
      datasets: [
        {
          label: 'Body Weight',
          data: bodyweights.map((w) => w.weight).reverse(),
          borderWidth: 2,
          borderColor: '#3880FF',
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
              return value + ' lbs'
            },
          },
        },
      },
    },
  })
})
</script>

<style scoped></style>
