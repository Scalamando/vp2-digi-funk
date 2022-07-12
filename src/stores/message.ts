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

export const ActionParameters = <const>{
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
	[Action.LC]: null,
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

export enum MessageAcknowledgement {
	NotSent = "NotSent",
	Pilot = "Pilot",
	ATC = "ATC",
	Both = "Both",
}

export interface Message {
	id: number;
	planeId: string;
	action: MessageAction;
	origin: MessageOrigin;
	zone: string;
	acknowledgement: MessageAcknowledgement;
	acknowledgementATC: String;
	acknowledgementPilot: String;
}

/**
 * TODO
 * @param planes
 * @returns
 */
function generateMessages(planes: Plane[]) {
	const oneOfEnum = <T>(obj: T) => {
		const values = Object.values(obj) as T[keyof T][];
		return values[Math.floor(Math.random() * values.length)];
	};

	const oneOfArr = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

	const oneOfAction = (): MessageAction => {
		const actionId = oneOfEnum(Action);
		const availableParameters = ActionParameters[actionId];

		if (availableParameters !== null) {
			const parameterId = oneOfArr(
				availableParameters as unknown as Parameter[]
			);

			return {
				id: actionId,
				name: ActionName[actionId],
				parameter: {
					id: Parameter[parameterId],
					name: ParameterName[parameterId],
					value:
						ParameterValues[parameterId][
							Math.floor(Math.random() * ParameterValues[parameterId].length)
						],
				},
			};
		}

		return {
			id: actionId,
			name: ActionName[actionId],
			parameter: null,
		};
	};

	return Array.from(
		{ length: 3 },
		() =>
			({
				id: lastId++,
				planeId: oneOfArr(planes).id,
				action: oneOfAction(),
				origin: oneOfEnum(MessageOrigin),
				zone: "SCN Apron",
				acknowledgement: oneOfEnum(MessageAcknowledgement),
			} as Message)
	);
}

let lastId = 0;
var interval = null;

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
		 * TODO
		 * @param state
		 * @returns
		 */
		getMessagesByPlaneId: (state) => {
			return (planeId: string) =>
				state.messages.filter((msg) => msg.planeId === planeId);
		},
		/**
		 * @param state
		 * @returns a list of all acknowledged messages (pilot or atc)
		 */
		sentMessages: (state) => {
			return state.messages.filter(
				(msg) => msg.acknowledgement !== MessageAcknowledgement.NotSent
			);
		},
		/**
		 * @param state
		 * @returns a list of all not acknowledged messages
		 */
		unsentMessages: (state) => {
			return state.messages.filter(
				(msg) =>
					msg.acknowledgement === MessageAcknowledgement.NotSent ||
					msg.acknowledgement === MessageAcknowledgement.Pilot
			);
		},
		/**
		 * TODO
		 * @param state
		 * @returns
		 */
		getMessageById: (state) => {
			return (messageId: number) =>
				state.messages.find((msg) => msg.id === messageId);
		}
	},
	actions: {
		/**
		 * TODO: description
		 * @param message
		 * @returns
		 */
		addMessage(message: Omit<Message, "id">) {
			this.messages.push({ ...message,id: lastId++ });
			return this.messages.slice(-1);
		},

		updateMessage(id: number, newMessage: Partial<Omit<Message, "id">>) {
			const idx = this.messages.findIndex((msg) => msg.id === id);
			this.messages[idx] = { ...this.messages[idx], ...newMessage };
			return this.messages[idx];
		},
		/**
		 * changes the acknowlegement to 'ATC'
		 * @param messageId of the acknowleged message
		 */
		acknowlegedByATC(messageId:number) {
			this.messages.forEach(message =>{
				if(message.id === messageId){
					message.acknowledgement = MessageAcknowledgement.ATC;
					//console.log('acknowleged:', messageId, message.acknowledgement)
					message.acknowledgementATC = this.calculateTime()
					this.setTimerForAcknolegementBoth(messageId);
					return;
				}
			});
		},
		/**
		 * changes the acknowlegement to 'Both'
		 * @param messageId of the acknowleged message
		 */
		acknowlegedByBoth(messageId: number) {
			this.messages.forEach((message) => {
				if (message.id === messageId) {
					message.acknowledgement = MessageAcknowledgement.Both;
					//console.log('acknowleged:', messageId, message.acknowledgement)
					message.acknowledgementPilot = this.calculateTime()
					message.origin = MessageOrigin.Error;
					return;
				}
				// use this to create an error message
				/*if(message.id === messageId){
					message.acknowledgement = MessageAcknowledgement.NotSent;
					console.log('refused:', messageId, message.acknowledgement)
					message.origin = MessageOrigin.Error;
					return
				}*/
			});
		},
		/**
		 * one countdown to simulate the answer of the pilot
		 * @param messageId of the acknowleged message
		 */
		setTimerForAcknolegementBoth(messageId:number){
			var time = Math.random()*10000
			//console.log(time)
			interval = setTimeout(() => {
				this.acknowlegedByBoth(messageId)
			  }, time)
		},
		/**
		 * deletes the message with the given id in the messages-list
		 * @param messageId of the deleted message
		 */
		deleteMessage(messageId:number){
			for(let index = 0; index < this.messages.length; index++) {
				if(this.messages[index].id === messageId){
					this.messages.splice(index,1)
				}
			}
		},
		/**
		 * @param type of the message
		 * @returns String which is the full name of the request
		 */
		getTitle (type: String) {
			var title = "Generic"
			switch (type) {
				case 'PB':
					title = 'Pushback';
					break;
				case 'RT':
					title = 'Request Taxi';
					break;
				case 'FL':
					title = 'Flight Level';
					break;
	 		}
			return title
		},
		/**
		 * @returns the time in a String with leading zeros
		 */
		calculateTime () {
			let timeString = "new"
			let hours = new Date().getHours()
			let minutes = new Date().getMinutes()

			// add the hours to the string
			timeString = hours + ' : '
			if(hours < 10){
				timeString = '0' + hours + ' : '
			}

			// add the minutes
			if(minutes < 10){
				timeString = timeString + '0' + minutes
			} else {
				timeString = timeString + minutes
			}

			return timeString
		}
	},
});

