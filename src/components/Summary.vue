<template>
    <div class="mr-4 flex outline outline-2 grid grid-cols-6 gap-2 place-items-center">
        <div class="col-start-1 col-span-1">{{message.type}}: </div>
        <div class="col-start-2 col-span-2"> {{ message.planeId }}</div>
        <div class="col-start-5 col-span-1  text-center pl-6 pr-6 outline outline-2">
            A 
            <Icon v-if="message.acknowledgement === 'ATC' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5" />
            <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
        </div>
       <div class="col-start-6 col-span-1 text-center pl-6 pr-6 outline outline-2">
            P 
            <Icon v-if="message.acknowledgement === 'Pilot' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5" />
            <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { MessageOrigin, type Message } from "@/stores/message"; 
import { Icon } from "@iconify/vue";

defineProps<{
	message: Message;
}>();

</script>