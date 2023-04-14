import type { World } from "./world";
import type { Phase } from "./phase";
import type { Kind, Actor } from "./actor";

import { initWorld, initPhases, nextTurn, initActors } from "./game";
import { Vector2D, createVector } from "./geometry";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

const sprites = [
    document.getElementById("ignorantSprite"),
    document.getElementById("goodGuySprite"),
    document.getElementById("groundSprite"),
].map((element) => element as HTMLImageElement);

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function getActorSprite(actorKind: Kind): HTMLImageElement {
    switch(actorKind){
        case "ignorant":
            return sprites[0];
        case "goodGuy":
            return sprites[1];
        case "ground":
            return sprites[2];
        case "healer":
            return sprites[1];
    }
    throw Error("Eslint friendly error, cannot see that all enum values are mapped :)");
}

async function displayWorldToCanvas(world: World, actors: Array<Actor>){
    // Update canvas
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const canvasScale: Vector2D = createVector(canvas.width / world.width, canvas.height / world.height);
    actors.forEach((actor) => 
        ctx?.drawImage(getActorSprite("ignorant"), 
            actor.position.x * canvasScale.x, actor.position.y * canvasScale.y, canvasScale.x, canvasScale.y));
    // wait
    await delay(1000);
}
async function main(){
    const world: World = initWorld(7, 7);
	let actors: Array<Actor> = initActors(world);
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	while (!finished) {
		actors = nextTurn(phases, world, actors);
		await displayWorldToCanvas(world, actors);
		finished = i++ === 5;
	}
}

window.onload = (_) => {
    main();
};


