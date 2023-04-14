import type { Actor } from "./actor";
import { Vector2D } from "./geometry";

/**
 * Helper type that ensures the types of {@link Phase} and {@link Actor} are coherent
 */
type ActionReturnTypes = {
    spawn: Actor | undefined;
    temperatureRise: number;
    convertEnemies: {actorIndices: Array<number>, amount: Array<number>};
    heal: {actorIndices: number[], amount: number[]};
    enemyFlee: boolean;
    move: Vector2D;
};

/**
 * A phase. It takes the result of all the actions of the actors and returns a new
 * array of actors with the actions applied. It does not resolve conflicts.
 * It is mapped according to {@link ActionReturnTypes} for consistency.
 */
type Phase = {
    [Key in keyof ActionReturnTypes]: {
        funcName: Key;
        executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[Key]>) => Array<Actor>;
    }
}[keyof ActionReturnTypes];

/**
 * Constructor for a phase
 * @param funcName The name of the phase
 * @param executePhase The function that computes the new actor array according to the results of the phase from all the actors
 * @returns A new phase
 */
function createPhase<Key extends keyof ActionReturnTypes>(funcName: Key,
    executePhase: (oldActors: Array<Actor>, phaseResults: Array<ActionReturnTypes[Key]>) => Array<Actor>): Phase {
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