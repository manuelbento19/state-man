import { beforeAll, describe, expect, it, test, vi } from "vitest";
import { createExternalStore, Store } from "./store";
import { Observable } from "./observable";
import { render, screen } from "@testing-library/react";
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
        const subscribe = vi.fn((_callback:Observer)=>{
            return () => {}
        })
        const snapshot = vi.fn(()=>{})
        
        const ExternalStoreHook = () =>  {
            createExternalStore(subscribe,snapshot);
            return <h1>Page</h1>
        };
        const {container} = render(<ExternalStoreHook/>)
        expect(container).toBeTruthy();
        expect(screen.getByRole("heading")).toBeDefined();
        expect(subscribe).toHaveBeenCalled();
        expect(snapshot).toHaveBeenCalled();
    })
})