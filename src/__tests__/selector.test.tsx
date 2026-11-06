import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { create } from "@/react/create";

describe("Selector System", () => {
    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    test("should work without selector", () => {
        const useStore = create({ count: 0, name: "test" });
        const { result } = renderHook(() => useStore());

        expect(result.current.state).toEqual({ count: 0, name: "test" });
        expect(typeof result.current.setState).toBe("function");
    });

    test("should select specific part of state", () => {
        const useStore = create({ count: 0, name: "test" });
        const { result } = renderHook(() => useStore((state) => state.count));

        expect(result.current).toBe(0);
    });

    test("should only re-render when selected part changes", () => {
        const useStore = create({ count: 0, name: "test" });

        const { result: countResult } = renderHook(() =>
            useStore((state) => state.count)
        );

        const { result: nameResult } = renderHook(() =>
            useStore((state) => state.name)
        );

        const { result: storeResult } = renderHook(() => useStore());

        const initialCount = countResult.current;

        act(() => {
            storeResult.current.setState((prev) => ({ ...prev!, name: "changed" }));
        });

        expect(countResult.current).toBe(initialCount);
        expect(nameResult.current).toBe("changed");
    });

    test("should re-render when the selected value changes", () => {
        const useStore = create({ count: 0, name: "test" });
        const { result: storeResult } = renderHook(() => useStore());
        const { result } = renderHook(() =>
            useStore((state) => state.count),
        );

        expect(result.current).toBe(0);

        act(() => {
            storeResult.current.setState((prev) => ({
                ...prev!,
                count: 1,
            }));
        });

        expect(result.current).toBe(1);
    });

    test("should keep the selection stable when the selector identity changes", () => {
        type State = { count: number; name: string };
        type Selection = { count: number };

        const useStore = create<State>({ count: 0, name: "test" });
        const { result, rerender } = renderHook(
            ({ selector }: { selector: (state: State) => Selection }) =>
                useStore(selector),
            {
                initialProps: {
                    selector: (state: State) => ({ count: state.count }),
                },
            },
        );
        const initialSelection = result.current;

        rerender({
            selector: (state: State) => ({ count: state.count }),
        });

        expect(result.current).toBe(initialSelection);
    });

    test("should keep the same array reference when shallow-equal", () => {
        const useStore = create({ items: [1, 2], other: 0 });
        const { result: storeResult } = renderHook(() => useStore());
        const { result } = renderHook(() =>
            useStore((state) => state.items),
        );
        const initialItems = result.current;

        act(() => {
            storeResult.current.setState((prev) => ({
                ...prev!,
                items: [1, 2],
            }));
        });

        expect(result.current).toBe(initialItems);
    });

    test("should use the server snapshot", () => {
        const useStore = create(5);

        function Component() {
            return createElement("span", null, useStore((state) => state));
        }

        expect(renderToString(createElement(Component))).toBe("<span>5</span>");
    });

    test("should not re-render when the selected value is shallow-equal", () => {
        const useStore = create({ count: 0, meta: { label: "initial" } });
        const { result: storeResult } = renderHook(() => useStore());
        let renders = 0;

        const { result } = renderHook(() => {
            renders += 1;
            return useStore((state) => ({ count: state.count }));
        });

        const initialSelection = result.current;
        const initialRenders = renders;

        act(() => {
            storeResult.current.setState((prev) => ({
                ...prev!,
                meta: { label: "changed" },
            }));
        });

        expect(renders).toBe(initialRenders);
        expect(result.current).toBe(initialSelection);
    });
});
