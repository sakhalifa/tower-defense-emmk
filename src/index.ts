import type { World } from "./world";
import type { Phase } from "./phase";

import { initWorld, initPhases, nextTurn } from "./game";
import { Vector2D, createVector } from "./geometry";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function displayWorldToCanvas(world: World){
    // Update canvas
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const actorSize: Vector2D = createVector(canvas.width / world.width, canvas.height / world.height);

    world.actors.forEach((a) => 
        ctx?.fillRect(a.pos.x * actorSize.x, a.pos.y * actorSize.y, actorSize.x, actorSize.y));

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

main();

