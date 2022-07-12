<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import AddNewMessage from "@/components/AddNewMessage.vue";
import { useMessageStore } from "@/stores/message";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import BaseMessage from "../components/BaseMessage.vue";
import Summary from "../components/Summary.vue";
import { Icon } from "@iconify/vue";
import BaseButton from "@/components/BaseButton.vue";

const messageStore = useMessageStore();
const { sentMessages, unsentMessages } = storeToRefs(messageStore);

const isAddingNewMessage = ref(false);
</script>

<template>
	<main class="grid grid-cols-[1fr_350px] gap-1 place-content-stretch h-screen">
		<div class="border-r border-gray-900 grid grid-rows-[auto_1fr]">
			<div class="flex p-6 gap-6 border-b border-gray-900 mb-2">
				<button
					class="outline-2 outline outline-black rounded-lg h-32 w-32 flex-none hover:bg-gray-200"
                    :class="{'bg-orange-400 hover:bg-orange-300' : isAddingNewMessage}"
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
		<div class="p-6 grid grid-cols-1 h-full grid-rows-[auto_1fr_auto]">
			<p>
				new
				<BaseButton @click="() => $router.push('/historie')" class="absolute top-0 right-0"> 
					<Icon icon="fluent:history-20-filled" class="h-10 w-10" /> 
				</BaseButton>
			</p> 
			<div class="grid grid-cols-1 grid-rows-6">
				<div v-for="message in sentMessages" :key="message.id">
					<Summary :message="message" />
				</div>
			</div>
			<p>urgent</p>
		</div>
	</main>
</template>

