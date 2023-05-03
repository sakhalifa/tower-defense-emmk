import type { World } from "./world";
import type { Phase } from "./phase";
import type { Kind, Actor } from "./actor";

import { initWorld, initPhases, nextTurn, initActors } from "./game";
import { Vector2D, createVector } from "./geometry";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

const sprites = [
    document.getElementById("undefinedSprite"),
    document.getElementById("ignorantSprite"),
    document.getElementById("goodGuySprite"),
    document.getElementById("waypointSprite"),
].map((element) => element as HTMLImageElement);

/**
 * Returns a promise that will resolve after `ms` seconds.
 * @param ms delay in ms
 * @returns a promise that waits `ms` seconds
 */
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * Gets the sprite corresponding to an actor's kind
 * @param actorKind The actor kind
 * @returns The sprite corresponding to the actor's kind.
 */
function getActorSprite(actorKind: Kind): HTMLImageElement {
    switch(actorKind){
        case "ignorant":
            return sprites[1];
        case "goodGuy":
            return sprites[2];
        case "ground":
            return sprites[3];
        case "ignoranceSpreader":
            return sprites[2];
        default:
            return sprites[0];
    }
}

/**
 * Draw a line on the canvas
 * @param begin the beginning of the line
 * @param end the ending of the line
 * @param color the color of the line
 */
function drawLine(begin: Vector2D, end: Vector2D, color: string){
    ctx?.beginPath();
    ctx.lineWidth = 1;
    ctx?.moveTo(begin.x, begin.y);
    ctx?.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx?.stroke();
}

/**
 * Display a bar representing the ignorance remaining in an actor, assuming max ignorance is 10.
 * If the actor has undefined ignorance, do nothing
 * 
 * @param actor the actor of which ignorance is to be displayed
 * @param scale the scale of the canvas
 */
function drawActorIgnorance(actor: Actor, scale: Vector2D){
    if (actor.ignorance === undefined){
        return;
    }

    const barSize = scale.x;
    const barOffset = createVector(0, -scale.y / 10);
    const ignoranceBarBegin = createVector(actor.position.x * scale.x + barOffset.x, actor.position.y * scale.y + barOffset.y);

    drawLine(ignoranceBarBegin,
        createVector(actor.position.x * scale.x + barOffset.x + barSize, actor.position.y * scale.y + barOffset.y),
        '#ff0000');
    
    drawLine(ignoranceBarBegin,
        createVector((actor.position.x * scale.x + barOffset.x + barSize) * actor.ignorance / 10, actor.position.y * scale.y + barOffset.y),
        '#00ff00');
}

/**
 * Draws the content of the world to the canvas
 * @param world The world
 * @param actors The actors
 */
async function displayWorldToCanvas(world: World, actors: Array<Actor>){
    // Update canvas
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const canvasScale: Vector2D = createVector(canvas.width / world.width, canvas.height / world.height);
    // Draw actor sprite
    actors.forEach((actor) => 
        ctx?.drawImage(getActorSprite(actor.kind), 
            actor.position.x * canvasScale.x, actor.position.y * canvasScale.y, canvasScale.x, canvasScale.y));
    // Draw Actor ignorance
    // Only draw ignorance of ignorant
    actors.filter((actor) => actor.kind === "ignorant").forEach((actor) => drawActorIgnorance(actor, canvasScale)); 

    // wait
    await delay(500);
}

async function main(){
    const world: World = initWorld(15, 15);
	let actors: Array<Actor> = initActors(world, Math.random() < 0.6 ? 2 : 3, 1);
	const phases: Array<Phase> = initPhases();
	let i = 0;
	while (i < 50) {
		actors = nextTurn(phases, world, actors);
		await displayWorldToCanvas(world, actors);
        ++i;
	}
}

window.onload = (_) => {
    main();
};


