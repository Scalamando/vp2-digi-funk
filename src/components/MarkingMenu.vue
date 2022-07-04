<script setup lang="ts">
import MarkingMenu from "marking-menu";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
    options: string[]
}>();
const emit = defineEmits(['select']);

const markingEl = ref<HTMLDivElement>();
const markingMenu = ref();
const markingMenuSubscription = ref();

onMounted(() => {
	markingMenu.value = MarkingMenu(
		props.options,
		markingEl.value
	);

	markingMenuSubscription.value = markingMenu.value.subscribe(
		(selection: { name: string }) => {
			emit('select', selection.name)
		}
	);
});

onUnmounted(() => {
    markingMenuSubscription.value.unsubscribe();
})
</script>

<template>
	<div class="w-full bg-white" ref="markingEl"></div>
</template>

