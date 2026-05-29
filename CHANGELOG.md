# Changelog

## [2.0.0](https://github.com/provably-fair-betting/verifierform-core/compare/v1.1.0...v2.0.0) (2026-05-29)


### ⚠ BREAKING CHANGES

* published package is now installed as github:provably-fair-betting/verifierform-core and imported as 'verifierform-core'

### Features

* rename project to verifierform-core ([d162d43](https://github.com/provably-fair-betting/verifierform-core/commit/d162d4338b5af1dcc6bebd2112c14d0c732f34ab))

## [1.1.0](https://github.com/provably-fair-betting/verifierform-lib/compare/v1.0.1...v1.1.0) (2026-05-23)


### Features

* replace game select with image grid picker (GamePicker) ([0a823c8](https://github.com/provably-fair-betting/verifierform-lib/commit/0a823c873df7a49b85a3ef53c4bcc66c7f8096d0))


### Bug Fixes

* always show scrollbar in game picker popover ([c0d81eb](https://github.com/provably-fair-betting/verifierform-lib/commit/c0d81eb6a78ba6c363ccf83bd89dffc5ec5332b1))
* await page.goto and use aria-haspopup=dialog on game picker ([87cdce8](https://github.com/provably-fair-betting/verifierform-lib/commit/87cdce8b812938987b2ecf6220a3f29c57d82866))
* darken game block labels and add stronger popup border ([97f939c](https://github.com/provably-fair-betting/verifierform-lib/commit/97f939c2cf6dc52113cfd4a170badc3cfd6530ae))
* darken game label background in picker popup ([201f919](https://github.com/provably-fair-betting/verifierform-lib/commit/201f9190a40590ebf2bfa682f12cc79d059075ed))
* darken game picker popup background for visual separation ([61aeed8](https://github.com/provably-fair-betting/verifierform-lib/commit/61aeed8a65f4d07c3f932cc4471f1d6bc52d5d18))
* **GamePicker:** reserve scrollbar gutter so grid columns don't overlap ([5cc5a66](https://github.com/provably-fair-betting/verifierform-lib/commit/5cc5a66c1d7176ff5e71fb50bfd897d41c1546cb))
* **GamePicker:** separate scroll wrapper from grid to prevent scrollbar overlap ([41eb1b5](https://github.com/provably-fair-betting/verifierform-lib/commit/41eb1b51b234b10eabfa81272e97b33d1827de16))
* improve game picker accessibility ([60a8100](https://github.com/provably-fair-betting/verifierform-lib/commit/60a81008ef1f85e5a5efb96918320dc3899f9241))
* increase scroll wrapper padding to prevent scrollbar overlap ([e44fb14](https://github.com/provably-fair-betting/verifierform-lib/commit/e44fb1428f9cd28f4af882f57d743fe2ae3cc7b0))
* keep text-gray-700 on game tile hover ([4899c65](https://github.com/provably-fair-betting/verifierform-lib/commit/4899c650d6534ce1d0935dea1b513e521f005340))
* light purple hover and lighter gray unhovered on game tile labels ([2718cb6](https://github.com/provably-fair-betting/verifierform-lib/commit/2718cb68cd7830a3288a6133c9ff7fc2beaa122d))
* light purple hover border on game boxes in dark mode ([75132fb](https://github.com/provably-fair-betting/verifierform-lib/commit/75132fbd556e361edad68b2fb0137622590ceeec))
* lighten game picker popup to bg-gray-100 ([fe0a92f](https://github.com/provably-fair-betting/verifierform-lib/commit/fe0a92f2c0b6b94e37a0b08b771c8160666ca95d))
* lighter purple highlight for selected game box in dark mode ([7c6b3ba](https://github.com/provably-fair-betting/verifierform-lib/commit/7c6b3bafbcbe0b50ea8e1aa54168ce1bfb481960))
* lighter purple hover on game tile label in light mode ([6ee7919](https://github.com/provably-fair-betting/verifierform-lib/commit/6ee7919cb1f64be1d4632ebdbed131545f83054d))
* make scrollbar visible in dark mode ([fcaaca5](https://github.com/provably-fair-betting/verifierform-lib/commit/fcaaca579a2ecc94e6b5c11f8ccf9ea38a26a62c))
* remove aria-haspopup from game picker trigger ([203d2f5](https://github.com/provably-fair-betting/verifierform-lib/commit/203d2f565196e7ae91af8e720bcb49a4762eea33))
* remove hover border from game tiles ([1087d4e](https://github.com/provably-fair-betting/verifierform-lib/commit/1087d4e09bee844db2422cb8622be3e4eea5f587))
* replace listbox/option ARIA roles with button pattern ([831e4fc](https://github.com/provably-fair-betting/verifierform-lib/commit/831e4fc7b3eb04e30d5478db07023f3123e6a2ff))
* resolve all lint errors and add lint CI job ([dca9479](https://github.com/provably-fair-betting/verifierform-lib/commit/dca9479471919c6df45a6fe567a2f5307b137e99))
* stronger shadow and border on game picker popup ([0aba60e](https://github.com/provably-fair-betting/verifierform-lib/commit/0aba60e685273a22956597f698dda0f7df5a28f5))
* update e2e tests for GamePicker component ([dd17ac7](https://github.com/provably-fair-betting/verifierform-lib/commit/dd17ac79e25ae04a7077c60721670b870c938461))
* use gray-50 background for game picker popup ([6ba5d45](https://github.com/provably-fair-betting/verifierform-lib/commit/6ba5d45c39de7d77d4823772a353142a5703c80a))
* white text on purple-400 background for game tile hover ([86048f2](https://github.com/provably-fair-betting/verifierform-lib/commit/86048f2b922eb86a658f956e7e7c2da69bbb1c37))


### Code Refactoring

* **GamePicker:** compact trigger + popover replacing full grid ([b3de59d](https://github.com/provably-fair-betting/verifierform-lib/commit/b3de59d53c46e89f18f58d5c2b2fe476eabcd672))


### Chores

* exclude CHANGELOG.md from prettier lint ([47f7c35](https://github.com/provably-fair-betting/verifierform-lib/commit/47f7c3589a92e3c10532f3e50ac2e3ee450a5f5a))
* fix prettier formatting in GamePicker ([7e70955](https://github.com/provably-fair-betting/verifierform-lib/commit/7e70955f1d13f6a9b33d8c3aba6bf7241991dd51))

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
