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
		<p>Generic</p>

		<template #details>
			<div class="flex gap-6">
				<div class="flex gap-2">
					Action:
					<BaseButton>
						{{ message.parameters?.action }}
					</BaseButton>
				</div>
			</div>
		</template>
	</BaseMessage>
</template>

