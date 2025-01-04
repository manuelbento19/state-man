import { useEffect } from "react"
import validation from "./validation";
import { IStore } from "interfaces";

type SyncProps<T> = {
    key: string;
    store: IStore<T>;
}

const handleStorage = <T>(event: StorageEvent, props: SyncProps<T>) => {
    console.log(event)
    if(event.key === props.key){
        try {
            props.store.set(JSON.parse(event.newValue || ''))
            console.log("New data has been set")
        } catch (error) {
            console.log(error)
        }
       
    }
    
}


export function useSync<T>(props: SyncProps<T>){
    useEffect(()=>{
        if(validation.isClientSide()){
            window.addEventListener('storage',(event) => handleStorage(event, props));
        }
        return () => {
            if(validation.isClientSide()){
                window.removeEventListener('storage',event => handleStorage(event,props));
            }
        }
    }, [])  
}