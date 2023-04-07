import type { World } from "./world";

import { playGame } from "./game";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;


function displayWorldToCanvas(world: World){
    // Update canvas
    // wait
}

playGame(displayWorldToCanvas);