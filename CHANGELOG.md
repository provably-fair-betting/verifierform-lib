# Changelog

## [1.0.1](https://github.com/provably-fair-betting/verifierform-lib/compare/v1.0.0...v1.0.1) (2026-05-16)


### Documentation

* improve installation guide and add version badge ([a35cdf8](https://github.com/provably-fair-betting/verifierform-lib/commit/a35cdf823110fc7431d8c2e684656d485b8ed6e0))


### Chores

* add changelog-sections to release-please config ([cf93944](https://github.com/provably-fair-betting/verifierform-lib/commit/cf93944e53a39cbeaac5c377143936df31752d36))
* add changelog-sections to release-please config ([2023465](https://github.com/provably-fair-betting/verifierform-lib/commit/2023465a56868d34413b1a90b94021966c8f1587))
* exclude component from release-please tag format ([b78ee74](https://github.com/provably-fair-betting/verifierform-lib/commit/b78ee7482b8f097811b7b27270fbf23ffdced301))
* update badges [skip ci] ([fad998e](https://github.com/provably-fair-betting/verifierform-lib/commit/fad998eb5afc49a73d323325c7e071e7ce36cc93))

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
