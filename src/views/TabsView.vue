<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon name="barbell-outline" />
          <ion-label>Workouts</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="runs" href="/tabs/runs">
          <ion-icon name="fitness-outline" />
          <ion-label>Runs</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="bodyweight" href="/tabs/bodyweight">
          <ion-icon name="body-outline" />
          <ion-label>Body Weight</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="graphs" href="/tabs/graphs">
          <ion-icon name="analytics-outline" />
          <ion-label>Graphs</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue'
</script>
