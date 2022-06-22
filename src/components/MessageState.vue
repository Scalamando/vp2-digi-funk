<script setup lang="ts">
import { AckState, type State } from "@/stores/state";
import { Icon } from "@iconify/vue";
import BaseButton from "./BaseButton.vue";

defineProps<{
	state: State;
}>();

function getIcon(origin: AckState) {
	const iconIdentifier: Record<AckState, string> = {
		[AckState.true]: "uil:check",
		[AckState.false]: "uil:times",
	};

	return iconIdentifier[origin];
}
</script>

<template>
	<div
		class="grid p-3 gap-x-6 gap-y-2 grid-cols-[1fr_auto] border-y-4 text-lg"
	>
		<div class="flex items-center gap-2">
			<p class="font-semibold">{{ message.type }}</p>
			<p>{{ message.planeId }}</p>
			<p>{{ message.atcAck }}</p>
            <p>{{ message.pilotAck }}</p>
			<slot></slot>
		</div>
		<slot name="details" class="col-span-2"></slot>
	</div>
</template>

