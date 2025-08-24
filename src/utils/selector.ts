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
    let hasSelected = false;

    const subscribe = (callback: Observer) => {
        return observable.subscribe(() => {
            const currentState = store.get();

            if (hasSelected && Object.is(previousState, currentState)) {
                return;
            }

            const currentSelected = selector(currentState);

            if (!hasSelected) {
                previousSelected = currentSelected;
                previousState = currentState;
                hasSelected = true;
                callback();
                return;
            }

            if (!shallow(previousSelected!, currentSelected)) {
                previousSelected = currentSelected;
                previousState = currentState;
                callback();
            }
        });
    };

    const getSnapshot = () => {
        const currentState = store.get();

        if (hasSelected && shallow(previousState, currentState)) {
            return previousSelected!;
        }

        const currentSelected = selector(currentState);

        // Update the cache only when needed
        if (!hasSelected || !shallow(previousSelected!, currentSelected)) {
            previousSelected = currentSelected;
            previousState = currentState;
            hasSelected = true;
        }

        return currentSelected;
    };

    const getServerSnapshotSelected = () => {
        const serverState = getServerSnapshot();
        return selector(serverState);
    };

    return createExternalStore(subscribe, getSnapshot, getServerSnapshotSelected);
}