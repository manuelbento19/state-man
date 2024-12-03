import { IObservable, IStore } from "interfaces";
import { useSyncExternalStore } from "react";
import { Observer, PersistObject, Setter } from "../types";
import { Observable } from "./observable";

export class Store<T> implements IStore<T> {
    #initialData: T;
    #observable: IObservable;

    constructor(initialData: T, observable: IObservable) {
        this.#initialData = initialData;
        this.#observable = observable;
    }

    set(data: Setter<T>) {
        if (typeof data === "function") {
            this.#initialData = (data as (prev?: T) => T)(this.#initialData);
        } else {
            this.#initialData = data;
        }
        this.#observable.notify();
    }

    get() {
        return this.#initialData;
    }
}

export const createExternalStore = <T>(
    subscribe: (onStoreChange: Observer) => () => void,
    snapshot: () => T,
) => {
    return useSyncExternalStore(subscribe, snapshot);
};

export function create<T>(initial: T | PersistObject<T>) {
    let observable: IObservable;
    let store: IStore<T>;

    const isPersisted = (initial as PersistObject<T>)?.setItem !== undefined;

    if (isPersisted) {
        let persistedData = initial as PersistObject<T>;
        observable = persistedData.observable;
        store = persistedData.store;
    } else {
        observable = new Observable();
        store = new Store(initial as T, observable);
    }

    return () => {
        const state: T = createExternalStore(
            observable.subscribe.bind(observable),
            store.get.bind(store),
        );

        return {
            state,
            setState: isPersisted
                ? (initial as PersistObject<T>).setItem.bind(store)
                : store.set.bind(store),
        };
    };
}
