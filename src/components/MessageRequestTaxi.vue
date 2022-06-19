<script setup lang="ts">
import type { Message } from "@/stores/message";
import BaseButton from "./BaseButton.vue";
import BaseMessage from "./BaseMessage.vue";

defineProps<{
	message: Message;
}>();
</script>

<template>
	<BaseMessage :message="message">
		<p>Taxi Route</p>

		<template #details>
			<div class="flex gap-6">
				<div class="flex gap-2">
					Holding Point: <BaseButton>26R</BaseButton>
				</div>
				<div class="flex gap-2">
					Taxiway:
					<BaseButton>Golf</BaseButton>
					<BaseButton>Foxtrot</BaseButton>
					<BaseButton>Romeo</BaseButton>
				</div>
			</div>
		</template>
	</BaseMessage>
</template>

