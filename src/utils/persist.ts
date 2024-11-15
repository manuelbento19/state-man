import { Persist, Setter } from "types";
import { Observable } from "./observable";
import { Store } from "./store";

type Props<T> = {
    name: string;
    data: T;
    storage?: Storage;
}

export function persist<T>(props:Props<T>) : Persist<T>{
    let storage = props.storage || localStorage;

    let data: T;
    const stored = storage.getItem(props.name);
    
    if(stored){
        try{
            data = JSON.parse(stored);
        }
        catch{
            data = props.data
            storage.setItem(props.name, JSON.stringify(props.data))
        }
    }
    else {
        data = props.data;
        storage.setItem(props.name, JSON.stringify(props.data))
    }
    
    const observable = new Observable();
    const store = new Store(data,observable)
    
    const setItem = (item: Setter<T>) => {
        store.set(item);
        storage.setItem(props.name, JSON.stringify(store.get()))
    }

    return {
        store,
        observable,
        setItem
    }
}