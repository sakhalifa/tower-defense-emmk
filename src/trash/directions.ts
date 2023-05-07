const enum Direction {
    East,
    West,
    North,
    South,
    Total
}

/**
 * Returns the opposite direction of the given direction
 * @param direction the direction that is the opposite of the direction that will be returned
 * @returns the opposite direction of the given direction
 */
function oppositeDirection(direction: Direction): Direction {
    switch(direction) {
        case Direction.East:
            return Direction.West;
        case Direction.West:
            return Direction.East;
        case Direction.North:
            return Direction.South;
        case Direction.South:
            return Direction.North;
        default:
            throw new Error(`${direction} is not a valid direction`);
    }
}

function randomDirection(): Direction {
    return Math.floor(Math.random() * Direction.Total);
}

export { Direction, oppositeDirection, randomDirection };