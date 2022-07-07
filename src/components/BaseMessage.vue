<script setup lang="ts">
import {
MessageOrigin,
ParameterValues,
useMessageStore,
type Message
} from "@/stores/message";
import { Icon } from "@iconify/vue";
import { computed, nextTick, ref } from "vue";
import BaseButton from "./BaseButton.vue";
import MarkingMenu from "./MarkingMenu.vue";

const { acknowlegedByATC, deleteMessage, updateMessage } = useMessageStore();

const props = defineProps<{
	message: Message;
}>();

enum Editing {
	None,
	ParameterValue,
}

const isEditing = ref(Editing.None);
const items = computed(() => {
	if (!props.message.action.parameter) return null;

	if (isEditing.value === Editing.ParameterValue) {
		return ParameterValues[
			props.message.action.parameter.id
		] as unknown as string[];
	}

	return null;
});
function handleUpdateParameterValue(selection: number) {
	isEditing.value = Editing.None;
	if (!props.message.action.parameter) return;

	updateMessage(props.message.id, {
		action: {
			...props.message.action,
			parameter: {
				...props.message.action.parameter,
				value: ParameterValues[props.message.action.parameter.id][selection],
			},
		},
	});
}

function startEditing(e: PointerEvent) {
	isEditing.value = Editing.ParameterValue;
	nextTick(() =>
		document.getElementById("marking-menu")?.dispatchEvent(
			new MouseEvent("mousedown", {
				clientX: e.clientX,
				clientY: e.clientY,
			})
		)
	);
}

function getColors(origin: MessageOrigin) {
	const colorStyles: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "border-sky-400 bg-sky-50",
		[MessageOrigin.Pilot]: "border-purple-400 bg-purple-50",
		[MessageOrigin.ThisATC]: "border-orange-400 bg-orange-50",
		[MessageOrigin.OtherATC]: "border-lime-400 bg-lime-50",
		[MessageOrigin.Error]: "border-red-400 bg-red-50",
	};

	return colorStyles[origin];
}

function getIcon(origin: MessageOrigin) {
	const iconIdentifier: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "bxs:server",
		[MessageOrigin.Pilot]: "bxs:plane-alt",
		[MessageOrigin.ThisATC]: "bxs:user",
		[MessageOrigin.OtherATC]: "bxs:user-voice",
		[MessageOrigin.Error]: "bxs:error",
	};

	return iconIdentifier[origin];
}

function getIconColor(origin: MessageOrigin) {
	const iconColor: Record<MessageOrigin, string> = {
		[MessageOrigin.System]: "bg-sky-400",
		[MessageOrigin.Pilot]: "bg-purple-400",
		[MessageOrigin.ThisATC]: "bg-orange-400",
		[MessageOrigin.OtherATC]: "bg-lime-400",
		[MessageOrigin.Error]: "bg-red-400",
	};

	return iconColor[origin];
}
</script>

<template>
	<div
		class="flex p-3 gap-6 justify-between border-y-4 text-lg"
		:class="getColors(message.origin)"
	>
		<div class="flex items-center gap-2">
			<div class="rounded-full p-1.5" :class="getIconColor(message.origin)">
				<Icon :icon="getIcon(message.origin)" class="h-5 w-5" />
			</div>
			<p class="font-semibold">{{ message.action.id }}</p>
			<p>{{ message.planeId }}</p>
			<p>{{ message.zone }}</p>
		</div>

		<div v-if="message.action.parameter" class="flex gap-2">
			<p>{{ message.action.parameter?.id }}</p>
			<BaseButton @pointerdown="startEditing">{{
				message.action.parameter?.value
			}}</BaseButton>
		</div>

		<div class="flex gap-1">
			<BaseButton class="!px-[4px]" @click="() => acknowlegedByATC(message.id)">
				<Icon icon="uil:check" class="h-5 w-5 scale-110" />
			</BaseButton>
			<BaseButton class="!px-[4px]" @click="() => deleteMessage(message.id)">
				<Icon icon="uil:times" class="h-5 w-5 scale-110" />
			</BaseButton>
		</div>
	</div>
	<MarkingMenu
		v-if="isEditing && items"
		:items="items"
		@select="handleUpdateParameterValue"
		@cancel="() => (isEditing = Editing.None)"
	/>
</template>

