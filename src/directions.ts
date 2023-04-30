const enum Direction {
    east,
    west,
    north,
    south,
    total
}

/**
 * Returns the opposite direction of the given direction
 * @param direction the direction that is the opposite of the direction that will be returned
 * @returns the opposite direction of the given direction
 */
function oppositeDirection(direction: Direction): Direction {
    switch(direction) {
        case Direction.east:
            return Direction.west;
        case Direction.west:
            return Direction.east;
        case Direction.north:
            return Direction.south;
        case Direction.south:
            return Direction.north;
        default:
            throw new Error(`${direction} is not a valid direction`);
    }
}

function randomDirection(): Direction {
    return Math.random() % Direction.total;
}

export { Direction, oppositeDirection, randomDirection };