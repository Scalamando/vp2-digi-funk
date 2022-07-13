<script setup lang="ts">
import { getTimeStamp, useMessageStore, type Message } from "@/stores/message";
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";

const props = defineProps<{
	message: Message;
}>();

const notSeen = ref(false);
watch(
	[
		() => props.message.acknowledgedByATC,
		() => props.message.acknowledgedByPilot,
	],
	([atcNew, atcOld], [pilotNew, pilotOld]) => {
		if (atcNew !== atcOld || pilotNew !== pilotOld) {
			notSeen.value = true;
		}
	}
);

const executed = computed(
	() => props.message.acknowledgedByATC && props.message.acknowledgedByPilot
);
function hideExecutedMessage() {
	if (executed.value) {
		useMessageStore().updateMessage(props.message.id, { executed: true });
	}
}
</script>

<template>
	<div
		class="outline outline-2 grid grid-cols-[0.5fr_0.25fr_0.25fr] place-items-center relative"
		:class="{ 'cursor-pointer': executed }"
		@mouseover="() => (notSeen = false)"
		@click="hideExecutedMessage"
	>
		<Transition name="jump">
			<div
				v-if="notSeen"
				class="w-3 h-3 bg-red-500 absolute -top-1.5 -left-1.5 rounded-full"
			></div>
		</Transition>
		<p class="absolute bottom-[102%] left-1 text-xs">
			{{ getTimeStamp(message.sent!) }}
		</p>
		<div class="flex justify-self-start px-2">
			<p class="mr-2 font-semibold">{{ message.action.id }}:</p>
			<p>{{ message.planeId }}</p>
		</div>
		<p class="flex flex-col items-center border-x-2 border-black w-full">
			<span>A</span>
			<Transition name="jump" mode="out-in">
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
	color: red;
}
</style>

