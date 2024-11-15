import { IObservable, IStore } from "interfaces";

export type Setter<T> = T | ((prev?:T) => T)
export type Observer = () => void;

export type Persist<T> = {
    store: IStore<T>;
    observable: IObservable;
    setItem: (item: T | ((prev?: T) => T)) => void;
}