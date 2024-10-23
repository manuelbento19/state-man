import { beforeAll, describe, expect, test, vi } from "vitest";
import { createExternalStore, Store } from "./store";
import { Observable } from "./observable";
import { render } from "@testing-library/react";
import { Observer } from "types";

describe("Store",()=>{
    let store: Store<number>;
    let observable: Observable;
    const initialData = 0;

    beforeAll(()=>{
        observable = new Observable();
        store = new Store(initialData,observable);    
    })

    test("create store",()=> {
        expect(store).toBeDefined();
        expect(store).toBeInstanceOf(Store);
    })
    test("return data",()=> {
        expect(store.get()).toBe(initialData);
    })
    test("set data without previous data",()=> {
        store.set(2)
        expect(store.get()).toBe(2);
    })
    test("set data with previous data",()=> {
        store.set(previous=>previous+3)
        expect(store.get()).toBe(5);
    })
    test("create external store",()=> {
        const subscribe = vi.fn((callback:Observer)=>{
            return () => {}
        })
        const snapshot = vi.fn(()=>{})
        
        const ExternalStoreHook = () => {
            return <h1></h1>
        };
        const {container} = render(<ExternalStoreHook/>)
        expect(container).toBeTruthy()
    })
})