import { useSyncExternalStore } from "react";
import { Observable } from "./observable";
import { Observer } from "../types";

class Store<T> {
    
    constructor(private initialData: T,private observable:Observable){}

    set(data:T){
        this.initialData = data;
        this.observable.notify();
    }

    get(){
        return this.initialData;
    }

}

const createExternalStore = <T>(subscribe: (onStoreChange: Observer) => () => void, snapshot: () => T) => {
    const external = useSyncExternalStore(subscribe,snapshot)
    return external
}

export function create<T>(initial: T){
    const observable = new Observable();
    const store = new Store(initial,observable)
    
    return () => {
        const state = createExternalStore(observable.subscribe.bind(observable),store.get.bind(store))
        
        return {
            state,
            setState: store.set.bind(store)
        }
    }

} 
