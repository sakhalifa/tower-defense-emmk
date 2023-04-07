import type { World } from "./world";
import type { Phase } from "./phase";

import { initWorld, initPhases, nextTurn } from "./game";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function displayWorldToCanvas(world: World){
    // Update canvas
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    world.actors.forEach((a) => ctx?.fillRect(a.pos.x * 5, a.pos.y * 5, 5, 5));
    // wait
    await delay(2000);
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

