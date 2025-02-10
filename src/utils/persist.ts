import { PersistObject, PersistProps, Setter } from "types";
import { Observable } from "./observable";
import { Store } from "./store";
import validation from "./validation";

export function persist<T>(props: PersistProps<T>): PersistObject<T> {
    if(!props.name){
        throw new Error("You must provide a name for the persisted store");
    }
    let data: T;
    let storage: Storage;
    
    if(validation.isClientSide()){
        storage = props.storage || window.localStorage;
    }
    else{
        storage = props.storage || {
            getItem: () => null,
            setItem: () => null,
            length: 0,
            clear: () => {},
            key: () => null,
            removeItem: () => {},
        };
    }

    const stored = storage.getItem(props.name);

    if (stored) {
        try {
            data = JSON.parse(stored);
        } catch {
            data = props.data;
            storage.setItem(props.name, JSON.stringify(props.data));
        }
    } else {
        data = props.data;
        storage.setItem(props.name, JSON.stringify(props.data));
    }

    const observable = new Observable();
    const store = new Store(data, observable);

    const setItem = (item: Setter<T>) => {
        store.set(item);
        storage.setItem(props.name, JSON.stringify(store.get()));
        
    };

    return {
        key: props.name,
        store,
        observable,
        setItem,
        initialData: props.data
    };
}