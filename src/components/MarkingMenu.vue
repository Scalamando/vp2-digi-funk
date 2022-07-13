<script setup lang="ts">
import MarkingMenu, {
type MarkingMenuItems,
type MarkingMenuObservable
} from "marking-menu";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
	items: MarkingMenuItems;
}>();
const emit = defineEmits(["select", "cancel"]);

const markingEl = ref<HTMLDivElement>();
const markingMenu = ref<MarkingMenuObservable>();
const markingMenuSubscription = ref();

onMounted(() => {
	if (!markingEl.value) return;

	markingMenu.value = MarkingMenu(props.items, markingEl.value, {
		notifySteps: true,
	});

	markingMenuSubscription.value = markingMenu.value!.subscribe((event) => {
		if(event.type === "select") emit("select", event.selection?.id);
        if(event.type === "cancel") emit("cancel");
	});
});

onUnmounted(() => {
	markingMenuSubscription.value.unsubscribe();
});
</script>

<template>
	<Teleport to="body">
		<div class="absolute inset-0 z-0" ref="markingEl" id="marking-menu"></div>
	</Teleport>
</template>

<style>
.marking-menu {
	--item-width: 240px;
	--item-height: 32px;
	--item-padding: 4px;
	--item-font-size: 16px;
	--menu-radius: 160px;
	--item-radius: 20px;
	--item-color: theme(colors.gray.900);
	--active-item-color: theme(colors.white);
	--item-background: theme(colors.gray.300);
	--active-item-background: theme(colors.gray.600);
}

.marking-menu-item .marking-menu-label {
	line-height: 1.5;
}
</style>

