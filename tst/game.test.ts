import { initWorld } from "../src/game";
import { createWorld } from "../src/world";

test("initWorld test", () => {
    // test with invalid world dimesion, should throw
    expect(() => initWorld(0, 0)).toThrow();
    expect(() => initWorld(61, 4)).toThrow();

    // test with valid world dimension
    expect(initWorld(10, 10)).toEqual(createWorld(10, 10, 0));

});