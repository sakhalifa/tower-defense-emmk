import type { World } from "./world";
import type { Phase } from "./phase";
import type { Kind } from "./actor";

import { initWorld, initPhases, nextTurn } from "./game";
import { Vector2D, createVector } from "./geometry";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

const sprites = [
    document.getElementById("ignorantSprite"),
    document.getElementById("good_guySprite"),
    document.getElementById("groundSprite"),
].map((element) => element as HTMLImageElement);

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function getActorSprite(actorKind: Kind): HTMLImageElement {
    switch(actorKind){
        case "ignorant":
            return sprites[0];
        case "good_guy":
            return sprites[1];
        case "ground":
            return sprites[2];
        case "healer":
            return sprites[1];
    }
    throw Error("Eslint friendly error, cannot see that all enum values are mapped :)");
}

async function displayWorldToCanvas(world: World){
    // Update canvas
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const canvasScale: Vector2D = createVector(canvas.width / world.width, canvas.height / world.height);

    world.actors.forEach((a) => 
        ctx?.drawImage(getActorSprite(a.kind), 
            a.pos.x * canvasScale.x, a.pos.y * canvasScale.y, canvasScale.x, canvasScale.y));
    // wait
    await delay(1000);
}
async function main(){
    let world: World = initWorld();
    const phases: Array<Phase> = initPhases();
    let isFinished: boolean = false;
    while(!isFinished){
        world = nextTurn(phases, world);
        await displayWorldToCanvas(world);
        // Update this later ?
        isFinished = false;
    }
}

window.onload = (_) => {
    main();
}


