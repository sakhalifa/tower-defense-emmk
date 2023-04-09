import type { World } from "./world";
import type { Actor } from "./actor";

import { worldToString } from "./world";
import {actorToStringInWorld} from "./actor";


import { playGame } from "./game";

function displayGame(world: World, actors : Array<Actor>): void {
	console.log('-'.repeat(world.width));
	console.log(actors.reduce((acc, actor) => actorToStringInWorld(world, acc, actor), worldToString(world)));
	console.log(`${'-'.repeat(world.width)}\n`);
}

playGame(displayGame);