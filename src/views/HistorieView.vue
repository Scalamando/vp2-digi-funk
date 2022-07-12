<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import {
getActionName,
getTimeStamp,
MessageOrigin,
useMessageStore
} from "@/stores/message";
import { Icon } from "@iconify/vue";

const { sentMessages } = useMessageStore();
const sortedMessages = sentMessages.sort(
	(a, b) => b.sent.valueOf() - a.sent.valueOf()
);

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
</script>

<template>
	<main>
		<div class="border-b-2 border-slate-900 flex justify-between">
			<p class="p-2 font-semibold uppercase">new</p>
			<BaseButton
				@click="() => $router.push('/')"
				class="rounded-none border-0 border-l-2"
			>
				<Icon icon="fluent:history-dismiss-20-filled" class="h-10 w-10" />
			</BaseButton>
		</div>

		<div
			v-for="message in sortedMessages"
			:key="message.id"
			class="grid grid-cols-[150px_1fr_1fr] gap-3 place-content-stretch p-3"
		>
			<div class="justify-self-end self-center text-right">
				<p class="data-value">{{ getTimeStamp(message.sent) }}</p>
				<p class="data-label">Received</p>
			</div>
			<div
				class="border-2 rounded-md grid grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] gap-1 place-items-center p-1"
				:class="getColors(message.origin)"
			>
				<div class="text-center">
					<p class="data-value">{{ message.planeId }}</p>
					<p class="data-label">Aircraft</p>
				</div>
				<div class="text-center">
					<p class="data-value">
						{{ getActionName(message.action.id) }} ({{ message.action.id }})
					</p>
					<p class="data-label">Action</p>
				</div>
				<div class="text-center">
					<p class="data-value">{{ message.zone }}</p>
					<p class="data-label">Zone</p>
				</div>
				<div
					class="text-center px-3 border-x-2"
					:class="getColors(message.origin)"
				>
					<p>A</p>
					<Icon
						v-if="message.acknowledgedByATC !== null"
						icon="uil:check"
						class="h-5 w-5 mx-auto"
					/>
					<Icon v-else icon="bxs:hourglass" class="h-5 w-5 mx-auto" />
					<p>
						{{
							message.acknowledgedByATC
								? getTimeStamp(message.acknowledgedByATC)
								: ""
						}}
					</p>
				</div>
				<div
					class="text-center px-3 border-x-2"
					:class="getColors(message.origin)"
				>
					<p>P</p>
					<Icon
						v-if="message.acknowledgedByPilot !== null"
						icon="uil:check"
						class="h-5 w-5 mx-auto"
					/>
					<Icon v-else icon="bxs:hourglass" class="h-5 w-5 mx-auto" />
					<p>
						{{
							message.acknowledgedByPilot
								? getTimeStamp(message.acknowledgedByPilot)
								: ""
						}}
					</p>
				</div>
			</div>
			<div class="border-2 rounded-md"></div>
		</div>
	</main>
</template>

<style scoped>
.data-value {
	@apply font-semibold;
}

.data-label {
	@apply text-xs text-slate-600 uppercase font-medium;
}
</style>

