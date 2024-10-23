import { Observer } from "../types";

export class Observable{
    public observers: Observer[] = []

    constructor(){
        this.observers = []
    }

    public subscribe(observer: Observer){
        this.observers.push(observer);
        return () => this.unsubscribe(observer);
    }

    private unsubscribe(observer: Observer){
        this.observers = this.observers.filter(callback=>callback!=observer);
    }
    public notify(){
        this.observers.forEach(observer=>observer())
    }
}