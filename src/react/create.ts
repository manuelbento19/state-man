import { IObservable, IStore } from "@/interfaces";
import { PersistObject, Selector, UseStore } from "@/types";
import { Observable } from "@/core/observable";
import { PERSIST_MARKER } from "@/core/persistMarker";
import { Store } from "@/core/store";
import { syncStoreData } from "@/core/sync";
import { createExternalStore } from "./createExternalStore";
import { useSelector } from "./selector";

export function create<T>(initial: T | PersistObject<T>): UseStore<T> {
    let observable: IObservable;
    let store: IStore<T>;

    const isPersisted =
        (initial as PersistObject<T>)?.[PERSIST_MARKER] === true;

    if (isPersisted) {
        const persistedData = initial as PersistObject<T>;
        observable = persistedData.observable;
        store = persistedData.store;
        const { key, initialData } = initial as PersistObject<T>;
        syncStoreData({ key, store, initialData });
    } else {
        observable = new Observable();
        store = new Store(initial as T, observable);
    }

    const subscribeToStore = observable.subscribe.bind(observable);
    const getStoreSnapshot = store.get.bind(store);
    const setState = isPersisted
        ? (initial as PersistObject<T>).setItem
        : store.set.bind(store);

    const getServerSnapshot = () => {
        if (isPersisted)
            return (initial as PersistObject<T>)?.initialData;
        return initial as T;
    };

    const useStore = function <U>(selector?: Selector<T, U>) {
        if (selector) {
            return useSelector(
                store,
                observable,
                selector,
                getServerSnapshot
            );
        } else {
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
