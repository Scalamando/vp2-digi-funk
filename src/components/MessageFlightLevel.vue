<script setup lang="ts">
import type { Message } from "@/stores/message";
import BaseMessage from "./BaseMessage.vue";

defineProps<{
	message: Message;
}>();
</script>

<template>
	<BaseMessage :message="message">
        <p>Flight Level</p>
    </BaseMessage>
</template>
