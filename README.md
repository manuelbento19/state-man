# @bentoo/state-man

It is a lightweight package for state management in React applications, designed as a simplified alternative to Zustand and the Context API. It offers an intuitive approach to managing global and local states, allowing you to keep your application organized and easy to maintain.

With an easy-to-use API, `@bentoo/state-man` is ideal for developers looking for an efficient solution for state management.

[![Version](https://img.shields.io/npm/v/@bentoo/state-man?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@bentoo/state-man)
[![Downloads](https://img.shields.io/npm/dt/@bentoo/state-man.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@bentoo/state-man)

## Installation

You can install the package via NPM:

```bash
npm install @bentoo/state-man
```

or via Yarn:

```bash
yarn add @bentoo/state-man
```

or via pnpm:

```bash
pnpm add @bentoo/state-man
```

## Usage

Here’s a basic example of how to use `@bentoo/state-man` in your project:

### 1. create a store

```tsx
// ./stores/counter.ts
import { create } from "@bentoo/state-man";

export const useStore = create(0);
```

### 2. use your store anywhere

```tsx
// counter.tsx
export const Counter = () => {
    const { state, setState } = useStore();

    const increment = () => setState(state + 1);

    return <button onClick={increment}>Count is {state}</button>;
};
```

```tsx
// App.tsx
import Counter from "./counter";
import { useStore } from "./stores/counter";

function App() {
    const { state } = useStore();

    return (
        <div className="card">
            <h1>Now the counter is: {state}</h1>
            <Counter />
        </div>
    );
}
export default App;
```

### 3. Using Selectors (Performance Optimization)

Selectors allow you to subscribe to specific parts of your state, preventing unnecessary re-renders when other parts of the state change.

```tsx
// ./stores/app.ts
import { create } from "@bentoo/state-man";

export const useAppStore = create({
    user: { name: "John", age: 30 },
    cart: { items: [], total: 0 },
    theme: "dark"
});
```

```tsx
// UserProfile.tsx - Only re-renders when user changes
export const UserProfile = () => {
    const user = useAppStore(state => state.user);
    
    return <div>{user.name} - {user.age} years old</div>;
};

// CartTotal.tsx - Only re-renders when cart.total changes  
export const CartTotal = () => {
    const total = useAppStore(state => state.cart.total);
    
    return <div>Total: ${total}</div>;
};

// ThemeButton.tsx - Access to setState for updates
export const ThemeButton = () => {
    const theme = useAppStore(state => state.theme);
    const { setState } = useAppStore();
    
    const toggleTheme = () => {
        setState(prev => ({
            ...prev!,
            theme: prev!.theme === "dark" ? "light" : "dark"
        }));
    };
    
    return (
        <button onClick={toggleTheme}>
            Current theme: {theme}
        </button>
    );
};
```

#### Advanced Selectors

```tsx
// Computed values
const itemCount = useAppStore(state => state.cart.items.length);

// Complex calculations  
const discountedTotal = useAppStore(state => {
    const subtotal = state.cart.items.reduce((sum, item) => sum + item.price, 0);
    return subtotal * 0.9; // 10% discount
});
```

### Imperative API

`create` returns a hook with additional methods for use outside React:

```tsx
import { create } from "@bentoo/state-man";

const useStore = create(0);

useStore.getState(); // 0

const unsubscribe = useStore.subscribe(() => {
    console.log("state changed");
});

useStore.setState(1);
useStore.setState((previous) => previous + 1); // 2

unsubscribe();
useStore.destroy(); // removes listeners and observers
```

- `useStore()` returns `{ state, setState }`.
- `useStore(selector)` returns the selected value.
- `getState()` reads the current state.
- `setState(value | updater)` updates the state.
- `subscribe(listener)` returns an unsubscribe function.
- `destroy()` is idempotent, removes storage listeners and clears observers. It does not clear persisted storage.

For persisted stores, `setState` writes to storage before updating memory. If the storage write fails, the state is not updated.

### Persisting Store Data

You can persist a store's data across sessions by saving it to a storage medium such as `localStorage`, `sessionStorage`, or other available storage options. This ensures that the data is retained even when the page is reloaded or the browser is closed and reopened.

Additionally, it is possible to synchronize the store's state across different tabs or windows. When a change is made in one tab or window, all other tabs or windows that share the same storage context. This allows you to update the state seamlessly across multiple views.

```jsx
import { create, persist } from "@bentoo/state-man";

const useUserStore = create(
    persist({
        name: "userStoreKey",
        data: { name: "Bentoooo" },
        storage: sessionStorage,
    }),
);
```

This approach ensures both persistence and synchronization, enabling a consistent experience for users working across multiple tabs or windows.


#### `persist` Properties

| Property  | Type      | Description                                                                                                                 |
| --------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| `name`    | `string`  | Unique name of the store, used as a key to store and retrieve data from storage.                                            |
| `data`    | `any`     | Initial state value of the store. Can be any data type (number, string, object, array, etc.).                               |
| `storage` | `Storage` | Type of storage used for persistence. By default, it uses `localStorage`. It can be: `localStorage`, `sessionStorage`, etc. |

### SSR and Hydration

On the server, browser storage is not available. SSR always renders the `data` passed to `persist`:

```tsx
const useUserStore = create(
    persist({
        name: "userStoreKey",
        data: { name: "Guest" },
    }),
);
```

After the client hydrates, the persisted value is applied. Keep `data` deterministic between server and client to avoid hydration mismatches.

Custom `storage` adapters are ignored on the server; persistence is client-side only. If the server already knows the persisted state (for example, from a cookie or database), pass that value as `data` so it is rendered during SSR.

## Features

✨ **Lightweight** - ~1.8KB gzipped  
🚀 **Performance** - Optimized selectors prevent unnecessary re-renders  
🔄 **Persistence** - Built-in localStorage/sessionStorage support  
🔀 **Cross-tab sync** - Automatic state synchronization across tabs  
📱 **React 18+** - Uses `useSyncExternalStore` (React 18+ required)  
🎯 **TypeScript** - Full type safety and IntelliSense support  
⚡ **Zero runtime dependencies** - React is the only peer dependency  
🔧 **Simple API** - Minimal learning curve  

## Why @bentoo/state-man?

### vs Context API
- ✅ **Selective subscriptions** - Only re-render components that use changed data
- ✅ **No providers** - Use anywhere without wrapping components
- ✅ **Better performance** - Automatic optimization with selectors
- ✅ **Simpler setup** - No context providers or complex setup

### vs Zustand  
- ✅ **Smaller bundle** - ~1.8KB vs ~2.7KB
- ✅ **Auto-memoization** - Built-in intelligent caching
- ✅ **Familiar API** - Minimal learning curve

### vs Redux Toolkit
- ✅ **Much smaller** - ~1.8KB vs ~11KB+ 
- ✅ **No boilerplate** - Direct state updates
- ✅ **Simpler learning curve** - Intuitive API
- ✅ **Built-in persistence** - No additional libraries needed

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines. Release history is documented in [CHANGELOG.md](CHANGELOG.md).

1. Fork the project.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -m 'Adding new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
