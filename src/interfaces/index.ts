import { Observer, Setter } from "types";

export interface IObservable{
    subscribe(observer: Observer) : () => void;
    notify() : void;
}
export interface IStore<T>{
    set(data: Setter<T>): void;
    get(): T;
}