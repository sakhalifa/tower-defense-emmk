import type { Actor } from "./actor";
import type { Vector2D } from "./utils/geometry";

import { throwErrorIfUndefined } from "./utils/other_utils";

///
/// 
///

/**
 * This file contains:
 * - getters to get the content of the externalProps field of the given actor of type {@link Actor}
 * - setters to set the externalProps of the given actor to the given value
 */

///
/// 
///

function setConviction(actor: Actor, conviction: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, conviction } };
}

function getConviction(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.conviction);
	return actor.externalProps!.conviction;
}

function setRange(actor: Actor, range: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, range } };
}

function getRange(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.range);
	return actor.externalProps!.range;
}

function getWaypointTarget(actor: Actor): Vector2D {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<Vector2D>(actor.externalProps!.waypointTarget);
	return actor.externalProps!.waypointTarget!;
}

function setWaypointTarget(actor: Actor, waypointTarget: Vector2D): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTarget } };
}

function getWaypointNumber(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.waypointNumber);
	return actor.externalProps!.waypointNumber!;
}

function setWaypointNumber(actor: Actor, waypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointNumber } };
}

function getWaypointTargetNumber(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.waypointTargetNumber);
	return actor.externalProps!.waypointTargetNumber!;
}

function setWaypointTargetAndNumber(actor: Actor, waypointTarget: Vector2D, waypointTargetNumber: number): Actor {
	return setWaypointTarget(
		setWaypointTargetNumber(actor, waypointTargetNumber), waypointTarget
	);
}

function setWaypointTargetNumber(actor: Actor, waypointTargetNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTargetNumber } };
}

function getSpawnProba(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.spawnProba);
	return actor.externalProps!.spawnProba!;
}

function setSpawnProba(actor: Actor, spawnProba: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, spawnProba } };
}

function setSpreadIgnorancePower(actor: Actor, spreadIgnorancePower: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, spreadIgnorancePower } };
}

function getSpreadIgnorancePower(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.spreadIgnorancePower);
	return actor.externalProps!.spreadIgnorancePower;
}

function setFaithPoints(actor: Actor, faithPoints: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, faithPoints } };
}

function getFaithPoints(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.faithPoints);
	return actor.externalProps!.faithPoints;
}

function getMaxFaith(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.maxFaith);
	return actor.externalProps!.maxFaith;
}

function setMaxFaith(actor: Actor, maxFaith: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, maxFaith } };
}

function setFaithPointsAndMax(actor: Actor, faithPoints: number, maxFaithPoints: number): Actor {
	return setFaithPoints(
		setMaxFaith(actor, maxFaithPoints), faithPoints
	);
}

function getPlayProba(actor: Actor): number {
	throwErrorIfUndefined<Record<any, any>>(actor.externalProps);
	throwErrorIfUndefined<number>(actor.externalProps!.playProba);
	return actor.externalProps!.playProba;
}

function setPlayProba(actor: Actor, playProba: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, playProba } };
}

export {
	setConviction, getConviction, setRange, getRange,
	getWaypointTarget, setWaypointTarget, getWaypointNumber, setWaypointNumber,
	getWaypointTargetNumber, setWaypointTargetNumber, getSpawnProba, setSpawnProba,
	setSpreadIgnorancePower, getSpreadIgnorancePower, setFaithPoints, getFaithPoints, getMaxFaith,
	getPlayProba, setMaxFaith, setWaypointTargetAndNumber, setFaithPointsAndMax, setPlayProba
};