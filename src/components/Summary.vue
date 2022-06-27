<template>
    <div class="mr-4 p-3 flex outline outline-2">
        {{message.type}}: {{ message.planeId }}
        <div class="p-3 ml-2 mr-2 flex text-right">
            <div class="text-center items-center outline outline-2 p-3">
                A 
                <Icon v-if="message.acknowledgement == 'ATC' || 'Pilot'" icon="uil:check" class="h-5 w-5" />
                <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
            </div>
            <div class="text-center items-center outline outline-2 p-3">
                P 
                <Icon v-if="message.acknowledgement == 'Pilot'" icon="uil:check" class="h-5 w-5" />
                <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
            </div>
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