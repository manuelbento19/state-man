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
    test("should not notify when data does not change", () => {
        const localObservable = new Observable();
        const localStore = new Store(0, localObservable);
        const callback = vi.fn();
        localObservable.subscribe(callback);

        localStore.set(0);
        localStore.set((previous) => previous!);

        expect(callback).not.toHaveBeenCalled();
    });

    test("should not treat plain objects with setItem as persisted", () => {
        const initial = { value: 1, setItem: vi.fn() };
        const useStore = create(initial);
        const {
            result: { current },
        } = renderHook(() => useStore());

        expect(current.state).toEqual(initial);
        expect(typeof current.setState).toBe("function");
    });

    test("should notify when data changes", () => {
        const localObservable = new Observable();
        const localStore = new Store(0, localObservable);
        const callback = vi.fn();
        localObservable.subscribe(callback);

        localStore.set(1);

        expect(callback).toHaveBeenCalledTimes(1);
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
