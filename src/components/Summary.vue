<script setup lang="ts">
import type { Message } from "@/stores/message";
import { Icon } from "@iconify/vue";

defineProps<{
	message: Message;
}>();
</script>

<template>
	<div
		class="outline outline-2 grid grid-cols-[0.5fr_0.25fr_0.25fr] place-items-center"
	>
		<div class="flex justify-self-start px-2">
			<p class="mr-2 font-semibold">{{ message.action.id }}:</p>
			<p>{{ message.planeId }}</p>
		</div>
		<p class="flex flex-col items-center border-x-2 border-black w-full">
			<span>A</span>
			<Transition name="jump">
				<Icon
					v-if="message.acknowledgedByATC !== null"
					icon="uil:check"
					class="h-5 w-5"
				/>
				<Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
			</Transition>
		</p>
		<p class="flex flex-col items-center w-full">
			<span>P</span>
			<Transition name="jump" mode="out-in">
				<Icon
					v-if="message.acknowledgedByPilot !== null"
					icon="uil:check"
					class="h-5 w-5"
				/>
				<Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
			</Transition>
		</p>
	</div>
</template>

<style scoped>
.jump-enter-active {
	transition: all 0.3s ease-out;
}

.jump-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.jump-enter-from,
.jump-leave-to {
	transform: scale(3);
	opacity: 0;
}
</style>
