import { defineStore } from "pinia";
import { usePlanesStore, type Plane } from "./planes";

export enum FlightState {
	Cruise = "Cruise",
	Depature = "Depature",
	Arrival = "Arrival",
}

export enum Parameter {
	Limit = "Limit",
	Instruments = "Instruments",
	HoldingPoint = "HoldingPoint",
	Taxiway = "Taxiway",
	Information = "Information",
	State = "State",
	Direction = "Direction",
}

export const ParameterName = <const>{
	[Parameter.Limit]: "Limit",
	[Parameter.Instruments]: "Instruments",
	[Parameter.HoldingPoint]: "Holding Point",
	[Parameter.Taxiway]: "Taxiway",
	[Parameter.Information]: "Information",
	[Parameter.State]: "State",
	[Parameter.Direction]: "Direction",
};

export const ParameterValues = <const>{
	[Parameter.Limit]: ["2000", "4000", "6000", "8000"],
	[Parameter.Instruments]: ["Instrument Depature", "Visual Departure"],
	[Parameter.HoldingPoint]: ["26R", "26L"],
	[Parameter.Taxiway]: ["Golf", "Foxtrot", "Romeo"],
	[Parameter.Information]: [
		"Bad Visual",
		"High Traffic",
		"High Turbulence",
		"Wait until further instructions",
	],
	[Parameter.State]: [
		"Pushback Approved",
		"Pushback Declined",
		"Hold for instructions",
	],
	[Parameter.Direction]: ["East", "South", "West", "North"],
};

export enum Action {
	IC = "IC",
	LI = "LI",
	SC = "SC",
	TI = "TI",
	AA = "AA",
	RI = "RI",
	DC = "DC",
	PB = "PB",
	TC = "TC",
	LC = "LC",
	TP = "TP",
	STO = "STO",
	IA = "IA",
	HP = "HP",
	FA = "FA",
	FAL = "FAL",
	GAP = "GAP",
	AL = "AL",
}

export const ActionName = <const>{
	[Action.IC]: "IFR Initial Climb",
	[Action.LI]: "Level Instructions",
	[Action.SC]: "ATS Surveillance Clearance",
	[Action.TI]: "Traffic Information",
	[Action.AA]: "Avoiding Action",
	[Action.RI]: "Radar Instruction",
	[Action.DC]: "IFR Departure Clearance",
	[Action.PB]: "Push Back Operation",
	[Action.TC]: "Taxi Clearances",
	[Action.LC]: "Line-Up Clearance",
	[Action.TP]: "Take-Off Procedure",
	[Action.STO]: "Special Take-Off Operation",
	[Action.IA]: "IFR Initial Approach",
	[Action.HP]: "Holding Procedures",
	[Action.FA]: "IFR Final Approach",
	[Action.FAL]: "Final Approach and Landing",
	[Action.GAP]: "Go Around Procedure",
	[Action.AL]: "After Landing",
};

export const ActionParameters = <Record<Action, Parameter[] | null>>{
	[Action.IC]: null,
	[Action.LI]: null,
	[Action.SC]: null,
	[Action.TI]: null,
	[Action.AA]: null,
	[Action.RI]: null,
	[Action.DC]: [
		Parameter.Limit,
		Parameter.Instruments,
		Parameter.HoldingPoint,
		Parameter.Taxiway,
		Parameter.Information,
	],
	[Action.PB]: [Parameter.State, Parameter.Direction],
	[Action.TC]: [Parameter.HoldingPoint, Parameter.Taxiway],
	[Action.LC]: [Parameter.HoldingPoint],
	[Action.TP]: null,
	[Action.STO]: null,
	[Action.IA]: null,
	[Action.HP]: null,
	[Action.FA]: null,
	[Action.FAL]: null,
	[Action.GAP]: null,
	[Action.AL]: null,
};

export const FlightStateAction = <const>{
	[FlightState.Cruise]: [
		Action.IC,
		Action.LI,
		Action.SC,
		Action.TI,
		Action.AA,
		Action.RI,
	],
	[FlightState.Depature]: [
		Action.DC,
		Action.PB,
		Action.TC,
		Action.LC,
		Action.TP,
		Action.STO,
	],
	[FlightState.Arrival]: [
		Action.IA,
		Action.HP,
		Action.FA,
		Action.FAL,
		Action.GAP,
		Action.AL,
	],
};

export type MessageActionParameter = {
	id: Parameter;
	name: typeof ParameterName[Parameter];
	value: typeof ParameterValues[Parameter][number];
};

export type MessageAction = {
	id: Action;
	name: typeof ActionName[Action];
	parameter: MessageActionParameter | null;
};

export enum MessageOrigin {
	System = "System",
	Pilot = "Pilot",
	ThisATC = "ThisATC",
	OtherATC = "OtherATC",
	Error = "Error",
}

export interface Message {
	id: number;
	planeId: string;
	action: MessageAction;
	origin: MessageOrigin;
	zone: string;
	sent: Date | null;
	executed: boolean;
	acknowledgedByATC: Date | null;
	acknowledgedByPilot: Date | null;
	onAcknowledgedByATC?: (msg: Message) => void;
	onAcknowledgedByPilot?: (msg: Message) => void;
	onSent?: (msg: Message) => void;
}

export function getActionName(action: Action) {
	return ActionName[action];
}

export function getActionParameters(action: Action) {
	return ActionParameters[action];
}

export function getParameterName(param: Parameter) {
	return ParameterName[param];
}

export function getPossibleParameterValues(param: Parameter) {
	return ParameterValues[param];
}

export function getTimeStamp(date: Date) {
	return date.toLocaleTimeString([], {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function oneOfArr<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function oneOfAction<P extends Parameter>(
	actionId: Action,
	paramId?: P,
	paramVal?: typeof ParameterValues[P][number]
): MessageAction {
	if (paramId) {
		return {
			id: actionId,
			name: ActionName[actionId],
			parameter: {
				id: Parameter[paramId],
				name: ParameterName[paramId],
				value:
					paramVal ??
					ParameterValues[paramId][
						Math.floor(Math.random() * ParameterValues[paramId].length)
					],
			},
		};
	}

	return {
		id: actionId,
		name: ActionName[actionId],
		parameter: null,
	};
}

function generateMessages(planes: Plane[]) {
	function onPushbackAcknowledged(msg: Message) {
		const messageStore = useMessageStore();
		if (
			msg.action.parameter?.value === "Hold for instructions" ||
			msg.action.parameter?.value === "Pushback Declined"
		) {
			return setTimeout(
				() =>
					messageStore.addMessage({
						planeId: msg.planeId,
						action: oneOfAction(
							Action.PB,
							Parameter.State,
							"Pushback Approved"
						),
						origin: MessageOrigin.Pilot,
						sent: new Date(),
						acknowledgedByATC: null,
						acknowledgedByPilot: new Date(),
						onAcknowledgedByATC: onPushbackAcknowledged,
					}),
				msg.action.parameter?.value === "Hold for instructions" ? 3000 : 10000
			);
		}

		setTimeout(
			() =>
				messageStore.addMessage({
					planeId: msg.planeId,
					action: oneOfAction(Action.TC, Parameter.Taxiway, "Golf"),
					origin: MessageOrigin.System,
				}),
			500
		);
	}

	return [
		{
			id: lastId++,
			planeId: oneOfArr(planes).id,
			action: oneOfAction(Action.PB, Parameter.State, "Pushback Approved"),
			origin: MessageOrigin.Pilot,
			sent: new Date(),
			zone: "SCN Apron",
			acknowledgedByATC: null,
			acknowledgedByPilot: new Date(),
			onAcknowledgedByATC: onPushbackAcknowledged,
		} as Message,
	];
}

type Key = string | number | symbol;
type PartialSome<T, K extends Key & keyof T> = Omit<T, K> & Partial<T>;
type NonNullableSome<T, K extends Key & keyof T> = Omit<T, K> & {
	[IK in K]: NonNullable<T[IK]>;
};

let lastId = 0;
export const useMessageStore = defineStore({
	id: "message",
	state: () => {
		const { planes } = usePlanesStore();
		return {
			messages: generateMessages(planes),
		};
	},
	getters: {
		/**
		 * A list of all messages that have been sent (by any party) and are still pending
		 */
		pendingMessages: (state) => {
			return state.messages
				.filter((msg) => msg.sent !== null && !msg.executed)
				.sort(
					(a, b) => b.sent!.valueOf() - a.sent!.valueOf()
				) as NonNullableSome<Message, "sent">[];
		},

		/**
		 * A list of all messages that have been completed
		 */
		sentMessages: (state) => {
			return state.messages.filter(
				(msg) => msg.sent !== null
			) as NonNullableSome<Message, "sent">[];
		},

		/**
		 * A list of all messages that have not yet been acknowledged by the user
		 */
		waitingForActionMessages: (state) => {
			return state.messages.filter((msg) => msg.acknowledgedByATC === null);
		},
		getMessageById: (state) => {
			return (messageId: number) =>
				state.messages.find((msg) => msg.id === messageId);
		},
	},
	actions: {
		addMessage(
			message: PartialSome<
				Omit<Message, "id">,
				| "acknowledgedByATC"
				| "acknowledgedByPilot"
				| "sent"
				| "zone"
				| "executed"
			>
		) {
			this.messages.push({
				acknowledgedByATC: null,
				acknowledgedByPilot: null,
				sent: null,
				zone: "SCN Apron",
				executed: false,
				...message,
				id: lastId++,
			});
			return this.messages.slice(-1);
		},
		updateMessage(id: number, newMessage: Partial<Omit<Message, "id">>) {
			const idx = this.messages.findIndex((msg) => msg.id === id);
			this.messages[idx] = { ...this.messages[idx], ...newMessage };
			return this.messages[idx];
		},
		deleteMessage(messageId: number) {
			const idx = this.messages.findIndex((msg) => msg.id === messageId);
			return this.messages.splice(idx, 1);
		},

		/**
		 * Acknowledges a message as either Pilot or ATC
		 * @param messageId Id of the message to acknowledge
		 */
		acknowledge(messageId: number) {
			const message = this.messages.find((msg) => msg.id === messageId);
			if (!message) return null;

			const now = new Date();

			return {
				as: (party: "Pilot" | "ATC") => {
					if (party === "Pilot") {
						message.acknowledgedByPilot = now;
						message.onAcknowledgedByPilot?.(message);
					} else {
						message.acknowledgedByATC = now;
						message.onAcknowledgedByATC?.(message);
						if (message.acknowledgedByPilot === null) {
							this.simulatePilotAcknowledgement(messageId);
						}
					}

					if (message.sent === null) {
						message.sent = now;
						message.onSent?.(message);
					}

					return message;
				},
			};
		},

		/**
		 * Simulate a pilot acknowledgement in 0 - 10 seconds
		 * @param messageId Id of the message to acknowledge
		 */
		simulatePilotAcknowledgement(messageId: number) {
			setTimeout(() => {
				this.acknowledge(messageId)?.as("Pilot");
			}, Math.random() * 8000 + 2000);
		},
	},
});

