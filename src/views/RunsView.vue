<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Runs</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="activeRun">
      <ion-fab vertical="top" horizontal="end" slot="fixed" class="mt-4 flex">
        <ion-fab-button color="success" size="small" @click="confirmComplete">
          <ion-icon name="checkmark-outline" />
        </ion-fab-button>
        <ion-fab-button color="danger" size="small" @click="confirmDiscard">
          <ion-icon name="trash-outline" />
        </ion-fab-button>
      </ion-fab>
    </div>
    <div class="h-2/4">
      <div class="flex justify-center items-center h-full">
        <div v-if="!activeRun">
          <ion-button expand="full" size="large" @click="newRun">
            Run
          </ion-button>
        </div>
        <div v-else class="w-full m-5">
          <div class="flex justify-center mb-5 text-3xl font-bold uppercase">
            Running
          </div>
          <div v-if="activeRun" class="col-span-3">
            <div class="grid grid-cols-2 gap-3 text-center font-normal text-lg">
              <div>
                <label>DISTANCE</label>
                <ion-input
                  v-model="activeRun.distance"
                  type="number"
                  class="pb-6 border border-gray-400 text-3xl" />
              </div>
              <div>
                <label>DURATION</label>
                <input
                  v-model="activeRun.duration"
                  v-maska="'##:##'"
                  class="input p-[10px] w-full text-center text-3xl border border-gray-400"
                  pattern="[0-9]*"
                  inputmode="numeric" />
              </div>
              <div>
                <label>PACE</label>
                <input
                  v-model="activeRun.pace"
                  v-maska="'##:##'"
                  class="input p-[10px] w-full text-center text-3xl border border-gray-400"
                  pattern="[0-9]*"
                  inputmode="numeric" />
              </div>
              <div>
                <label>AVERAGE PACE</label>
                <input
                  v-model="activeRun.average_pace"
                  v-maska="'##:##'"
                  class="input p-[10px] w-full text-center text-3xl border border-gray-400"
                  pattern="[0-9]*"
                  inputmode="numeric" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-gray-600 border-t h-1/4">
      <ion-content>
        <ion-item v-for="(run, index) in sortedRuns" :key="index">
          <ion-label class="font-thin">
            <div class="flex justify-between text-xs">
              <div>
                <span class="font-semibold">{{ run.distance }}</span>
                mi for
                <span class="font-semibold">
                  {{ run.duration.substr(0, 2) }}
                </span>
                mins, pace
                <span class="font-semibold">
                  {{ run.average_pace.substr(0, 2) }}
                </span>
                mpm
              </div>
              <div>
                {{ useTimeAgo(run.startDate).value }}
              </div>
            </div>
          </ion-label>
        </ion-item>
      </ion-content>
    </div>
    <div class="border-t-gray-600 border-t h-1/4">
      <canvas id="runsChart" height="150" class="m-3" />
    </div>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/vue'
import { computed } from '@vue/reactivity'
import { useDateFormat, useTimeAgo } from '@vueuse/core'
import { alertController } from '@ionic/core'
import { Chart, registerables } from 'chart.js'
import { runs as data } from '@/data'

if (!localStorage.getItem('runs')) {
  localStorage.setItem('runs', JSON.stringify(data))
}

Chart.register(...registerables)
let runsChart
const runs = reactive(JSON.parse(localStorage.getItem('runs')).runs)
const activeRun = ref(null)

const newRun = () => {
  activeRun.value = {
    startDate: new Date().toString(),
    endDate: null,
  }
}

const completeRun = () => {
  activeRun.value.endDate = new Date().toString()
  runs.push(activeRun.value)

  localStorage.setItem('runs', JSON.stringify({ runs: runs }))
  activeRun.value = undefined
  updateChart()
}

const sortedRuns = computed(() => {
  return runs.sort(
    (a: any, b: any) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
})

const confirmComplete = async () => {
  const alert = await alertController.create({
    header: 'Complete this run?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Complete',
        role: 'confirm',
        handler() {
          completeRun()
        },
      },
    ],
  })
  await alert.present()
}

const confirmDiscard = async () => {
  const alert = await alertController.create({
    header: 'Discard this run?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Discard',
        role: 'confirm',
        handler() {
          activeRun.value = null
          activeRun.value = undefined
        },
      },
    ],
  })
  await alert.present()
}

const updateChart = () => {
  runsChart.data.labels = runs
    .map((r) => useDateFormat(new Date(r.startDate), 'D').value)
    .reverse()
  runsChart.data.datasets[0].data = runs.map((r) => r.distance).reverse()
  runsChart.update()
}

onMounted(() => {
  const chartContext = document.getElementById('runsChart') as HTMLCanvasElement
  runsChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: runs
        .map((r) => useDateFormat(new Date(r.startDate), 'D').value)
        .reverse(),
      datasets: [
        {
          label: 'Distance',
          data: runs.map((r) => r.distance).reverse(),
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
          ticks: {
            callback: function (value: number) {
              return Math.round(value * 100) / 100 + ' mi'
            },
          },
        },
      },
    },
  })
})
</script>

<style scoped></style>
