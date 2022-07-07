<script setup lang="ts">
import ActivePlanes from "@/components/ActivePlanes.vue";
import MarkingMenu from "@/components/MarkingMenu.vue";
import {
ActionName,
ActionParameters,
FlightState,
FlightStateAction,
MessageAcknowledgement,
MessageOrigin,
ParameterName,
ParameterValues,
useMessageStore,
type MessageAction
} from "@/stores/message";
import type { Plane } from "@/stores/planes";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits(["close"]);

const messageStore = useMessageStore();

const step = ref(0);

const allActions = [
	FlightState.Cruise,
	FlightState.Arrival,
	FlightState.Cruise,
	FlightState.Depature,
].map((flightState) => ({
	name: flightState,
	children: FlightStateAction[flightState].map((action) =>
		ActionParameters[action] !== null
			? {
					name: ActionName[action],
					children: ActionParameters[action]!.map((param) => ({
						name: ParameterName[param],
						children: [...ParameterValues[param]],
					})),
			  }
			: ActionName[action]
	),
}));

const selectedAircraft = ref<Plane>();
const selectedFlightState = ref<FlightState>();
const selectedAction = ref<MessageAction>();

function selectAircraft(plane: Plane) {
	selectedAircraft.value = plane;
	step.value++;
}

function selectAction(selectionId: string) {
	const { flightState, action, parameter, parameterValue } =
		getDetailsFromSelectionId(selectionId);

	selectedFlightState.value = flightState;
	selectedAction.value = {
		id: action,
		name: ActionName[action],
		parameter:
			parameter && parameterValue
				? {
						id: parameter,
						name: ParameterName[parameter],
						value: parameterValue,
				  }
				: null,
	};
}

function confirmSelection() {
	messageStore.addMessage({
		acknowledgement: MessageAcknowledgement.NotSent,
		origin: MessageOrigin.ThisATC,
		planeId: selectedAircraft.value!.id,
		action: selectedAction.value!,
		zone: "SCN Apron",
	});

	emit("close");
}

function getDetailsFromSelectionId(selectionId: string) {
	const [flightStateId, actionId, parameterId, parameterValueId] =
		selectionId.split("-");

	const flightStateSelection = allActions[Number(flightStateId)];
	const actionSelection =
		FlightStateAction[flightStateSelection.name as FlightState][
			Number(actionId)
		];
	const parameterSelection =
		ActionParameters[actionSelection]?.[Number(parameterId)];
	const parameterValueSelection = parameterSelection
		? ParameterValues[parameterSelection][Number(parameterValueId)]
		: undefined;

	console.log(
		flightStateSelection,
		actionSelection,
		parameterSelection,
		parameterValueSelection
	);

	return {
		flightState: flightStateSelection.name as FlightState,
		action: actionSelection,
		parameter: parameterSelection,
		parameterValue: parameterValueSelection,
	};
}
</script>

<template>
	<div
		class="grid grid-rows-[auto_1fr] p-3 gap-y-2 border-y-4 text-lg border-orange-400 bg-orange-50 h-full"
	>
		<div
			class="grid grid-cols-[auto_1fr_auto] place-self-start gap-x-6 w-full z-50"
		>
			<div class="rounded-full p-1.5 bg-orange-400">
				<Icon icon="bxs:user" class="h-5 w-5" />
			</div>
			<div class="flex items-center gap-2">
				<BaseButton @click="() => (step = 0)">
					{{ selectedAircraft ? selectedAircraft.id : "Aircraft" }}
				</BaseButton>
				<BaseButton>
					{{ selectedFlightState || "Flightstate" }}
				</BaseButton>
				<BaseButton>{{ selectedAction?.name || "Action" }}</BaseButton>
				<BaseButton v-if="selectedAction?.parameter">
					{{ selectedAction.parameter.name || "Parameter" }}:
					{{ selectedAction.parameter.value }}
				</BaseButton>
			</div>

			<div class="flex gap-1">
				<BaseButton
					v-if="selectedAircraft && selectedAction"
					class="!px-[4px]"
					@click="confirmSelection"
				>
					<Icon icon="uil:check" class="h-5 w-5 scale-110" />
				</BaseButton>
				<BaseButton class="!px-[4px]" @click="() => emit('close')">
					<Icon icon="uil:times" class="h-5 w-5 scale-110" />
				</BaseButton>
			</div>
		</div>
		<div v-if="step === 0" class="flex items-center w-full max-w-4xl mx-auto">
			<ActivePlanes @select="selectAircraft" />
		</div>
		<MarkingMenu
			v-else-if="step >= 1"
			:items="allActions"
			@select="selectAction"
		/>
	</div>
</template>

