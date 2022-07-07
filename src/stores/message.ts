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
	type: MessageType;
	origin: MessageOrigin;
	zone: string;
	acknowledgement: MessageAcknowledgement;
	parameters?: Record<string, string | number>;
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
			return state.messages.filter((msg) => msg.acknowledgement !== MessageAcknowledgement.NotSent);
		},
		/**
		 * @param state 
		 * @returns a list of all not acknowledged messages
		 */
		unsentMessages: (state) => {
			return state.messages.filter((msg) => msg.acknowledgement === MessageAcknowledgement.NotSent);
		},
		/**
		 * TODO
		 * @param state 
		 * @returns 
		 */
		getMessageById: (state) => {
			return (messageId: number) =>
				state.messages.find((msg) => msg.id === messageId);
		},
	},
	actions: {
		/**
		 * TODO: description
		 * @param message 
		 * @returns 
		 */
		addMessage(message: Omit<Message, "id">) {
			this.messages.push({ ...message, id: lastId++ });
			return this.messages.slice(-1);
		},
		/**
		 * changes the acknowlegement to 'ATC'
		 * @param messageId of the acknowleged message
		 */
		acknowlegedByATC(messageId:number) {
			this.messages.forEach(message =>{
				if(message.id === messageId){
					console.log('acknowleged:', messageId, message.acknowledgement)
					message.acknowledgement = MessageAcknowledgement.ATC;
					console.log('acknowleged:', messageId, message.acknowledgement)
					this.setTimerForAcknolegementBoth(messageId);
					return
				}
			})
		},
		/**
		 * changes the acknowlegement to 'Both'
		 * @param messageId of the acknowleged message
		 */
		acknowlegedByBoth(messageId:number){
			this.messages.forEach(message =>{
				if(message.id === messageId){					
					message.acknowledgement = MessageAcknowledgement.Both;
					console.log('acknowleged:', messageId, message.acknowledgement)
					return
				}
				// use this to create an error message
				/*if(message.id === messageId){					
					message.acknowledgement = MessageAcknowledgement.NotSent;
					console.log('refused:', messageId, message.acknowledgement)
					message.origin = MessageOrigin.Error;
					return
				}*/
			})
		},
		/**
		 * one countdown to simulate the answer of the pilot
		 * @param messageId of the acknowleged message
		 */
		setTimerForAcknolegementBoth(messageId:number){
			interval = setTimeout(() => {
				this.acknowlegedByBoth(messageId)
			  }, 3000)	
		},
		/**
		 * deletes the message with the given id in the messages-list
		 * @param messageId of the deleted message
		 */
		deleteMessage(messageId:number){
			for(let index = 0; index < this.messages.length; index++) {
				if(this.messages[index].id === messageId){
					this.messages.splice(index,1)
					console.log('deleted:', this.messages)
				}
			}
		}
	},
});

