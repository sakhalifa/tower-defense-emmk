import type { World } from "./world";
import type { Actor } from "./actor";

import { worldToString } from "./world";
import {actorToStringInWorld} from "./actor";


import { playGame, displayGame } from "./game";

playGame(displayGame);