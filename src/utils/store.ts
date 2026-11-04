import { IObservable, IStore } from "interfaces";
import { useSyncExternalStore } from "react";
import { Observer, PersistObject, Setter, Selector, UseStore } from "../types";
import { Observable } from "./observable";
import { syncStoreData } from "./sync";
import { useSelector } from "./selector";

export class Store<T> implements IStore<T> {
    constructor(private initialData: T, private observable: IObservable) {}

    set(data: Setter<T>) {
        const nextData =
            typeof data === "function"
                ? (data as (prev?: T) => T)(this.initialData)
                : data;

        if (Object.is(nextData, this.initialData)) {
            return;
        }

        this.initialData = nextData;
        this.observable.notify();
    }

    get() {
        return this.initialData;
    }
}

export const createExternalStore = <T>(
    subscribe: (onStoreChange: Observer) => () => void,
    snapshot: () => T,
    serverSnapshot: () => T
) => {
    
    if (typeof useSyncExternalStore === 'undefined' || useSyncExternalStore === null) {
        throw new Error('useSyncExternalStore is not available. Please ensure you are using React 18 or higher.');
    }
    
    return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
};

export function create<T>(initial: T | PersistObject<T>): UseStore<T> {
    let observable: IObservable;
    let store: IStore<T>;

    const isPersisted = (initial as PersistObject<T>)?.setItem !== undefined;

    if (isPersisted) {
        const persistedData = initial as PersistObject<T>;
        observable = persistedData.observable;
        store = persistedData.store;
        const {key} = initial as PersistObject<T>;
        syncStoreData({ key, store })
    } else {
        observable = new Observable();
        store = new Store(initial as T, observable);
    }

    const subscribeToStore = observable.subscribe.bind(observable);
    const getStoreSnapshot = store.get.bind(store);
    const setState = isPersisted
        ? (initial as PersistObject<T>).setItem.bind(store)
        : store.set.bind(store);

    const getServerSnapshot = () => {
        if(isPersisted)
        return (initial as PersistObject<T>)?.initialData;
        return initial as T;
    }

    const useStore = function<U>(selector?: Selector<T, U>) {
        if (selector) {
            return useSelector(
                store,
                observable,
                selector,
                getServerSnapshot
            );
        }
        else {
            const state: T = createExternalStore(
                subscribeToStore,
                getStoreSnapshot,
                getServerSnapshot
            );

            return {
                state,
                setState,
            };
        }
    } as UseStore<T>;

    return useStore;
}
