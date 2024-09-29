export type Observer = () => void;

export type Store<T> = {
    set: (data:T) => void;
    get: () => T;
    subscribe:  (observer: Observer) => () => void
}