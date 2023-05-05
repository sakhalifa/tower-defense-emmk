import type { World } from "./world";
import type { Phase } from "./phase";
import type { Kind, Actor } from "./actor";
import type { Axis } from "./util";

import { initWorld, initPhases, nextTurn, initActors } from "./game";
import { Vector2D, createVector } from "./geometry";
import { filterByKinds, walkerKeys } from "./actor";

const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

const sprites = [
    document.getElementById("undefinedSprite"),
    document.getElementById("ignorantSprite"),
    document.getElementById("goodGuySprite"),
    document.getElementById("waypointSprite"),
    document.getElementById("spaghettiMonsterSprite"),
    document.getElementById("ignoranceSpreaderSprite"),
    document.getElementById("groundSprite"),
    document.getElementById("spawnerSprite")
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
            return sprites[6];
        case "ignoranceSpreader":
            return sprites[5];
        case "spaghettiMonster":
            return sprites[4];
        case "spawner":
            return sprites[7];
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
 * Display a bar representing the faithPoints remaining in an actor, assuming max faithPoints is 10.
 * If the actor has undefined faithPoints, do nothing
 * 
 * @param actor the actor of which faithPoints is to be displayed
 * @param tailSize the x and y size of one tail on the canvas
 */
function drawActorIgnorance(actor: Actor, tailSize: Vector2D){
    if (actor.faithPoints === undefined){
        return;
    }

    const barSize = tailSize.x;
    const barOffset = createVector(0, -tailSize.y / 10);
    const ignoranceBarBegin = createVector(actor.position.x * tailSize.x + barOffset.x, actor.position.y * tailSize.y + barOffset.y);

    drawLine(ignoranceBarBegin,
        createVector(ignoranceBarBegin.x + barSize, ignoranceBarBegin.y),
        '#ff0000');
    
    drawLine(ignoranceBarBegin,
        createVector((ignoranceBarBegin.x + barSize) * actor.faithPoints / 10, ignoranceBarBegin.y),
        '#00ff00');
}

function drawActors(actorsToDraw: Array<Actor>, canvasScale: Vector2D) {
    actorsToDraw.forEach((actor) => 
        ctx?.drawImage(getActorSprite(actor.kind), 
            actor.position.x * canvasScale.x, actor.position.y * canvasScale.y, canvasScale.x, canvasScale.y));
}

const kindDrawOrder: Array<Kind> = ["ground", "spawner", "goodGuy", "spaghettiMonster", ...walkerKeys];

/**
 * Draws the content of the world to the canvas
 * @param world The world
 * @param actors The actors
 */
async function displayWorldToCanvas(world: World, actors: Array<Actor>){
    // Update canvas
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const canvasTailSize: Vector2D = createVector(canvas.width / world.width, canvas.height / world.height);
    // Draw actor sprite
    kindDrawOrder.forEach((kind) => drawActors(filterByKinds(actors, [kind]), canvasTailSize));
    // Draw Actor faithPoints
    // Only draw faithPoints of ignorant
    filterByKinds(actors, [...walkerKeys]).forEach((actor) => drawActorIgnorance(actor, canvasTailSize));

    // wait
    await delay(500);
}

async function main(){
    const world: World = initWorld(15, 15);
    const intermediateWaypointsLineNumber = Math.random() < 0.6 ? 2 : 3;
	const initActorsResult: [Array<Actor>, Axis] = initActors(world, intermediateWaypointsLineNumber, 1);
	let actors = initActorsResult[0];
	const spawnersAxis = initActorsResult[1];
	const phases: Array<Phase> = initPhases();

	while (actors.find((a) => a.kind === "spaghettiMonster")!.faithPoints! > 0) {
		actors = nextTurn(phases, world, actors, spawnersAxis);
		await displayWorldToCanvas(world, actors);
	}
}

window.onload = (_) => {
    main();
};


