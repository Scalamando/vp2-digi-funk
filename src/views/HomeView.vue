<script setup lang="ts">
import MessageFlightLevel from "@/components/MessageFlightLevel.vue";
import MessagePushback from "@/components/MessagePushback.vue";
import MessageRequestTaxi from "@/components/MessageRequestTaxi.vue";
import { MessageType, useMessageStore } from "@/stores/message";
import type { Component } from "vue";

const { messages } = useMessageStore();

function getMessageComponent(type: MessageType) {
	const messageComponent: Record<MessageType, Component> = {
		[MessageType.Pushback]: MessagePushback,
		[MessageType.RequestTaxi]: MessageRequestTaxi,
		[MessageType.FlightLevel]: MessageFlightLevel,
	};

	return messageComponent[type];
}
</script>

<template>
	<main class="grid place-content-center h-screen">
		<h1 class="text-7xl text-center mb-6">DigiFunc&trade;</h1>
		<div class="flex flex-col gap-2">
			<component
				v-for="msg in messages"
				:is="getMessageComponent(msg.type)"
				:message="msg"
				:key="msg.id"
			/>
		</div>
	</main>
</template>

