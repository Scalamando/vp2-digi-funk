<script setup lang="ts">
import { usePlanesStore } from "@/stores/planes";
import { storeToRefs } from "pinia";

const emit = defineEmits(["select"]);

const planeStore = usePlanesStore();
const { planes } = storeToRefs(planeStore);
</script>

<template>
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(12ch,1fr))] gap-0.5 outline outline-2 rounded-lg overflow-hidden activePlanes"
  >
    <button
      v-for="plane in planes"
      @click="() => emit('select', plane)"
      class="outline outline-2 outline-slate-900 text-xl inline-flex justify-center items-center"
    >
      {{ plane.id }}
    </button>
  </div>
</template>
