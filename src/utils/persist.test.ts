import { describe, expect, test } from "vitest";
import { persist } from "./persist";

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
})