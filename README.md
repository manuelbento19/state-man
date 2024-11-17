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
import { create } from '@bentoo/state-man'

export const useStore = create(0)

```
### 2. use your store anywhere
```tsx
// counter.tsx
export const Counter = () => {
  const {state,setState} = useStore()

  const increment = () => setState(state + 1);

  return (
    <button onClick={increment}>
      Count is {state}
    </button>
  );
}

// App.tsx
import Counter from './counter'
import { useStore } from './stores/counter'

function App() {
  const {state} = useStore()

  return (
    <div className="card">
      <h1>Now the counter is: {state}</h1>
      <Counter/>
    </div>
  )
}
co
export default App
```
### Persisting Store Data
You can persist your store's data across sessions by saving it to a storage medium such as localStorage, sessionStorage, or other available storage options. This ensures that the data is retained even when the page is reloaded or the browser is closed and reopened.

```jsx
import { create, persist } from '@bentoo/state-man'

const useUserStore = create(
  persist({
    name: 'userStoreKey',
    data: { name: 'Bentoooo' },
    storage: sessionStorage 
  })
)
```
#### `persist` Properties
| Property   | Type      | Description                                                                                             |
|------------|-----------|---------------------------------------------------------------------------------------------------------|
| `name`     | `string`  | Unique name of the store, used as a key to store and retrieve data from storage.                        |
| `data`     | `any`     | Initial state value of the store. Can be any data type (number, string, object, array, etc.).           |
| `storage`  | `Storage` | Type of storage used for persistence. By default, it uses `localStorage`. It can be: `localStorage`, `sessionStorage`, etc. |

## Why @bentoo/state-man over Context API?
- Only components that actually need to be updated are rendered
- Avoid unnecessary re-renders
- Offers a lighter configuration and less overhead, no context providers anymore

## Why @bentoo/state-man over Zustand?
- Offers a lighter configuration and less overhead
- Simple and un-opinionated

## Contribution

If you would like to contribute, feel free to open a pull request or report an issue.

1. Fork the project.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -m 'Adding new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.