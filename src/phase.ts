import type { Actor } from "./actor";
import type { World } from "./world";

type Phase = {
    funcName: string;
    func: (actor: Actor, world: World) => Actor;
};

function createPhase(funcName: string, func: (actor: Actor, world: World) => Actor) {
    return { funcName: funcName, func: func };
}

export type {
    Phase
}

export {
    createPhase
}