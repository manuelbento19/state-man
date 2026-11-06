import { IObservable } from "@/interfaces";
import { Observer } from "@/types";

export class Observable implements IObservable {
    public observers: Observer[] = [];

    constructor() {
        this.observers = [];
    }

    public subscribe(observer: Observer) {
        this.observers.push(observer);
        return () => this.unsubscribe(observer);
    }

    private unsubscribe(observer: Observer) {
        this.observers = this.observers.filter(
            (callback) => callback !== observer,
        );
    }
    public clear() {
        this.observers = [];
    }
    public notify() {
        for (const observer of [...this.observers]) {
            try {
                observer();
            } catch (error) {
                console.error(
                    "[state-man] An observer threw during notification.",
                    error,
                );
            }
        }
    }
}
