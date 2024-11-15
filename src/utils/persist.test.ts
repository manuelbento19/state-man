import { describe, expect, test } from "vitest";

describe("Persisting store data",()=>{
    test("should create persisted data",()=>{
        const persistedData = persist({
            data: 1,
            name:"count",
            storage: localStorage
        })

        expect(persistedData).toBeTruthy();
    })
})