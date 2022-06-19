import { defineStore } from "pinia";

export enum MessageType {
	Pushback = "PB",
	RequestTaxi = "RT",
	FlightLevel = "FL",
}

export enum MessageOrigin {
	System,
	Pilot,
	ThisATC,
	OtherATC,
}

export interface Message {
	id: number;
	planeId: string;
	type: MessageType;
	origin: MessageOrigin;
	zone: string;
	parameters?: Record<string, string | number>;
}

let lastId = 0;

export const useMessageStore = defineStore({
	id: "message",
	state: () => ({
		messages: [
			{
				id: 0,
				type: MessageType.Pushback,
				origin: MessageOrigin.System,
				planeId: "DX121",
				zone: "SCN Apron",
			},
			{
				id: 1,
				type: MessageType.RequestTaxi,
				origin: MessageOrigin.ThisATC,
				planeId: "DX121",
				zone: "SCN Apron",
			},
		] as Message[],
	}),
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

