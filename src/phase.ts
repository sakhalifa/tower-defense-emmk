import type { Actor } from "./actor";
import type { World } from "./world";

type Phase = {
	funcName: string;
	func: (actor : Actor, world : World) => Actor;
};

export type {
    Phase
}