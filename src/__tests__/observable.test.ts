import { afterEach } from "node:test";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Observable } from "../utils/observable";

describe("Observable", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    let observer: Observable;

    beforeAll(() => {
        observer = new Observable();
    });

    test("create observable element", () => {
        expect(observer).toBeDefined();
        expect(observer).toBeInstanceOf(Observable);
    });
    test("subscribe events", () => {
        const callback = vi.fn();
        observer.subscribe(callback);
        expect(observer.observers).toContain(callback);
    });
    test("notify events", () => {
        const callback = vi.fn();
        observer.subscribe(callback);
        observer.notify();
        expect(callback).toHaveBeenCalled();
    });
});
