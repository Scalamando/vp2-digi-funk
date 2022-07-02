<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import AddNewMessage from "@/components/AddNewMessage.vue";
import MessageFlightLevel from "@/components/MessageFlightLevel.vue";
import MessageGeneric from "@/components/MessageGeneric.vue";
import MessagePushback from "@/components/MessagePushback.vue";
import MessageRequestTaxi from "@/components/MessageRequestTaxi.vue";
import { MessageType, useMessageStore } from "@/stores/message";
import { storeToRefs } from "pinia";
import { ref, type Component } from "vue";

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

function getMessageComponent(type: MessageType) {
	const messageComponent: Record<MessageType, Component> = {
		[MessageType.Pushback]: MessagePushback,
		[MessageType.RequestTaxi]: MessageRequestTaxi,
		[MessageType.FlightLevel]: MessageFlightLevel,
		[MessageType.Generic]: MessageGeneric,
	};

	return messageComponent[type];
}

const isAddingNewMessage = ref(false);
</script>

<template>
	<main class="grid grid-cols-[1fr_200px] gap-1 place-content-stretch h-screen">
		<div class="border-r border-gray-900 grid grid-rows-[auto_1fr]">
			<div class="flex p-6">
				<button
					class="addButton w-32 h-32"
					@click="() => (isAddingNewMessage = true)"
				>
					+
				</button>
				<active-planes class="h-32"> </active-planes>
			</div>
			<!--<h1 class="text-7xl text-center mb-6">DigiFunk&trade;</h1>-->
			<div class="flex flex-col gap-2">
				<component
					v-if="!isAddingNewMessage"
					v-for="msg in messages"
					:is="getMessageComponent(msg.type)"
					:message="msg"
					:key="msg.id"
				/>
				<AddNewMessage v-else @close="() => (isAddingNewMessage = false)" />
			</div>
		</div>
		<div class="p-6 grid grid-cols-1 h-full grid-rows-[auto_1fr_auto]">
			<p>new</p>
			<div class="grid grid-cols-1 grid-rows-6">
				<div v-for="message in messages">
					{{ message.planeId }} {{ message.acknowledgement }}
				</div>
			</div>
			<p>urgent</p>
		</div>
	</main>
</template>

