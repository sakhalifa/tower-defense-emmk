import type { World } from "./world";

import { worldToString } from "./world";


import { playGame } from "./game";

playGame((world: World) => console.log(worldToString(world)));
