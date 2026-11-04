import { useMemo, useRef } from "react";
import { IObservable, IStore } from "interfaces";
import { Observer, Selector } from "types";
import { createExternalStore } from "./store";
import { shallow } from "./shallow";

type SelectionCache<T, U> = {
    hasValue: boolean;
    selector: Selector<T, U> | undefined;
    snapshot: T | undefined;
    value: U | undefined;
};

export function useSelector<T, U>(
    store: IStore<T>,
    observable: IObservable,
    selector: Selector<T, U>,
    getServerSnapshot: () => T
) {
    const cacheRef = useRef<SelectionCache<T, U>>({
        hasValue: false,
        selector: undefined,
        snapshot: undefined,
        value: undefined,
    });

    const subscribe = useMemo(
        () => (callback: Observer) => observable.subscribe(callback),
        [observable]
    );

    const getSnapshot = (): U => {
        const cache = cacheRef.current;
        const currentState = store.get();

        if (
            cache.hasValue &&
            cache.selector === selector &&
            Object.is(cache.snapshot, currentState)
        ) {
            return cache.value as U;
        }

        const nextValue = selector(currentState);

        cache.selector = selector;
        cache.snapshot = currentState;

        if (cache.hasValue && shallow(cache.value, nextValue)) {
            return cache.value as U;
        }

        cache.hasValue = true;
        cache.value = nextValue;

        return nextValue;
    };

    const getServerSnapshotSelected = useMemo(
        () => () => selector(getServerSnapshot()),
        [selector, getServerSnapshot]
    );

    return createExternalStore(subscribe, getSnapshot, getServerSnapshotSelected);
}
