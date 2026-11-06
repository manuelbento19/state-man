import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { persist } from "@/core/persist";
import validation from "@/core/validation";
import { create } from "@/react/create";

describe("SSR and hydration", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    test("should ignore custom storage on the server", () => {
        const storage = {
            getItem: vi.fn(() => JSON.stringify(42)),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0,
        } as unknown as Storage;
        vi.spyOn(validation, "isClientSide").mockReturnValue(false);

        const persisted = persist({
            data: 0,
            name: "ssr-server-storage",
            storage,
        });

        expect(storage.getItem).not.toHaveBeenCalled();
        expect(persisted.store.get()).toBe(0);
        expect(persisted.initialData).toBe(0);
    });

    test("should render initial data on the server for persisted stores", () => {
        localStorage.setItem("ssr-initial", JSON.stringify(42));
        const useStore = create(
            persist({ data: 0, name: "ssr-initial" }),
        );

        function Component() {
            const { state } = useStore();
            return createElement("span", null, state);
        }

        expect(renderToString(createElement(Component))).toBe("<span>0</span>");
        expect(useStore.getState()).toBe(42);
    });

    test("should apply selectors to the server snapshot", () => {
        localStorage.setItem(
            "ssr-selector",
            JSON.stringify({ count: 42 }),
        );
        const useStore = create(
            persist({ data: { count: 0 }, name: "ssr-selector" }),
        );

        function Component() {
            return createElement(
                "span",
                null,
                useStore((state) => state.count),
            );
        }

        expect(renderToString(createElement(Component))).toBe("<span>0</span>");
    });

    test("should hydrate server markup and then apply persisted state", async () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        localStorage.setItem("ssr-hydrate", JSON.stringify(42));
        const useStore = create(
            persist({ data: 0, name: "ssr-hydrate" }),
        );

        function Component() {
            const { state } = useStore();
            return createElement("span", null, state);
        }

        const container = document.createElement("div");
        container.innerHTML = renderToString(createElement(Component));

        let root: ReturnType<typeof hydrateRoot> | undefined;

        await act(async () => {
            root = hydrateRoot(container, createElement(Component));
        });

        await waitFor(() => {
            expect(container.textContent).toBe("42");
        });
        expect(consoleError).not.toHaveBeenCalled();

        await act(async () => {
            root?.unmount();
        });
    });
});
