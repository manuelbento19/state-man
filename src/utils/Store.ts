import { useSyncExternalStore } from "react";
import { Observable } from "./Observable";
import { Store } from "../types";


export function createStore<T>(data: T): Store<T> {
    const observable = new Observable();
    let initial = data;

    function set(data_:T){
        initial = data_;
        observable.notify();
    }

    function get(){
        return initial;
    }

    return {
        set,get,
        subscribe: observable.subscribe.bind(observable)
    }
}


export function useStore<T>(store:Store<T>){

    const state = useSyncExternalStore(
        store.subscribe,
        store.get
    )

    return {
        state,
        setState: store.set
    }

} 
