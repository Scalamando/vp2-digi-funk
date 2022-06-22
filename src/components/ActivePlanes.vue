<script setup lang="ts">
import { usePlanesStore } from "@/stores/planes";

const { planes } = usePlanesStore();
</script>

<template>
	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(12ch,1fr))] gap-0.5 outline outline-2 rounded-lg overflow-hidden activePlanes"
	>
		<div
			v-for="plane in planes"
                class="outline outline-2 outline-slate-900 text-xl inline-flex justify-center items-center"
		>
			{{ plane.id }}
		</div>
	</div>
</template>

