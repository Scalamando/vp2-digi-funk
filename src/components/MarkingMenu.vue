<script setup lang="ts">
import MarkingMenu, {
type MarkingMenuItems,
type MarkingMenuObservable
} from "marking-menu";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
	options: MarkingMenuItems;
}>();
const emit = defineEmits(["select"]);

const markingEl = ref<HTMLDivElement>();
const markingMenu = ref<MarkingMenuObservable>();
const markingMenuSubscription = ref();

onMounted(() => {
	if (!markingEl.value) return;

	markingMenu.value = MarkingMenu(props.options, markingEl.value);

	markingMenuSubscription.value = markingMenu.value!.subscribe(({ name }) => {
		emit("select", name);
	});
});

onUnmounted(() => {
	markingMenuSubscription.value.unsubscribe();
});
</script>

<template>
	<Teleport to="body">
		<div class="absolute inset-0 z-0" ref="markingEl"></div>
	</Teleport>
</template>

