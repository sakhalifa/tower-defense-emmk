import type { Vector2D } from "./geometry";
import type { ActorActions } from "./actor_actions";
import type { Kind, Actor, Walker, ActionGenerators } from "./actor";

import { createVector } from "./geometry";
import { filterByKinds, findNextWaypointTarget } from "./actor";
import { throwErrorIfUndefined, executeFunctionEveryNCall } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise, spawn, play, convertEnemies, enemyFlee, defaultActionGenerator } from "./actor_actions";
import { setConviction, setFaithPoints, setMaxFaith, setSpawnProba, setWaypointNumber, setWaypointTargetAndNumber, setFaithPointsAndMax, setSpreadIgnorancePower, setRange } from "./props";

/**
 * Actor constructor
 * @param position The position of the created Actor
 * @param actions The actions of the created Actor
 * @param kind The kind of the created Actor
 * @param faithPoints The faithPoints points of the created Actor
 * @returns A new actor
 */
function createActor(position: Actor["position"], actions: Partial<Actor["actions"]>, kind: Actor["kind"], externalProps?: Actor["externalProps"] ): Actor {
	const actorActions: ActorActions = { ...defaultActions, ...actions };
	const actionGenerators: ActionGenerators = Object.keys(actorActions).reduce((acc, key: keyof ActorActions) => {
		const action = actorActions[key];
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		acc[key] = defaultActionGenerator(action);
		return acc;
	}, {} as ActionGenerators);
	return { position, actionGenerators, actions: actorActions, kind, externalProps };
}

/**
 * Constructor for a default "ignorant" actor
 * @param position the position where the ignorant is in the world
 * @param waypointTarget the next position that the ignorant has to reach
 * @param faithPoints the level of faithPoints of the ignorant
 * @returns the created Actor of kind "ignorant"
 */
function createIgnorant(position: Vector2D, waypointTarget: Vector2D, faithPoints: number = 100): Actor {
	throwErrorIfUndefined(waypointTarget);
	return setWaypointTargetAndNumber(
				setFaithPointsAndMax(
						setConviction(
							createActor(position, { move: executeFunctionEveryNCall(moveTowardWaypointTarget, (allActorsBis, oneActorBis, worldBis, spawnerAxisBis) => createVector(0, 0), 2),
								temperatureRise, enemyFlee }, "ignorant")
						,10)
				,faithPoints, 100)
	,waypointTarget, 1);
}

/**
 * Constructor for a default "ignoranceSpreader" actor
 * @param position the position where the ignoranceSpreader is in the world
 * @param waypointTarget the next position that the ignoranceSpreader has to reach
 * @param faithPoints the level of faithPoints of the ignoranceSpreader
 * @returns the created Actor of kind "ignoranceSpreader"
 */
function createIgnoranceSpreader(position: Vector2D, waypointTarget: Vector2D, faithPoints: number = 70, spreadIgnorancePower: number = 5, range: number = 3): Actor {
	throwErrorIfUndefined(waypointTarget);
	return setWaypointTargetAndNumber(
			setFaithPointsAndMax(
				setSpreadIgnorancePower(
					setRange(
						createActor(position, { move: executeFunctionEveryNCall(moveTowardWaypointTarget, (allActorsBis, oneActorBis, worldBis, spawnerAxisBis) => createVector(0, 0), 2),
							spreadIgnorance, enemyFlee }, "ignoranceSpreader")
					,range)
				,spreadIgnorancePower)
			,faithPoints, 70)
		,waypointTarget, 1);
}

/**
 * Type that should be respected for creating a dictionnary containing the constructors of the Actors that can move by themselves during the move Phase.
 * see {@link walkerCreator}
 */
type WalkerCreator = {
	[key in Walker]: (position: Vector2D, waypointTarget: Vector2D, faithPoints?: number) => Actor
};

/**
 * Constructors for the Actors that can move by themselves during the move Phase.
 * The elements of the dictionnary are constrained by the type {@link WalkerCreator}
 */
const walkerCreator: WalkerCreator = {
	ignorant: createIgnorant,
	ignoranceSpreader: createIgnoranceSpreader
};

/**
 * Generic fonction called to create Actors that can move by themselves during the move Phase.
 * Those Actors are listed in the type {@link Walker}.
 * @param kind the kind of the created Actor
 * @param path the waypoints constraining the path on which the Actor will move
 * @param position the position of the created Actor
 * @param faithPoints the faithPoints of the created Actor
 * @returns the created Actor whose kind is listed in the type {@link Walker}
 */
function createWalker(kind: Walker, path: Array<Actor>, position: Vector2D, faithPoints?: number): Actor {
	const firstWaypoint = findNextWaypointTarget(path, position, 0);
	return walkerCreator[kind](position, firstWaypoint.waypointTarget, faithPoints);
}

/**
 * Constructor for a default "spawner" actor
 * @param position the position where the spawner is in the world
 * @param spawnProba number in [0, 1] representing the probability during each spawn phase to create a new Actor
 * @returns the created Actor of kind "spawner"
 */
function createSpawner(position: Vector2D, spawnProba: number = 0.3): Actor {
	return setSpawnProba(
			setWaypointNumber(
				createActor(position, { spawn }, "spawner")
			, 0)
		,spawnProba);
}

/**
 * Constructor for a default "ground" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "ground"
 */
function createGround(position: Vector2D, waypointNumber?: number): Actor {
	return waypointNumber ? setWaypointNumber(createActor(position, {}, "ground"), waypointNumber) : createActor(position, {}, "ground");
}

function createGoodGuy(position: Vector2D, range: number = 2, conviction: number = 9): Actor {
	return createActor(position, {convertEnemies}, "goodGuy", {range, conviction});
}

/**
 * Constructor for a default "spaghettiMonster" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "spaghettiMonster"
 */
function createSpaghettiMonster(position: Vector2D, waypointNumber: number, faithPoints: number = 100): Actor {
	return setWaypointNumber(createActor(position, {}, "spaghettiMonster", {faithPoints, maxFaith: 100}), waypointNumber);
}

function createPlayer(playProba: number = 0.25): Actor {
	return createActor(createVector(0, 0), { play: play }, "player", {playProba});
}

export { createActor, createGround, createSpaghettiMonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant, createPlayer, createGoodGuy };