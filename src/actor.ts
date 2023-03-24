import type { Vector2D } from "./geometry";
import type { World } from "./world";

type Actor = {
	pos: Vector2D;
	actions: {
		move: (world: World, actor: Actor) => Vector2D;
	};

};

function printActor(a: Actor){
	
}
export type { Actor };