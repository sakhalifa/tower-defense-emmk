import { Actor, actorToStringInWorld } from "../src/actor";
import type { World } from "../src/world";

import { createActor, createGround, actorToString, translateActor, defaultActions } from "../src/actor";
import { createVector } from "../src/geometry";

import { createWorld, worldToString } from "../src/world";

function move(_: Array<Actor>, __: Actor) {
    return createVector(0, 0);
}

function heal(_: Array<Actor>, __: Actor) {
    return {actorIndices: [0], amount: [0]};
}

function buildDummyActor(): Actor{
    return { position: createVector(0, 1), actions: defaultActions, kind: "ignorant", ignorance: undefined, externalProps: undefined };
}

test("Actor create test", () => {
    expect(createActor(createVector(0, 1), {}, "ignorant"))
        .toEqual(buildDummyActor());
    expect(createActor(createVector(100, 100), { move, heal }, "ignorant"))
        .not.toEqual(buildDummyActor());
    expect(createActor(createVector(0, 1), { move }, "ignorant"))
        .not.toEqual(buildDummyActor());
});

test("Actor to string test", () => {
    expect(actorToString({
        position: createVector(0, 1),
        actions: defaultActions,
        kind: "ignorant"
    })).toEqual("{position: (0, 1)}");
});

test("Actor translate test", () => {
    expect(translateActor(buildDummyActor(), createVector(0, 0))).toEqual(buildDummyActor());
    expect(translateActor(buildDummyActor(), createVector(1, 3))).not.toEqual(buildDummyActor());
    expect(translateActor(buildDummyActor(), createVector(1, 3))).toEqual(createActor(createVector(1, 4), {}, "ignorant"));
});

test("actorToStringInWorld test", () => {
    const world = createWorld(3, 3, 0);
    expect(actorToStringInWorld(world, worldToString(world), buildDummyActor()))
        .toEqual("      \ni     \n      ");
});

test("actorToStringInWorld test", () => {
    const world = createWorld(3, 3, 0);
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

