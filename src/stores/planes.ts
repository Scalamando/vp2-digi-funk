import { defineStore } from "pinia";
import { oneOfArr } from "./message";

export interface Plane {
	id: string;
}

function generatePlanes(): Plane[] {
	const randomLetters = () =>
		(Math.random() + 1)
			.toString(36)
			.substring(8)
			.replace(/\d/g, "")
			.slice(0, 3)
			.toUpperCase();
	const randomNumber = () => Math.ceil(Math.random() * 9000) + 1000;

	return Array.from({ length: 10 }, () => ({
		id: randomLetters() + String(randomNumber()),
	}));
}

export const usePlanesStore = defineStore({
	id: "planes",
	state: () => ({
		planes: generatePlanes(),
	}),
	getters: {
		getPlaneById: (state) => {
			return (id: string) => state.planes.filter((msg) => msg.id === id);
		},
	},
	actions: {
		getRandomPlane() {
			return oneOfArr(this.planes);
		},
	},
});

