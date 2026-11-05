import { cleanup, renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { create } from "@/utils/store";

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
