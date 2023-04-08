import type { World } from "./world";
import type { Actor } from "./actor";

import { worldToString } from "./world";


import { playGame } from "./game";

playGame((world: World, actors : Array<Actor>) => console.log(worldToString(world)));
