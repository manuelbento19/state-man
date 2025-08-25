import { IObservable, IStore } from "interfaces";
import { Observer, Selector } from "types";
import { createExternalStore } from "./store";
import { shallow } from "./shallow";

export function createSelector<T, U>(
    store: IStore<T>,
    observable: IObservable,
    selector: Selector<T, U>,
    getServerSnapshot: () => T
) {
    let previousSelected: U | undefined;
    let previousState: T | undefined;
    let cacheInitialized = false;

    function selectAndUpdateCache(state: T): boolean {
        const selected = selector(state);
        const changed = !cacheInitialized || !shallow(previousSelected!, selected);

        if (changed) {
            previousSelected = selected;
            previousState = state;
            cacheInitialized = true;
        }

        return changed;
    }

    const subscribe = (callback: Observer) => {
        return observable.subscribe(() => {
            const currentState = store.get();

            if (cacheInitialized && Object.is(previousState, currentState)) {
                return;
            }

            const didChange = selectAndUpdateCache(currentState);

            if (didChange) {
                callback();
            }
        });
    };

    const getSnapshot = () => {
        const currentState = store.get();

        if (cacheInitialized && shallow(previousState, currentState)) {
            return previousSelected!;
        }

        selectAndUpdateCache(currentState);
        return previousSelected!;
    };

    const getServerSnapshotSelected = () => {
        return selector(getServerSnapshot());
    };

    return createExternalStore(subscribe, getSnapshot, getServerSnapshotSelected);
}