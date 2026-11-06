import { IObservable, IStore } from "@/interfaces";
import { PERSIST_MARKER } from "@/core/persistMarker";
import { Selector } from "./selector";

type Setter<T> = T | ((prev?: T) => T);
type Observer = () => void;

type PersistObject<T> = {
    [PERSIST_MARKER]: true;
    key: string;
    store: IStore<T>;
    observable: IObservable;
    setItem: (item: Setter<T>) => void;
    initialData: T;
};

type PersistProps<T> = {
    name: string;
    data: T;
    storage?: Storage;
};

export type UseStore<T> = {
    (): {
        state: T;
        setState: (data: Setter<T>) => void;
    };
    <U>(selector: Selector<T, U>): U;
    getState: () => T;
    setState: (data: Setter<T>) => void;
    subscribe: (observer: Observer) => () => void;
    destroy: () => void;
};

export type { PersistProps, Setter, PersistObject, Observer };
export type { Selector, EqualityFn } from './selector';

