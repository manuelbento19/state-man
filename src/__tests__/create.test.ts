import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "@/core/persist";
import { create } from "@/react/create";

describe("create imperative API", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    test("should expose getState, setState and subscribe", () => {
        const useStore = create(0);
        const listener = vi.fn();
        const unsubscribe = useStore.subscribe(listener);

        expect(useStore.getState()).toBe(0);

        useStore.setState(1);
        useStore.setState((previous) => previous! + 1);

        expect(useStore.getState()).toBe(2);
        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
        useStore.setState(3);

        expect(listener).toHaveBeenCalledTimes(2);
    });
    test("should destroy the store and be idempotent", () => {
        const useStore = create(0);
        const listener = vi.fn();
        useStore.subscribe(listener);

        useStore.destroy();
        useStore.destroy();
        useStore.setState(1);

        expect(listener).not.toHaveBeenCalled();
    });
    test("should remove the storage listener on destroy", () => {
        const addEventListener = vi.spyOn(window, "addEventListener");
        const removeEventListener = vi.spyOn(window, "removeEventListener");
        const useStore = create(
            persist({
                data: 0,
                name: "imperative-destroy",
            }),
        );
        const storageListener = addEventListener.mock.calls.find(
            ([type]) => type === "storage",
        )?.[1];

        expect(storageListener).toBeDefined();

        useStore.destroy();
        useStore.destroy();

        expect(removeEventListener).toHaveBeenCalledTimes(1);
        expect(removeEventListener).toHaveBeenCalledWith(
            "storage",
            storageListener,
        );
    });
});
