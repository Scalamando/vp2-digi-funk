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
	acknowledgementATC: String;
	acknowledgementPilot: String;
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
					//console.log('acknowleged:', messageId, message.acknowledgement)
					message.acknowledgementPilot = this.calculateTime()
					message.origin = MessageOrigin.Error;
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

