import { describe, expect, test } from "vitest";
import { shallow } from "@/core/shallow";

describe("shallow", () => {
    test("should return true for identical values", () => {
        expect(shallow(1, 1)).toBe(true);
        expect(shallow("value", "value")).toBe(true);
        expect(shallow(null, null)).toBe(true);
    });

    test("should compare object properties one level deep", () => {
        expect(shallow({ count: 1, name: "test" }, { count: 1, name: "test" })).toBe(true);
        expect(shallow([1, 2], [1, 2])).toBe(true);
    });

    test("should return false when a property changes", () => {
        expect(shallow({ count: 1 }, { count: 2 })).toBe(false);
        expect(shallow([1, 2], [1, 3])).toBe(false);
    });

    test("should return false when the keys differ", () => {
        expect(shallow({ count: 1 }, { count: 1, name: "test" })).toBe(false);
        expect(shallow({ count: 1, name: "test" }, { count: 1 })).toBe(false);
    });

    test("should not compare nested objects deeply", () => {
        expect(
            shallow({ meta: { active: true } }, { meta: { active: true } }),
        ).toBe(false);
    });

    test("should return false when one side is not an object", () => {
        expect(shallow(1, { count: 1 })).toBe(false);
        expect(shallow({ count: 1 }, 1)).toBe(false);
        expect(shallow(null, { count: 1 })).toBe(false);
        expect(shallow({ count: 1 }, undefined)).toBe(false);
    });
});
