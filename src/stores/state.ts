import { defineStore } from "pinia";

export enum StateType {
	Pushback = "PB",
	RequestTaxi = "RT",
	FlightLevel = "FL",
}

export enum AckState {
    true,
    false,
}

export interface State {
	id: number;
	planeId: string;
	type: StateType;
	atcAck: AckState;
    pilotAck: AckState;
}

let lastId = 0;

export const useStateStore = defineStore({
	id: "state",
	state: () => ({
		messages: [
			{
				id: 0,
				type: StateType.Pushback,
				planeId: "DX1212",
                atcAck: AckState.true,
                pilotAck: AckState.false,
			},
			{
				id: 1,
				type: StateType.RequestTaxi,
				planeId: "DX1212",
				atcAck: AckState.true,
                pilotAck: AckState.true,
			},
		] as State[],
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
		addMessage(state: Omit<State, "id">) {
			this.messages.push({ ...state, id: lastId++ });
			return this.messages.slice(-1);
		},
	},
});

