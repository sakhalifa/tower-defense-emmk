import { IntersectionType } from "typescript";
import type { Actor } from "./actor";
import { Vector2D } from "./geometry";
import type { World } from "./world";

type ActionReturnTypes = {
    move: Vector2D;
    show: Actor;
};

type Phase = {
    [key in keyof ActionReturnTypes]: {
        funcName: key;
        executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[key]>) => Array<Actor>;
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