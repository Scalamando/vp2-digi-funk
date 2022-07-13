<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import AddNewMessage from "@/components/AddNewMessage.vue";
import BaseButton from "@/components/BaseButton.vue";
import { MessageOrigin, useMessageStore } from "@/stores/message";
import { Icon } from "@iconify/vue";
import { computed } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import BaseMessage from "../components/BaseMessage.vue";
import Summary from "../components/Summary.vue";

const messageStore = useMessageStore();
const { pendingMessages, waitingForActionMessages } = storeToRefs(messageStore);

const order = {
	[MessageOrigin.Error]: 0,
	[MessageOrigin.Pilot]: 1,
	[MessageOrigin.OtherATC]: 2,
	[MessageOrigin.System]: 3,
	[MessageOrigin.ThisATC]: 4,
};

const sortedMainMessages = computed(() =>
	[...waitingForActionMessages.value].sort(
		(a, b) => order[a.origin] - order[b.origin]
	)
);

const isAddingNewMessage = ref(false);
</script>

<template>
	<main
		class="grid grid-cols-[1fr_350px] place-content-stretch h-screen overflow-hidden"
	>
		<div class="border-r border-gray-900 grid grid-rows-[auto_1fr]">
			<div class="flex p-6 gap-6 border-b border-gray-900 mb-2">
				<button
					class="outline-2 outline outline-black rounded-lg h-32 w-32 flex-none hover:bg-gray-200"
					:class="{ 'bg-orange-400 hover:bg-orange-300': isAddingNewMessage }"
					@click="() => (isAddingNewMessage = true)"
				>
					<span class="text-8xl leading-[0.55]">+</span>
				</button>
				<active-planes class="h-32"> </active-planes>
			</div>
			<ul class="relative">
				<TransitionGroup name="list-rev" v-if="!isAddingNewMessage">
					<BaseMessage
						v-for="msg in sortedMainMessages"
						:message="msg"
						:key="msg.id"
						class="mb-2"
					/>
				</TransitionGroup>
				<AddNewMessage v-else @close="() => (isAddingNewMessage = false)" />
			</ul>
		</div>
		<div class="grid grid-cols-1 h-full grid-rows-[auto_1fr_auto]">
			<div class="border-b-2 border-slate-900 flex justify-between">
				<p class="p-2 font-semibold uppercase">new</p>
				<BaseButton
					@click="() => $router.push('/historie')"
					class="rounded-none border-0 border-l-2"
				>
					<Icon icon="fluent:history-20-filled" class="h-10 w-10" />
				</BaseButton>
			</div>
			<div class="p-6">
				<ul class="relative">
					<TransitionGroup name="list">
						<div
							v-for="message in pendingMessages"
							:key="message.id"
							class="w-full mb-12"
						>
							<Summary :message="message" />
						</div>
					</TransitionGroup>
				</ul>
			</div>
			<div class="border-t-2 border-slate-900 bg-red-100">
				<p class="p-2 font-semibold uppercase">urgent</p>
			</div>
		</div>
	</main>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active,
.list-rev-move,
.list-rev-enter-active,
.list-rev-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translate(30px, 0);
}

.list-rev-enter-from,
.list-rev-leave-to {
	opacity: 0;
	transform: translate(-30px, 0);
}

.list-leave-active,
.list-rev-leave-active {
	position: absolute !important;
}
</style>

