type Props<T> = {
    data: T,
    name: string;
    storage?: Storage;
}

export function persist<T>(props:Props<T>) {
    return props
}