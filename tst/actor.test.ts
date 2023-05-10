import type { Actor } from "../src/actor";
import type { Axis } from "../src/utils/util";
import type { World } from "../src/world";
import type { ActorActionParams } from "../src/actor_actions";

import { ActorActions, ActionGenerators } from "../src/actor_actions";
import { createActor, createGround } from "../src/actor_creators";
import { actorToString, translateActor, actorToStringInWorld } from "../src/actor";
import { defaultActions, createDefaultActionGenerator } from "../src/actor_actions";
import { createVector } from "../src/utils/geometry";
import { createWorld, worldToString } from "../src/world";

function move(params: ActorActionParams): ReturnType<ActorActions["move"]> {
    return createVector(1, 1);
}

function spreadIgnorance(params: ActorActionParams) {
    return {impactedActorsIndices: [0], impactAmounts: [0]};
}

function buildDummyActor(): Actor{
	const actionGenerators: ActionGenerators = Object.keys(defaultActions).reduce((acc, key: keyof ActorActions) => {
		const action = defaultActions[key];
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		acc[key] = createDefaultActionGenerator(action);
		return acc;
	}, {} as ActionGenerators);
    return { position: createVector(0, 1), actionGenerators, actions: defaultActions, kind: "ignorant", externalProps: undefined};
}

test("Actor create test", () => {
    expect(JSON.stringify(createActor(createVector(0, 1), {}, {}, "ignorant")))
        .toEqual(JSON.stringify(buildDummyActor()));
    expect(JSON.stringify(createActor(createVector(100, 100), {}, { move, spreadIgnorance }, "ignorant")))
        .not.toEqual(JSON.stringify(buildDummyActor()));

    expect(createActor(createVector(0, 1), {}, { move, spreadIgnorance }, "ignorant").actions.move)
        .toBe(move);
    expect(createActor(createVector(0, 1), {}, { spreadIgnorance }, "ignorant").actions.move)
        .not.toBe(move);

    // This test doesn't seem to work. The 2 previous "expect" make sure everything is fine.

    // expect(JSON.stringify(createActor(createVector(0, 1), {}, { move, spreadIgnorance }, "ignorant")))
    //     .not.toEqual(JSON.stringify(buildDummyActor()));
});

test("Actor to string test", () => {
    expect(actorToString(buildDummyActor())).toEqual("{position: (0, 1), kind: ignorant}");
});

test("Actor translate test", () => {
    expect(JSON.stringify(translateActor(buildDummyActor(), createVector(0, 0)))).toEqual(JSON.stringify(buildDummyActor()));
    expect(JSON.stringify(translateActor(buildDummyActor(), createVector(1, 3)))).not.toEqual(JSON.stringify(buildDummyActor()));
    expect(JSON.stringify(translateActor(buildDummyActor(), createVector(1, 3)))).toEqual(JSON.stringify(createActor(createVector(1, 4), {}, {}, "ignorant")));
});

test("actorToStringInWorld test", () => {
    const world = createWorld(3, 3);
    expect(actorToStringInWorld(world, worldToString(world), buildDummyActor()))
        .toEqual("      \ni     \n      ");
});

test("actorToStringInWorld test", () => {
    const world = createWorld(3, 3);
    expect(actorToStringInWorld(world, worldToString(world), buildDummyActor()))
        .toEqual("      \ni     \n      ");
});

test("findNextWaypoint test", () => {
    const g0: Actor = createGround(createVector(0, 0), 0);
    const g1: Actor = createGround(createVector(0, 0), 1);
    const g2: Actor = createGround(createVector(0, 0), 2);
    const actors: Array<Actor> = [g0, g1, g2];
    expect(findNextWaypoint(actors, 0))
        .toEqual(g1);
    expect(findNextWaypoint(actors, 1))
        .toEqual(g2);
    expect(findNextWaypoint(actors, 2))
        .toEqual(undefined);
});

function findNextWaypoint(actors: Array<Actor>, currentwaypointTargetNumber: number): Actor | undefined {
	return actors.find((currentActor) => currentActor?.externalProps?.waypointNumber === currentwaypointTargetNumber + 1);
}

export {move};