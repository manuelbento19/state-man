export type Selector<T, U> = (state: T) => U;

export type EqualityFn<T> = (a: T, b: T) => boolean;