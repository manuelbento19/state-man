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
        expect(persistedData.name).toBeDefined();
        expect(persistedData.data).toBeDefined();
        expect(persistedData.name).toBeDefined();
    })
})