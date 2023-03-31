import { IntersectionType } from "typescript";
import type { Actor } from "./actor";
import { Vector2D } from "./geometry";
import type { World } from "./world";

type ActionReturnTypes = {
    move: Vector2D;
    attack: Actor[];
    
};

type Phase = {
    [K in keyof ActionReturnTypes]: {
        funcName: K;
        executePhase: (_: Array<ActionReturnTypes[K]>) => Array<Actor>;
    }
}[keyof ActionReturnTypes];

function createPhase(funcName: string, func: (actor: Actor, world: World) => Actor) {
    return { funcName: funcName, func: func };
}

export type {
    Phase, ActionReturnTypes
};

export {
    createPhase
};