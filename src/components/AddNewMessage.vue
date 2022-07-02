<script setup lang="ts">
import { Icon } from "@iconify/vue";
import BaseButton from "./BaseButton.vue";
import ActivePlanes from "@/components/ActivePlanes.vue";
import { ref } from "vue";
import type { Plane } from "@/stores/planes";

const emit = defineEmits(["close"]);

const SelectAircraft = ref<Plane>();
</script>

<template>
  <div
    class="grid grid-rows-[auto_1fr] p-3 gap-y-2 border-y-4 text-lg border-orange-400 bg-orange-50 h-full"
  >
    <div class="grid grid-cols-[auto_1fr_auto] place-self-start gap-x-6 w-full">
      <div class="rounded-full p-1.5 bg-orange-400">
        <Icon icon="bxs:user" class="h-5 w-5" />
      </div>
      <div class="flex items-center gap-2">
        <BaseButton>
          {{ SelectAircraft ? SelectAircraft.id : "Aircraft" }}
        </BaseButton>
        <BaseButton>Flightstate</BaseButton>
        <BaseButton>Action</BaseButton>
        <BaseButton>Parameter</BaseButton>
      </div>

      <div class="flex gap-1">
        <BaseButton class="!px-[4px]" @click="() => emit('close')">
          <Icon icon="uil:times" class="h-5 w-5 scale-110" />
        </BaseButton>
      </div>
    </div>
    <div class="flex justify-center items-center w-full">
      <ActivePlanes @select="(plane) => (SelectAircraft = plane)" />
    </div>
  </div>
</template>
