import { cleanup, renderHook } from "@testing-library/react";
import { Observer } from "types";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { Observable } from "../utils/observable";
import { create, createExternalStore, Store } from "../utils/store";

describe("Store", () => {
    let store: Store<number>;
    let observable: Observable;
    const initialData = 0;

    beforeAll(() => {
        observable = new Observable();
        store = new Store(initialData, observable);
    });
    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    test("create store", () => {
        expect(store).toBeDefined();
        expect(store).toBeInstanceOf(Store);
    });
    test("return data", () => {
        expect(store.get()).toBe(initialData);
    });
    test("set data without previous data", () => {
        store.set(2);
        expect(store.get()).toBe(2);
    });
    test("set data with previous data", () => {
        store.set((previous) => previous! + 3);
        expect(store.get()).toBe(5);
    });
    test("create external store", () => {
        const subscribe = vi.fn((_callback: Observer) => {
            return () => {};
        });
        const snapshot = vi.fn(() => {});
        const serverSnapshot = vi.fn(() => {});
        renderHook(() => createExternalStore(subscribe, snapshot, serverSnapshot));
        expect(subscribe).toHaveBeenCalled();
        expect(snapshot).toHaveBeenCalled();
    });

    test("create store hook", () => {
        const useStore = create(50);
        const {
            result: { current },
        } = renderHook(() => useStore());
        const { state } = current;
        expect(state).toStrictEqual(50);
    });
});
