import { IObservable, IStore } from "@/interfaces";
import { Setter } from "@/types";

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
