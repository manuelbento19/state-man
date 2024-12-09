import { Observer, Setter } from "types";

interface IObservable {
    subscribe(observer: Observer): () => void;
    notify(): void;
}
interface IStore<T> {
    set(data: Setter<T>): void;
    get(): T;
}

export type { IStore, IObservable };
