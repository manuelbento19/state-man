# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Imperative store API: `getState`, `setState`, `subscribe` and `destroy`.
- SSR and hydration support for persisted stores.
- Cross-tab synchronization cleanup and listener deduplication.
- Vitest coverage configuration and GitHub Actions CI.

### Changed

- React 18+ is now the supported peer dependency.
- Persisted stores ignore custom storage on the server and render their initial data during SSR.
- README now documents the complete API, persistence behavior and SSR.

### Fixed

- Storage read and write failures no longer corrupt in-memory state.
- Invalid stored JSON falls back to the initial data.
- Circular values and quota errors do not desynchronize memory and storage.
- Duplicate storage listeners are avoided.
