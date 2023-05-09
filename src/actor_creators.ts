import type { Vector2D } from "./geometry";
import type { ActorActions } from "./actor_actions";
import type { Kind, Actor, Walker, ActionGenerators } from "./actor";

import { createVector } from "./geometry";
import { filterByKinds, findNextWaypointTarget } from "./actor";
import { throwErrorIfUndefined, executeFunctionEveryNCall } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise, spawn, play, convertEnemies,
	enemyFlee, createDefaultActionGenerator } from "./actor_actions";
import { setConviction, setFaithPoints, setMaxFaith, setSpawnProba, setWaypointNumber, setWaypointTargetAndNumber,
	setFaithPointsAndMax, setSpreadIgnorancePower, setRange, setPlayProba } from "./props";

/**
 * Actor constructor
 * @param position The position of the created Actor
 * @param actionGenerators The generators of the actions of the created actor
 * @param actions The actions of the created Actor
 * @param kind The kind of the created Actor
 * @param externalProps The data or parameters concerning the created actor
 * @returns A new actor
 */
function createActor(position: Actor["position"], actionGenerators: Partial<Actor["actionGenerators"]>,
	actions: Partial<Actor["actions"]>, kind: Actor["kind"], externalProps?: Actor["externalProps"] ): Actor
{
	const actorActions: Actor["actions"] = { ...defaultActions, ...actions };
	const defaultActionsGenerators: ActionGenerators = Object.keys(actorActions).reduce((acc, key: keyof ActorActions) => {
		const action = actorActions[key];
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		acc[key] = createDefaultActionGenerator(action);
		return acc;
	}, {} as ActionGenerators);
	const actorActionsGenerators: Actor["actionGenerators"] = {...defaultActionsGenerators, ...actionGenerators};
	return { position, actionGenerators: actorActionsGenerators, actions: actorActions, kind, externalProps };
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
							createActor(position,
								{ move: executeFunctionEveryNCall(moveTowardWaypointTarget, defaultActions["move"], 2) },
								{ move: moveTowardWaypointTarget, temperatureRise, enemyFlee },
								"ignorant")
						,10)
				,faithPoints, 100)
	,waypointTarget, 1);
}

/**
 * Constructor for a default "ignoranceSpreader" actor
 * @param position the position where the ignoranceSpreader is in the world
 * @param waypointTarget the next position that the ignoranceSpreader has to reach
 * @param faithPoints the level of faithPoints of the ignoranceSpreader
 * @param spreadIgnorancePower this value indicates how much the created "ignoranceSpreader" can increase the faith of the "ignorant" actors
 * in its range
 * @param range the range in which the ignoranceSpreader can affect the ignorants
 * @returns the created Actor of kind "ignoranceSpreader"
 */
function createIgnoranceSpreader(position: Vector2D, waypointTarget: Vector2D, faithPoints: number = 70, spreadIgnorancePower: number = 5, range: number = 3): Actor {
	throwErrorIfUndefined(waypointTarget);
	return setWaypointTargetAndNumber(
			setFaithPointsAndMax(
				setSpreadIgnorancePower(
					setRange(
						createActor(position,
							{},
							{ move: moveTowardWaypointTarget, spreadIgnorance, enemyFlee },
							"ignoranceSpreader")
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
				createActor(position, {}, { spawn }, "spawner")
			, 0)
		,spawnProba);
}

/**
 * Constructor for a default "ground" actor
 * @param position the position of the ground
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "ground"
 */
function createGround(position: Vector2D, waypointNumber?: number): Actor {
	return waypointNumber ? setWaypointNumber(createActor(position, {}, {}, "ground"), waypointNumber) : createActor(position, {}, {}, "ground");
}

/**
 * Constructor for a default "goodGuy" actor
 * @param position the position of the goodGuy
 * @param range the range in which the goodGuy can affect the walkers
 * @param conviction the conviction defines how impacting the goodGuy is on the walkers
 * @returns the created Actor of kind "goodGuy"
 */
function createGoodGuy(position: Vector2D, range: number = 2, conviction: number = 9): Actor {
	return setRange(
			setConviction(
				createActor(position, {}, {convertEnemies}, "goodGuy")
			,conviction)
		,range);
}

/**
 * Constructor for a default "spaghettiMonster" actor
 * @param position the position of the goodGuy
 * @param waypointNumber the number indexing the order in which the waypoints (including the spaghettiMonster) have to be reached
 * @param faithPoints the faith of the spaghettiMonster. The game is lost when its faithPoints reach 0.
 * @returns the created Actor of kind "spaghettiMonster"
 */
function createSpaghettiMonster(position: Vector2D, waypointNumber: number, faithPoints: number = 100): Actor {
	return setWaypointNumber(
			setFaithPoints(
				setMaxFaith(
					createActor(position, {}, {}, "spaghettiMonster")
				,100)
			,faithPoints)
		,waypointNumber);
}

/**
 * Constructor for a default "player" actor
 * @param playProba the probability for the player to play, for each play Phase
 * @returns the created Actor of kind "player"
 */
function createPlayer(playProba: number = 0.25): Actor {
	return setPlayProba(
			createActor(createVector(0, 0), {}, { play: play }, "player")
		,playProba);
}

export { createActor, createGround, createSpaghettiMonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant,
	createPlayer, createGoodGuy };