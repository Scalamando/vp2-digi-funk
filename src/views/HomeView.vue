<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import MessageFlightLevel from "@/components/MessageFlightLevel.vue";
import MessagePushback from "@/components/MessagePushback.vue";
import MessageRequestTaxi from "@/components/MessageRequestTaxi.vue";
import AddNewMessageVue from "@/components/AddNewMessage.vue";
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

function onClick(ev: Event) { 
 console.log(ev);
 
 }

</script>

<template>
	<main class="grid grid-cols-3 gap-1 place-content-stretch h-screen">
		<div class="leftContainer">
			<div class="headContainer">
				<button class="addButton w-32 h-32" @click="onClick">+</button>
				<active-planes class="h-32"> </active-planes>
			</div>
			<!--<h1 class="text-7xl text-center mb-6">DigiFunk&trade;</h1>-->
			<div class="flex flex-col gap-2">
				<component
					v-for="msg in messages"
					:is="getMessageComponent(msg.type)"
					:message="msg"
					:key="msg.id"
				/>
			</div>
		</div>
		<div class="divider"></div>
		<div>
			<p class="headRightContainer">new</p>
			<div class="grid grid-cols-none grid-rows-6 rightContainer">
				<div v-for="message in messages">
					{{ message.planeId }} {{ message.acknowledgement }}
				</div>
			</div>
			<p class="footRightContainer">urgent</p>
		</div>
	</main>
</template>

	
	