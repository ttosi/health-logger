<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon name="barbell-outline"></ion-icon>
          <ion-label>Workouts</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="graphs" href="/tabs/graphs">
          <ion-icon name="analytics-outline"></ion-icon>
          <ion-label>Graphs</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon name="settings-outline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  isPlatform,
} from "@ionic/vue";

watchEffect(() => {
  if (!isPlatform("mobileweb")) {
    if (useRoute().name === "graphs") {
      screen.orientation.lock("landscape");
    } else {
      screen.orientation.lock("portrait");
    }
  }
});
</script>
