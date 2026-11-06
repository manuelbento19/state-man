import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { Observable } from "@/core/observable";

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
    test("should keep notifying when an observer throws", () => {
        const localObservable = new Observable();
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const callback = vi.fn();

        localObservable.subscribe(() => {
            throw new Error("observer error");
        });
        localObservable.subscribe(callback);

        localObservable.notify();

        expect(callback).toHaveBeenCalledTimes(1);
        expect(consoleError).toHaveBeenCalled();
    });
    test("should notify all observers when one unsubscribes during notify", () => {
        const localObservable = new Observable();
        const first = vi.fn();
        const second = vi.fn();
        let unsubscribeFirst = () => {};

        unsubscribeFirst = localObservable.subscribe(() => {
            first();
            unsubscribeFirst();
        });
        localObservable.subscribe(second);

        localObservable.notify();

        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);
    });
});
