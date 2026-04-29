# Changelog

## [1.1.0](https://github.com/provably-fair-betting/verifierform-lib/compare/verifierform-lib-v1.0.0...verifierform-lib-v1.1.0) (2026-04-29)


### Features

* initial project setup ([0490fe2](https://github.com/provably-fair-betting/verifierform-lib/commit/0490fe2e60a12332ec4cbd9e43e20d4ec4a75c6a))

## [1.0.0] - 2026-04-29

### Features

- `VerifierForm` component with dynamic game registry supporting pluggable form controls, Zod validation, and result/explanation components
- Lazy loading per game via Vite code splitting — each game's components only load on first selection
- Two-way URL query parameter binding for shareable verification links
- `FieldInput` — floating-label field supporting text, number, and select input types
- `StaticField` — read-only display field
- `Input` — control dispatcher routing to hidden, static, or field inputs based on control type
- `use-game-loader` composable for lazy-loading and caching game definitions
- `effect-with-previous` utility rune for running effects with access to the previous value
- `control-utils` — pure utilities for URL sync, Zod validation, and control defaults
- Demo playground with five sample game implementations: dice (with step-by-step explanation), plinko, wheel, crash, and slide
- `ByteGenerator` and `FloatGenerator` RNG primitives for provably fair algorithms

### Infrastructure

- Vitest unit and component tests with `@testing-library/svelte` (jsdom + node projects)
- Playwright e2e tests against the built preview server
- GitHub Actions CI with coverage reporting and auto-committed badge SVGs
- Release Please workflow for automated changelog and GitHub Releases
- `svelte-package` dist generation with `publint` export validation
