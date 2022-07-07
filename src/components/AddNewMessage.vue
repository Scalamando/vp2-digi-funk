<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import MarkingMenu from "@/components/MarkingMenu.vue";
import { MessageAcknowledgement, MessageOrigin, MessageType, useMessageStore } from "@/stores/message";
import type { Plane } from "@/stores/planes";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits(["close"]);

const messageStore = useMessageStore();

const step = ref(0);

enum FlightState {
	Depature = "Depature",
	Cruise = "Cruise",
	Arrival = "Arrival",
}

const actionsPerFlighState = {
	[FlightState.Depature]: [
		"IFR Departure Clearance",
		"Push Back Operation",
		"Taxi Clearances",
		"Line-Up Clearance",
		"Take-Off Procedure",
		"Special Take-Off Operation",
	],
	[FlightState.Cruise]: [
		"IFR Initial Climb",
		"Level Instructions",
		"ATS Surveillance Clearance",
		"Traffic Information",
		"Avoiding Action",
		"Radar Instruction",
	],
	[FlightState.Arrival]: [
		"IFR Initial Approach",
		"Holding Procedures",
		"IFR Final Approach",
		"Final Approach and Landing",
		"Go Around Procedure",
		"After Landing",
	],
};

const selectedAircraft = ref<Plane>();
function selectAircraft(plane: Plane) {
	selectedAircraft.value = plane;
	step.value++;
}

const selectedFlightState = ref<FlightState>();
function selectFlightState(selection: FlightState) {
	console.log(selection);

	selectedFlightState.value = selection;
	step.value++;
}

const selectedAction = ref();
function selectAction(action: string) {
    selectedAction.value = action;

    messageStore.addMessage({
        acknowledgement: MessageAcknowledgement.ATC,
        origin: MessageOrigin.ThisATC,
        planeId: selectedAircraft.value!.id,
        type: MessageType.Generic,
        zone: "SCN Apron",
        parameters: {action: selectedAction.value}
    });

    emit('close');
}
</script>

<template>
	<div
		class="grid grid-rows-[auto_1fr] p-3 gap-y-2 border-y-4 text-lg border-orange-400 bg-orange-50 h-full"
	>
		<div class="grid grid-cols-[auto_1fr_auto] place-self-start gap-x-6 w-full z-50">
			<div class="rounded-full p-1.5 bg-orange-400">
				<Icon icon="bxs:user" class="h-5 w-5" />
			</div>
			<div class="flex items-center gap-2">
				<BaseButton>
					{{ selectedAircraft ? selectedAircraft.id : "Aircraft" }}
				</BaseButton>
				<BaseButton>
					{{ selectedFlightState || "Flightstate" }}
				</BaseButton>
				<BaseButton>Action</BaseButton>
				<BaseButton>Parameter</BaseButton>
			</div>

			<div class="flex gap-1">
				<BaseButton class="!px-[4px]" @click="() => emit('close')">
					<Icon icon="uil:times" class="h-5 w-5 scale-110" />
				</BaseButton>
			</div>
		</div>
		<div v-if="step === 0" class="flex justify-center items-center w-full">
			<ActivePlanes @select="selectAircraft" />
		</div>
		<MarkingMenu
			v-else-if="step === 1"
			:options="[
				FlightState.Cruise,
				FlightState.Arrival,
				FlightState.Cruise,
				FlightState.Depature,
			]"
			@select="selectFlightState"
		/>
		<MarkingMenu
			v-else-if="step === 2 && selectedFlightState"
			:options="actionsPerFlighState[selectedFlightState]"
			@select="selectAction"
		/>
	</div>
</template>

