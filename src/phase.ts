import type { Actor } from "./actor";
import type { ActorActions } from "./actor_actions";

/**
 * A phase. It takes the result of all the actions of the actors and returns a new
 * array of actors with the actions applied. It does not resolve conflicts.
 * It is mapped according to {@link ActorActions} for consistency.
 */
type Phase = {
    [Key in keyof ActorActions]: {
        funcName: Key;
        executePhase: (oldActors: Array<Actor>, phaseResults: Array<ReturnType<ActorActions[Key]>>) => Array<Actor>;
    }
}[keyof ActorActions];

/**
 * Constructor for a phase
 * @param funcName The name of the phase
 * @param executePhase The function that computes the new actor array according to the results of the phase from all the actors
 * @returns A new phase
 */
function createPhase<Key extends keyof ActorActions>(funcName: Key & (keyof ActorActions),
    executePhase: (oldActors: Array<Actor>, phaseResults: Array<ReturnType<ActorActions[Key]>>) => Array<Actor>): Phase {
    return { funcName: funcName, executePhase: executePhase } as Phase;
}

export type { Phase };

export { createPhase };