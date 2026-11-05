import validation from "./validation";
import { IStore } from "@/interfaces";

type SyncProps<T> = {
    key: string;
    store: IStore<T>;
    initialData: T;
}

const handleStorage = <T>(event: StorageEvent, props: SyncProps<T>) => {
    if (event.key === null) {
        props.store.set(props.initialData);
        return;
    }

    if (event.key !== props.key) {
        return;
    }

    if (event.newValue === null) {
        props.store.set(props.initialData);
        return;
    }

    try {
        props.store.set(JSON.parse(event.newValue));
    } catch (error) {
        console.error(`[state-man] Failed to parse storage event for key "${props.key}".`, error);
    }
}

export function syncStoreData<T>(props: SyncProps<T>){
    if(validation.isClientSide()){
        window.addEventListener('storage',(event) => handleStorage(event, props));
    }
}