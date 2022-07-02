import { defineStore } from "pinia";
import { usePlanesStore, type Plane } from "./planes";

export enum MessageType {
	Pushback = "PB",
	RequestTaxi = "RT",
	FlightLevel = "FL",
    Generic = "GT"
}

export enum MessageOrigin {
	System = "System",
	Pilot = "Pilot",
	ThisATC = "ThisATC",
	OtherATC = "OtherATC",
}

export enum MessageAcknowledgement {
	Pilot = "Pilot",
	ATC = "ATC",
	Both = "Both",
}

export interface Message {
	id: number;
	planeId: string;
	type: MessageType;
	origin: MessageOrigin;
	zone: string;
	acknowledgement: MessageAcknowledgement;
	parameters?: Record<string, string | number>;
}

function generateMessages(planes: Plane[]) {
	const oneOfEnum = <T>(obj: T) => {
		const values = Object.values(obj) as T[keyof T][];
		return values[Math.floor(Math.random() * values.length)];
	};

	const oneOfArr = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

	return Array.from(
		{ length: 3 },
		() =>
			({
				id: lastId++,
				planeId: oneOfArr(planes).id,
				type: oneOfEnum(MessageType),
				origin: oneOfEnum(MessageOrigin),
				zone: "SCN Apron",
				acknowledgement: oneOfEnum(MessageAcknowledgement),
			} as Message)
	);
}

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
		getMessagesByPlaneId: (state) => {
			return (planeId: string) =>
				state.messages.filter((msg) => msg.planeId === planeId);
		},
		getMessageById: (state) => {
			return (messageId: number) =>
				state.messages.find((msg) => msg.id === messageId);
		},
	},
	actions: {
		addMessage(message: Omit<Message, "id">) {
			this.messages.push({ ...message, id: lastId++ });
			return this.messages.slice(-1);
		},
	},
});

