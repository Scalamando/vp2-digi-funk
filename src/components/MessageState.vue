<script setup lang="ts">
import type { Message } from "@/stores/message";

defineProps<{
	message: Message;
}>();

function getIcon(acknowledged: boolean) {
	return acknowledged ? "uil:check" : "uil:times";
}
</script>

<template>
	<div class="grid p-3 gap-x-6 gap-y-2 grid-cols-[1fr_auto] border-y-4 text-lg">
		<div class="flex items-center gap-2">
			<p class="font-semibold">{{ message.action }}</p>
			<p>{{ message.planeId }}</p>
			<p>{{ getIcon(message.acknowledgement === "ATC") }}</p>
			<p>{{ getIcon(message.acknowledgement === "Pilot") }}</p>
		</div>
	</div>
</template>

