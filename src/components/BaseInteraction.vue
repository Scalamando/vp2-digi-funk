<script setup lang="ts">
const props = defineProps<{
	title: string;
	action: string;
}>();
</script>

<template>
	<div class="greetings">
		<h2>{{ props.title }}</h2>
        <p>{{ props.action }}</p>
	</div>
</template>
