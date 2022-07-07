declare module "marking-menu" {
	import type { Observable } from "rxjs";

	type Options = Array<string | string[]>;

	const constructor: (options: Options, element: HTMLElement) => Observable;

	export default constructor;
}

