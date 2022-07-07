declare module "marking-menu" {
	import type { Observable } from "rxjs";

	export type MarkingMenuSubItem = {
		name: string;
		children: string[] | MarkingMenuSubItem;
	};
	export type MarkingMenuItem = string | MarkingMenuSubItem;
	export type MarkingMenuItems = Array<MarkingMenuItem>;

	export type MarkingMenuObservable = Observable<{ name: string }>;

	const constructor: (
		items: MarkingMenuItems,
		element: HTMLElement
	) => MarkingMenuObservable;

	export default constructor;
}

