import type { Actor } from "./actor";
import type { Matrix } from "./geometry";
type World = {
	actors: Matrix<Actor>;
	width: number;
	height: number;
};

function createWorld(){
	
}

function printWorld(w: World){
	
}
export type { World };
