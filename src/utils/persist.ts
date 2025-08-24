import { PersistObject, PersistProps, Setter } from "types";
import { Observable } from "./observable";
import { Store } from "./store";
import validation from "./validation";

const blankStorage = {
    getItem: () => null,
    setItem: () => null,
    length: 0,
    clear: () => {},
    key: () => null,
    removeItem: () => {},
};

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
        storage = props.storage || blankStorage;
    }

    const stored = storage.getItem(props.name);

    if (stored) {
        try {
            data = JSON.parse(stored);
        } catch (error) {
            console.warn(`[state-man] Failed to parse stored data for key "${props.name}". Using initial data.`, error);
            data = props.data;
            try {
                storage.setItem(props.name, JSON.stringify(props.data));
            } catch (storageError) {
                console.error(`[state-man] Failed to store initial data for key "${props.name}".`, storageError);
            }
        }
    } else {
        data = props.data;
        try {
            storage.setItem(props.name, JSON.stringify(props.data));
        } catch (error) {
            console.error(`[state-man] Failed to store initial data for key "${props.name}".`, error);
        }
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