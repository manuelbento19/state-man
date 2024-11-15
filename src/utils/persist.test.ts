import { describe, expect, test } from "vitest";
import { persist } from "./persist";
import { create } from "./store";
import { renderHook } from "@testing-library/react";

describe("Persisting store data",()=>{
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
})