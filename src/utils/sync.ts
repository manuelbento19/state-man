import validation from "./validation";
import { IStore } from "interfaces";

type SyncProps<T> = {
    key: string;
    store: IStore<T>;
}

const handleStorage = <T>(event: StorageEvent, props: SyncProps<T>) => {
    if(event.key === props.key){
        try {
            props.store.set(JSON.parse(event.newValue || ''))
        } catch (error) {
            console.log(error)
        }
    }
}

export function syncStoreData<T>(props: SyncProps<T>){
    if(validation.isClientSide()){
        window.addEventListener('storage',(event) => handleStorage(event, props));
    }
}