import type { Actor } from "./actor";
import type { World } from "./world";

type Phase = {
	funcName: string;
	func: (Actor, World) => Actor;
};