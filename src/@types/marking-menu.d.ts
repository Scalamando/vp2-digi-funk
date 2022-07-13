declare module "marking-menu" {
	import type { Observable } from "rxjs";

	export type MarkingMenuSubItem = {
		name: string;
		children: (string | MarkingMenuSubItem)[];
	};
	export type MarkingMenuItem = string | MarkingMenuSubItem;
	export type MarkingMenuItems = Array<MarkingMenuItem>;

	export type MarkingMenuSelection = {
		type: string;
		selection?: {
			name: string;
			id: string;
		};
	};
	export type MarkingMenuObservable = Observable<MarkingMenuSelection>;

	export type MarkingMenuOptions = {
		notifySteps: boolean;
	};

	const constructor: (
		items: MarkingMenuItems,
		element: HTMLElement,
		options?: MarkingMenuOptions
	) => MarkingMenuObservable;

	export default constructor;
}

