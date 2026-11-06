import {
    act,
    cleanup,
    fireEvent,
    render,
    renderHook,
    screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "@/core/persist";
import { PERSIST_MARKER } from "@/core/persistMarker";
import { create } from "@/react/create";
import PersistComponent from "./PersistComponent";

describe("Persisting store data", () => {
    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        localStorage.clear();
    });

    test("should create persisted data", () => {
        const persistedData = persist({
            data: 1,
            name: "count",
            storage: localStorage,
        });

        expect(persistedData).toBeTruthy();
        expect(persistedData.store).toBeDefined();
        expect(persistedData.setItem).toBeDefined();
        expect(persistedData.observable).toBeDefined();
    });
    test("should mark persisted objects", () => {
        const persistedData = persist({
            data: 1,
            name: "marked",
        });

        expect(persistedData[PERSIST_MARKER]).toBe(true);
    });
    test("should fall back to initial data when reading storage fails", () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
            throw new Error("Storage blocked");
        });

        const persistedData = persist({
            data: 7,
            name: "read-error",
        });

        expect(persistedData.store.get()).toBe(7);
        expect(localStorage.getItem("read-error")).toBe("7");
        expect(consoleError).toHaveBeenCalledWith(
            '[state-man] Failed to read stored data for key "read-error". Using initial data.',
            expect.any(Error),
        );
    });
    test("should fall back to initial data when stored JSON is invalid", () => {
        const consoleWarn = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        localStorage.setItem("invalid-json", "{invalid");

        const persistedData = persist({
            data: 7,
            name: "invalid-json",
        });

        expect(persistedData.store.get()).toBe(7);
        expect(localStorage.getItem("invalid-json")).toBe("7");
        expect(consoleWarn).toHaveBeenCalledWith(
            '[state-man] Failed to parse stored data for key "invalid-json". Using initial data.',
            expect.any(Error),
        );
    });
    test("should create store with persisted data", () => {
        const persistedData = persist({
            data: 1,
            name: "count",
        });

        const useStore = create(persistedData);

        expect(useStore).toBeTruthy();
        const {
            result: { current },
        } = renderHook(() => useStore());
        const { state } = current;

        expect(state).toEqual(1);
    });
    test("should update persisted state through setState", () => {
        const persistedData = persist({
            data: 1,
            name: "setter",
        });
        const useStore = create(persistedData);
        const { result } = renderHook(() => useStore());

        act(() => {
            result.current.setState((previous) => previous! + 1);
        });

        expect(result.current.state).toBe(2);
        expect(JSON.parse(localStorage.getItem("setter")!)).toBe(2);
    });
    test("should not diverge state and storage when serialization fails", () => {
        type State = { count: number; self?: State };

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const persistedData = persist<State>({
            data: { count: 0 },
            name: "circular",
        });
        const circular: State = { count: 1 };
        circular.self = circular;

        persistedData.setItem(circular);

        expect(persistedData.store.get()).toEqual({ count: 0 });
        expect(localStorage.getItem("circular")).toBe(
            JSON.stringify({ count: 0 }),
        );
        expect(consoleError).toHaveBeenCalledWith(
            '[state-man] Failed to persist data for key "circular". State was not updated.',
            expect.any(Error),
        );
    });
    test("should not update state when storage write fails", () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const persistedData = persist({
            data: 0,
            name: "quota",
        });

        vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
            throw new DOMException("Quota exceeded", "QuotaExceededError");
        });

        persistedData.setItem(1);

        expect(persistedData.store.get()).toBe(0);
        expect(localStorage.getItem("quota")).toBe("0");
        expect(consoleError).toHaveBeenCalled();
    });
    test("should persist data on localStorage", () => {
        const spyGetItem = vi.spyOn(Storage.prototype, "getItem");
        const spySetItem = vi.spyOn(Storage.prototype, "setItem");

        renderHook(() =>
            persist({
                data: 1,
                name: "Dev",
            }),
        );
        expect(spyGetItem).toHaveBeenCalled();
        expect(spySetItem).toHaveBeenCalled();
    });
    test("should change data on localStorage", () => {
        render(<PersistComponent />);
        expect(screen.getByRole("heading").innerHTML).toBe("Count is: 1");
        const buttons = screen.getAllByRole("button");
        act(() => fireEvent.click(buttons[1]));
        expect(screen.getByRole("heading").innerHTML).toBe("Count is: 2");
    });
});
