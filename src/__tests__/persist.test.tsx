import {
    act,
    cleanup,
    fireEvent,
    render,
    renderHook,
    screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "@/utils/persist";
import { PERSIST_MARKER } from "@/utils/persistMarker";
import { create } from "@/utils/store";
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
