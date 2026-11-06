# Contributing

Thanks for your interest in improving `@bentoo/state-man`.

## Requirements

- Node.js 18 or newer
- pnpm 9

## Setup

```bash
pnpm install
```

## Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `pnpm typecheck`        | Run TypeScript without emitting files.   |
| `pnpm lint`             | Run ESLint.                              |
| `pnpm test`             | Run tests in watch mode.                 |
| `pnpm test -- --run`    | Run tests once.                          |
| `pnpm coverage`         | Run tests with coverage thresholds.      |
| `pnpm build`            | Typecheck and build ESM/CJS bundles.     |

Before opening a pull request, run:

```bash
pnpm typecheck && pnpm lint && pnpm coverage && pnpm build
```

## Project structure

- `src/core` — framework-agnostic store, persistence, synchronization and validation.
- `src/react` — React bindings built on `useSyncExternalStore`.
- `src/__tests__` — Vitest tests.

Keep `src/core` free of React imports.

## Commit messages

Use conventional commits:

- `feat:` new behavior
- `fix:` bug fix
- `refactor:` internal change without behavior change
- `test:` tests only
- `docs:` documentation only
- `chore:` tooling or maintenance
- `ci:` CI configuration
- `build:` build configuration

## Pull requests

1. Fork the repository and create a branch.
2. Add tests for bug fixes and new behavior.
3. Keep changes focused and update documentation when needed.
4. Make sure the full validation command passes.
5. Open the pull request with a clear description.

For security issues, please avoid opening a public issue with exploit details.
