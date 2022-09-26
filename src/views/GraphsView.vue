<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Graphs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Graphs</ion-title>
        </ion-toolbar>
      </ion-header>
      Hello graphs tab
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
  isPlatform,
} from "@ionic/vue";

onMounted(() => {
  if (!isPlatform("mobileweb")) {
    screen.orientation.unlock();
    screen.orientation.lock("landscape");
  }
});
</script>
