import type { Actor } from "./actor";
import { Vector2D } from "./geometry";
import type { World } from "./world";

type ActionReturnTypes = {
    move: Vector2D;
    heal: {actorId: number, amount: number};
};

type Phase = {
    [Key in keyof ActionReturnTypes]: {
        funcName: Key;
        executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[Key]>) => Array<Actor>;
    }
}[keyof ActionReturnTypes];

function createPhase<Key extends keyof ActionReturnTypes>(funcName: Key, executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[Key]>) => Array<Actor>): Phase {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return { funcName: funcName, executePhase: executePhase };
}

export type {
    Phase, ActionReturnTypes
};

export {
    createPhase
};