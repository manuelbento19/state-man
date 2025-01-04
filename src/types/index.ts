import { IObservable, IStore } from "interfaces";

type Setter<T> = T | ((prev?: T) => T);
type Observer = () => void;

type PersistObject<T> = {
    key: string;
    store: IStore<T>;
    observable: IObservable;
    setItem: (item: Setter<T>) => void;
};

type PersistProps<T> = {
    name: string;
    data: T;
    storage?: Storage;
};

export type { PersistProps, Setter, PersistObject, Observer };
