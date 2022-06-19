<script setup lang="ts">
import BaseInteraction from "../components/BaseInteraction.vue";
const interactions = [
	{
		title: "Test 1",
		action: "Aktion 1",
	},
	{
		title: "Test 2",
		action: "Aktion 2",
	},
];
</script>

<template>
	<main class="grid place-content-center h-full">
		<h1 class="text-7xl text-center">DigiFunc&trade;</h1>
		<BaseInteraction
			v-for="interaction in interactions"
			:title="interaction.title"
			:action="interaction.action"
		/>
	</main>
</template>

