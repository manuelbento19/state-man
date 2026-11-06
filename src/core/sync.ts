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

const syncCleanups = new WeakMap<object, () => void>();

export function syncStoreData<T>(props: SyncProps<T>): () => void {
    const existingCleanup = syncCleanups.get(props.store);

    if (existingCleanup) {
        return existingCleanup;
    }

    if (!validation.isClientSide()) {
        return () => {};
    }

    const listener = (event: StorageEvent) => handleStorage(event, props);
    window.addEventListener('storage', listener);

    const cleanup = () => {
        window.removeEventListener('storage', listener);
        syncCleanups.delete(props.store);
    };

    syncCleanups.set(props.store, cleanup);

    return cleanup;
}