import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "./persist";
import { create } from "./store";
import { render,renderHook } from "@testing-library/react";
import PersistComponent from "../tests/PersistComponent";

describe("Persisting store data",()=>{
    const spyGetItem = vi.spyOn(Storage.prototype,"getItem");
    const spySetItem = vi.spyOn(Storage.prototype,"setItem");

    afterEach(() => {
        spyGetItem.mockClear();
        spySetItem.mockClear();
        localStorage.clear()
    })

    test("should create persisted data",()=>{
        const persistedData = persist({
            data: 1,
            name:"count",
            storage: localStorage
        })

        expect(persistedData).toBeTruthy();
        expect(persistedData.store).toBeDefined();
        expect(persistedData.setItem).toBeDefined();
        expect(persistedData.observable).toBeDefined();
    })
    test("should create store with persisted data",()=>{
        const persistedData = persist({
            data: 1,
            name:"count",
        })

        const useStore = create(persistedData);

        expect(useStore).toBeTruthy()
        const {result: {current}} = renderHook(()=>useStore())
        const {state} = current;

        expect(state).toEqual(1);
    })
    test("should persist data on localStorage",()=>{
        const {getByRole} = render(<PersistComponent/>)
        expect(spyGetItem).toHaveBeenCalled();
        expect(spyGetItem).toHaveBeenCalled();
        expect(getByRole("heading").innerHTML).toBe("Count is: 1");
    })
})

