import type { World } from "./world";
import type { Phase } from "./phase";
import type { Kind, Actor } from "./actor";
import type { Axis } from "./util";

import { initWorld, initPhases, nextTurn, initActors } from "./game";
import { filterByKinds } from "./actor";

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

const kindDrawOrder: Array<Kind> = ["ground", "spawner", "goodGuy", "spaghettiMonster", "ignoranceSpreader", "ignorant"];

/**
 * Draws the content of the world to the grid
 * @param world The world
 * @param actors The actors
 */
function displayWorldToGrid(world: World, actors: Array<Actor>, grid: HTMLDivElement) {
    // generate actorCards
    // remplace enfants display-grid par les nouveaux actorCard

    grid.replaceChildren(...actors.map(drawActor));
}

function drawActor(actor: Actor): HTMLDivElement {
    const child = document.createElement('div') as HTMLDivElement;
    child.classList.add('actorCard');
    child.style.gridColumnStart = (actor.position.x + 1).toString();
    child.style.gridRowStart = (actor.position.y + 1).toString();

    if (!["ground", "spaghettiMonster"].includes(actor.kind)) {
        const hp = document.createElement('div') as HTMLDivElement;
        hp.classList.add('hpBar');
        child.appendChild(hp);

        const health = document.createElement('div') as HTMLDivElement;
        health.classList.add('health');
        health.style.width = "20%";
        health.style.height = "100%";
        health.style.backgroundColor = "green";
        hp.appendChild(health);
    }

    const img = document.createElement('div') as HTMLDivElement;
    img.classList.add('actorImage');
    img.style.backgroundImage = `url(${getActorSprite(actor.kind).src}`;
    child.append(img);

    return child;
}

async function main() {
    const world: World = initWorld(10, 10);
	const spawnersAxis: Axis = Math.random() < 0.5 ? "x" : "y";
	let actors: Array<Actor> = initActors(world, 2, spawnersAxis, 1);
    const phases: Array<Phase> = initPhases();

    const grid = document.getElementById("display-grid") as HTMLDivElement;
    grid.style.gridTemplate = `repeat(${world.height}, 1fr) / repeat(${world.width}, 1fr)`;

    while (filterByKinds(actors, ["spaghettiMonster"]).some((spaghettiMonster) => spaghettiMonster.faithPoints! > 0)) {
        actors = nextTurn(phases, world, actors, spawnersAxis);
        await displayWorldToGrid(world, actors, grid);
        // wait
        await delay(500);
    }
}

window.onload = (_) => {
    main();
};


