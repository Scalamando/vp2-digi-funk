<script setup lang="ts">
import { Icon } from "@iconify/vue";
import BaseButton from "./BaseButton.vue";

</script>

<template>
	<div
		class="grid p-3 gap-x-6 gap-y-2 grid-cols-[auto_1fr_auto] border-y-4 text-lg border-orange-400 bg-orange-50"
	>
		<div class="rounded-full p-1.5 bg-orange-400">
			<Icon icon="bxs:user" class="h-5 w-5" />
		</div>

		<div class="flex items-center gap-2">
			<BaseButton>Aircraft</BaseButton>
			<BaseButton>Flightstate</BaseButton>
			<BaseButton>Action</BaseButton>
			<BaseButton>Parameter</BaseButton>
		</div>

		<div class="flex gap-1">
			<BaseButton class="!px-[4px]">
				<Icon icon="uil:check" class="h-5 w-5 scale-110" />
			</BaseButton>
			<BaseButton class="!px-[4px]">
				<Icon icon="uil:times" class="h-5 w-5 scale-110" />
			</BaseButton>
		</div>
	</div>
</template>


