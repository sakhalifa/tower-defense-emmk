import type { World } from "./world";
import type { Phase } from "./phase";
import { Kind, Actor, walkerKeys } from "./actor";
import type { Axis } from "./utils/other_utils";

import { initWorld, initPhases, nextTurn, initActors } from "./game";
import { filterByKinds, hasOneOfKinds } from "./actor";
import { getFaithPoints, getMaxFaith } from "./props";

declare global {
    interface Window { setTemperature(hp: number, hp_max: number): void}
}

/**
 * sprites for the different elements of the game, including the actors, the empty cells...
 */
const sprites = [
    document.getElementById("grassSprite"),
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets the sprite corresponding to an actor's kind
 * @param actorKind The actor kind
 * @returns The sprite corresponding to the actor's kind.
 */
function getActorSprite(actorKind: Kind): HTMLImageElement {
    switch (actorKind) {
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
 * The order in which the actors have to be displayed
 */
const kindDrawOrder: Array<Kind> = ["ground", "spawner", "goodGuy", "spaghettiMonster", "ignoranceSpreader", "ignorant"];

/**
 * Draws the content of the world to the grid
 * @param world The world on which the game is happening
 * @param actors The actors partaking to the game
 * @param mainSpaghettiMonster the spaghettiMonster that defines the current temperature and which is the one
 * that makes the player loose the game when it has no faith points anymore
 */
function displayWorldToGrid(world: World, actors: Array<Actor>, grid: HTMLDivElement, mainSpaghettiMonster: Actor): void {
    // generate actorCards
    // remplace enfants display-grid par les nouveaux actorCard
    const actorsInDrawOrder = kindDrawOrder.reduce(
        (acc: Array<Actor>, kind) => acc.concat(actors.filter((a) => hasOneOfKinds(a, [kind])))
        , []);
    grid.replaceChildren(...actorsInDrawOrder.map(drawActor));
    window.setTemperature(getFaithPoints(mainSpaghettiMonster), getMaxFaith(mainSpaghettiMonster));
}

/**
 * Creates the dom element (computes its position and content) containing the actor to display
 * @param actor the actor to display
 * @returns the dom element containing the actor to display
 */
function drawActor(actor: Actor): HTMLDivElement {
    const child = document.createElement('div') as HTMLDivElement;
    child.classList.add('actorCard');
    child.style.gridColumnStart = (actor.position.x + 1).toString();
    child.style.gridRowStart = (actor.position.y + 1).toString();

    if (hasOneOfKinds(actor, [...walkerKeys])) {
        const hp = document.createElement('div') as HTMLDivElement;
        hp.classList.add('hpBar');
        child.appendChild(hp);

        const health = document.createElement('div') as HTMLDivElement;
        health.classList.add('health');
        health.style.width = `${(100 * getFaithPoints(actor) / getMaxFaith(actor))}%`;
        hp.appendChild(health);
    }

    const img = document.createElement('div') as HTMLDivElement;
    img.classList.add('actorImage');
    img.style.backgroundImage = `url(${getActorSprite(actor.kind).src}`;
    child.append(img);

    return child;
}

/**
 * The delay between two new computations of the game state and display refresh
 */
const defaultDelay = 500;

let speedModifier = 1;

/**
 * Inits the game and its display for the web client, and runs it
 */
async function main(): Promise<void> {
    const squareWorldSize = 20; // A square shape isn't a requirement
    const world: World = initWorld(squareWorldSize, squareWorldSize);
    const spawnersAxis: Axis = Math.random() < 0.5 ? "x" : "y";
    const playProba = 0.2;
    const spawnProba = 1;
    const minSpawners = Math.min(1, Math.floor(world.width / 8));
    const maxSpawners = Math.max(1, Math.floor(world.width / 3));
    const intermediateWaypointLinesNumber = Math.floor(world.width / 4);
    let actors: Array<Actor> = initActors(world, intermediateWaypointLinesNumber, spawnersAxis, spawnProba, playProba, minSpawners, maxSpawners);
    const phases: Array<Phase> = initPhases();

    const grid = document.getElementById("display-grid") as HTMLDivElement;
    grid.style.gridTemplate = `repeat(${world.height}, 1fr) / repeat(${world.width}, 1fr)`;

    let turnCounter = 0; // in a purely functional way, an actor containing the turns combined with an incrementTurn action and an updateTurn phase could be made
	const maxTurn = world.width * 5;
	while (turnCounter < maxTurn && filterByKinds(actors, ["spaghettiMonster"]).some((spaghettiMonster) => getFaithPoints(spaghettiMonster) > 0)) {
        actors = nextTurn(phases, world, actors, spawnersAxis);
        await displayWorldToGrid(world, actors, grid, filterByKinds(actors, ["spaghettiMonster"])[0]);
        // wait
        while (speedModifier === 0) await delay(100);
        await delay(defaultDelay * speedModifier);
        ++turnCounter;
    }

    if (filterByKinds(actors, ["spaghettiMonster"]).some((spaghettiMonster) => getFaithPoints(spaghettiMonster) > 0)) {
		console.log("Some spaghetti monsters still have faith, you won the game! :)");
	} else {
		console.log("Not a single spaghetti monsters still has faith, you lost the game! :(");
	}
}
/**
 * Calls the main function and creates a slider to modify the speed of the game
 */
window.onload = (_) => {

    const button: HTMLDivElement = document.getElementById("button")! as HTMLDivElement;
    button.addEventListener('click', () => {
        main();
    });

    const speedSlider = document.getElementById("speed-slider")! as HTMLInputElement;
    speedSlider.addEventListener("input", (e) => {
        if(speedSlider.value === "0")
        speedModifier = 0;
        else
        speedModifier = 1 / Number(speedSlider.value);
        document.getElementById("speed-value")!.textContent = `${speedSlider.value}x`;
    });
};