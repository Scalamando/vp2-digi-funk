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
        <BaseButton>Pushback approved</BaseButton>
        <BaseButton>South</BaseButton>
    </BaseMessage>
</template>
