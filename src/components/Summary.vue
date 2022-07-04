<template>
	<div
		class="outline outline-2 grid grid-cols-[0.5fr_0.25fr_0.25fr] place-items-center"
	>
		<div class="flex">
            <p class="mr-2">{{ message.type }}:</p>
            <p>{{ message.planeId }}</p>
        </div>
		<p
			class="flex flex-col items-center border-x-2 border-black w-full"
		>
			<span>A</span>
			<Icon
				v-if="
					message.acknowledgement === 'ATC' ||
					message.acknowledgement === 'Both'
				"
				icon="uil:check"
				class="h-5 w-5"
			/>
			<Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
		</p>
		<p class="flex flex-col items-center w-full">
			<span>P</span>
			<Icon
				v-if="
					message.acknowledgement === 'Pilot' ||
					message.acknowledgement === 'Both'
				"
				icon="uil:check"
				class="h-5 w-5"
			/>
			<Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
		</p>
	</div>
</template>

<script setup lang="ts">
import type { Message } from "@/stores/message";
import { Icon } from "@iconify/vue";

defineProps<{
	message: Message;
}>();
</script>
