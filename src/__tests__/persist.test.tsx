import {
    act,
    cleanup,
    fireEvent,
    render,
    renderHook,
    screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "../utils/persist";
import { create } from "../utils/store";
import PersistComponent from "./PersistComponent";

describe("Persisting store data", () => {
    const spyGetItem = vi.spyOn(Storage.prototype, "getItem");
    const spySetItem = vi.spyOn(Storage.prototype, "setItem");

    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
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
    test("should persist data on localStorage", () => {
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
