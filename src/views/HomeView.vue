<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import AddNewMessage from "@/components/AddNewMessage.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useMessageStore } from "@/stores/message";
import { Icon } from "@iconify/vue";
import { computed } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import BaseMessage from "../components/BaseMessage.vue";
import Summary from "../components/Summary.vue";

const messageStore = useMessageStore();
const { sentMessages, unsentMessages } = storeToRefs(messageStore);

const sortedMessages = computed(() =>
	[...sentMessages.value].sort((a, b) => b.sent.valueOf() - a.sent.valueOf())
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
			<div class="flex flex-col gap-2">
				<BaseMessage
					v-if="!isAddingNewMessage"
					v-for="msg in unsentMessages"
					:message="msg"
					:key="msg.id"
				/>
				<AddNewMessage v-else @close="() => (isAddingNewMessage = false)" />
			</div>
		</div>
		<div class="grid grid-cols-1 h-full grid-rows-[auto_1fr_auto]">
			<div class="border-b-2 border-slate-900 flex justify-between">
                <p class="p-2 font-semibold uppercase">
                    new

                </p>
                <BaseButton
                        @click="() => $router.push('/historie')"
                        class="rounded-none border-0 border-l-2"
                    >
                        <Icon icon="fluent:history-20-filled" class="h-10 w-10" />
                    </BaseButton>
            </div>
			<div class="p-6 grid grid-cols-1 gap-12 place-content-start">
				<TransitionGroup name="list">
					<div v-for="message in sortedMessages" :key="message.id">
						<Summary :message="message" />
					</div>
				</TransitionGroup>
			</div>
			<div class="border-t-2 border-slate-900 bg-red-100">
                <p class="p-2 font-semibold uppercase">
                    urgent
                </p>
            </div>
		</div>
	</main>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.list-leave-active {
	position: absolute;
}
</style>

