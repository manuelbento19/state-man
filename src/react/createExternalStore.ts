import { useSyncExternalStore } from "react";
import { Observer } from "@/types";

export const createExternalStore = <T>(
    subscribe: (onStoreChange: Observer) => () => void,
    snapshot: () => T,
    serverSnapshot: () => T
) => {
    if (
        typeof useSyncExternalStore === "undefined" ||
        useSyncExternalStore === null
    ) {
        throw new Error(
            "useSyncExternalStore is not available. Please ensure you are using React 18 or higher."
        );
    }

    return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
};
