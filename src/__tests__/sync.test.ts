import { afterEach, describe, expect, test, vi } from "vitest";
import { Observable } from "@/utils/observable";
import { Store } from "@/utils/store";
import { syncStoreData } from "@/utils/sync";

describe("syncStoreData", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("should apply valid storage updates", () => {
        const store = new Store(1, new Observable());
        syncStoreData({ key: "sync-update", store, initialData: 0 });

        window.dispatchEvent(
            new StorageEvent("storage", {
                key: "sync-update",
                newValue: JSON.stringify(5),
            }),
        );

        expect(store.get()).toBe(5);
    });
    test("should reset the store when the key is removed", () => {
        const store = new Store(1, new Observable());
        syncStoreData({ key: "sync-remove", store, initialData: 0 });

        store.set(2);
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: "sync-remove",
                newValue: null,
            }),
        );

        expect(store.get()).toBe(0);
    });
    test("should reset the store when storage is cleared", () => {
        const store = new Store(1, new Observable());
        syncStoreData({ key: "sync-clear", store, initialData: 0 });

        store.set(2);
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: null,
                newValue: null,
            }),
        );

        expect(store.get()).toBe(0);
    });
    test("should ignore invalid JSON without throwing", () => {
        const store = new Store(1, new Observable());
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        syncStoreData({ key: "sync-invalid", store, initialData: 0 });

        window.dispatchEvent(
            new StorageEvent("storage", {
                key: "sync-invalid",
                newValue: "{invalid",
            }),
        );

        expect(store.get()).toBe(1);
        expect(consoleError).toHaveBeenCalled();
    });
});
