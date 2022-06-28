<script setup lang="ts">
import { MessageOrigin, type Message, useMessageStore } from "@/stores/message";
import { Icon } from "@iconify/vue";
import BaseButton from "./BaseButton.vue";

const { acknowlegedByATC, deleteMessage } = useMessageStore();

defineProps<{
	message: Message;
}>();

function getColors(origin: MessageOrigin) {
	const colorStyles: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "border-sky-400 bg-sky-50",
		[MessageOrigin.Pilot]: "border-purple-400 bg-purple-50",
		[MessageOrigin.ThisATC]: "border-orange-400 bg-orange-50",
		[MessageOrigin.OtherATC]: "border-lime-400 bg-lime-50",
	};

	return colorStyles[origin];
}

function getIcon(origin: MessageOrigin) {
	const iconIdentifier: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "bxs:server",
		[MessageOrigin.Pilot]: "bxs:plane-alt",
		[MessageOrigin.ThisATC]: "bxs:user",
		[MessageOrigin.OtherATC]: "bxs:user-voice",
	};

	return iconIdentifier[origin];
}

function getIconColor(origin: MessageOrigin) {
	const iconColor: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "bg-sky-400",
		[MessageOrigin.Pilot]: "bg-purple-400",
		[MessageOrigin.ThisATC]: "bg-orange-400",
		[MessageOrigin.OtherATC]: "bg-lime-400",
	};

	return iconColor[origin];
}
</script>

<template>
	<div
		class="grid p-3 gap-x-6 gap-y-2 grid-cols-[1fr_auto] border-y-4 text-lg"
		:class="getColors(message.origin)"
	>
		<div class="flex items-center gap-2">
			<div class="rounded-full p-1.5" :class="getIconColor(message.origin)">
				<Icon :icon="getIcon(message.origin)" class="h-5 w-5" />
			</div>
			<p class="font-semibold">{{ message.type }}</p>
			<p>{{ message.planeId }}</p>
			<p>{{ message.zone }}</p>
			<slot></slot>
		</div>

		<div class="flex gap-1">
			<BaseButton class="!px-[4px]"  @click="() => acknowlegedByATC(message.id)">
				<Icon icon="uil:check" class="h-5 w-5 scale-110" />
			</BaseButton>
			<BaseButton class="!px-[4px]" @click="() => deleteMessage(message.id)">
				<Icon icon="uil:times" class="h-5 w-5 scale-110" />
			</BaseButton>
		</div>

		<slot name="details" class="col-span-2"></slot>
	</div>
</template>

