<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { Action, MessageOrigin, oneOfAction, useMessageStore } from './stores/message';
import { usePlanesStore } from './stores/planes';

const messageStore = useMessageStore();
const planeStore = usePlanesStore();

onMounted(() => {
    window.addEventListener('keydown', ({key}) => {
        if(key === "a") {
            const now = new Date();
            messageStore.addMessage({
                planeId: planeStore.getRandomPlane().id,
                origin: MessageOrigin.Pilot,
                action: oneOfAction(Action.FA),
                sent: now,
                acknowledgedByPilot: now
            });
        }

    })
});
</script>

<template>
  <RouterView />
</template>

<style>
@import "./assets/base.css";
</style>
