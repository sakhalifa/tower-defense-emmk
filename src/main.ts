import type { World } from "./world";
import type { Actor } from "./actor";

import { worldToString } from "./world";
import { actorToStringInWorld } from "./actor";
import { playGame } from "./game";

/**
 * Displays a game in text format
 * @param world the world of the game
 * @param actors the actors of the game
 */
function displayGame(world: World, actors : Array<Actor>): void {
	console.log(`\x1b[31m${'-'.repeat(world.width * 2)}\x1b[0m`);
	console.log(actors.reduce((acc, actor) => actorToStringInWorld(world, acc, actor), worldToString(world)));
	console.log(`\x1b[31m${'-'.repeat(world.width * 2)}\x1b[0m\n`);
}

playGame(displayGame);