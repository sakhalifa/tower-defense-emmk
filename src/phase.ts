import type { Actor } from "./actor";
import { Vector2D } from "./geometry";
import type { World } from "./world";

type ActionReturnTypes = {
    move: Vector2D;
};

type Phase = {
    [key in keyof ActionReturnTypes]: {
        funcName: key;
        executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[key]>) => Array<Actor>;
    }
}[keyof ActionReturnTypes];

function createPhase(funcName: keyof ActionReturnTypes, executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[keyof ActionReturnTypes]>) => Array<Actor>) : Phase{
    return { funcName: funcName, executePhase: executePhase };
}

export type {
    Phase, ActionReturnTypes
};

export {
    createPhase
};