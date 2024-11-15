import { useSyncExternalStore } from "react";
import { Observable } from "./observable";
import { Observer, Persist, Setter } from "../types";
import { IObservable, IStore } from "interfaces";

export class Store<T> implements IStore<T>{
    
    constructor(private initialData: T,private observable:IObservable){}
    
    set(data: Setter<T>){
        if(typeof data === "function"){
            this.initialData = (data as (prev?:T) => T)(this.initialData);
        }
        else{
            this.initialData = data;
        }
        this.observable.notify();
    };

    get(){
        return this.initialData;
    }

}

export const createExternalStore = <T>(subscribe: (onStoreChange: Observer) => () => void, snapshot: () => T) => {
    const external = useSyncExternalStore(subscribe,snapshot)
    return external
}

export function create<T>(initial: T | Persist<T>){
    let observable: IObservable;
    let store: IStore<T>;

    const isPersisted = (initial as Persist<T>)?.setItem !== undefined;

    if(isPersisted){
        let persistedData = initial as Persist<T>;
        observable = persistedData.observable;
        store = persistedData.store;
    }
    else{
        observable  = new Observable();
        store = new Store(initial as T,observable);
    }

    return () => {
        const state: T = createExternalStore(observable.subscribe.bind(observable),store.get.bind(store))
        
        return {
            state,
            setState: isPersisted ? (initial as Persist<T>).setItem.bind(store) : store.set.bind(store)
        }
    }

} 
