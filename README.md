# 🧪 Provably Fair VerifierForm Core

[![CI](https://github.com/provably-fair-betting/verifierform-core/actions/workflows/ci.yml/badge.svg)](https://github.com/provably-fair-betting/verifierform-core/actions/workflows/ci.yml) [![Version](https://img.shields.io/github/v/release/provably-fair-betting/verifierform-core)](https://github.com/provably-fair-betting/verifierform-core/releases/latest) [![Coverage](https://codecov.io/gh/provably-fair-betting/verifierform-core/graph/badge.svg)](https://codecov.io/gh/provably-fair-betting/verifierform-core)

A SvelteKit 2/Svelte 5 library that provides a reusable `VerifierForm` component for **quickly building provably fair verifiers** for crypto casino games.

Supports dynamic game configurations, reactive form inputs (with Zod validation), result/explanation rendering, URL query parameter binding for shareable links, and lazy loading — each game's components and assets only load when the game is first selected.

---

## ✨ Features

- 🎮 Dynamic game registry with pluggable form controls, Zod schema, and result/explanation components
- 🚀 Lazy loading — each game is a separate Vite chunk loaded on first selection
- 🔄 Two-way binding with URL query parameters for shareable verification links
- 🧠 Smart reactivity using Svelte 5 runes API
- ⚡ Debounced URL updates to prevent excessive navigation
- 🧪 Testing-friendly with `Vitest` and `@testing-library/svelte`
- 🧩 Designed for reuse in SvelteKit subprojects

---

## 🗂 Project Structure

```text
src/
├── lib/                                  # Public library (exported via dist/)
│   └── verifier/
│       ├── VerifierForm.svelte           # Core reactive form + lazy loading orchestration
│       ├── Input.svelte                  # Control dispatcher (hidden / static / field)
│       ├── FieldInput.svelte             # Floating-label field (text / number / select)
│       ├── StaticField.svelte            # Read-only display field
│       ├── use-game-loader.svelte.ts     # Composable: lazy load + cache game definitions
│       ├── effect-with-previous.svelte.ts# Utility: run effect with previous value
│       ├── control-utils.ts              # Pure utilities: URL sync, validation, defaults
│       └── types.ts                      # GameEntry, GameDefinition, Control types
│
├── demo/                                 # Dev playground (not exported)
│   ├── layout/                           # Pure UI primitives
│   │   ├── ContentBlock.svelte
│   │   ├── HighlightText.svelte
│   │   └── HighlightLink.svelte
│   ├── generator/                        # Provably fair RNG (ByteGenerator, FloatGenerator)
│   ├── games/                            # Sample game definitions (feature-colocated)
│   │   ├── dice/                         # Full result + step-by-step explanation
│   │   ├── plinko/, wheel/               # Result only
│   │   └── crash/, slide/               # Stub (no-op result)
│   ├── control-setup.ts                  # Shared seed/nonce controls reused across games
│   └── debounce.svelte.ts               # Debounce composable used by demo games
│
└── routes/
    └── +page.svelte                      # Mounts VerifierForm with the demo game registry

tests/
├── lib/verifier/                         # Unit tests for the public library
│   ├── VerifierForm.svelte.test.ts
│   ├── Input.svelte.test.ts
│   └── control-utils.test.ts
└── demo/generator/                       # Unit tests for the RNG primitives
    ├── byte-generator.test.ts
    └── float-generator.test.ts
```

---

## 🚀 Running the Demo

The library ships with a SvelteKit dev playground that shows several games wired up to `VerifierForm`. It's the quickest way to see the component in action and develop against it.

```bash
cd verifierform-core
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). The game selector at the top lets you switch between Dice, Plinko, Wheel, Crash, and Slide.

The Dice game is the most complete demo — it shows a full result component and a step-by-step cryptographic explanation of how the roll number is derived from the seeds. All other games render a placeholder result while their full logic lives in the main app.

> The demo games are in `src/demo/`. They import from `$lib` (the library source) directly, so any lib change is immediately reflected without rebuilding.

---

## 📦 Using the Library

### Installing

Install directly from GitHub, pinned to a release tag:

```bash
pnpm add github:provably-fair-betting/verifierform-core#v1.0.0
```

This fetches the pre-built `dist/` included in the tag — no local clone or build step required. pnpm caches the result so subsequent installs are instant. The dependency is recorded in `package.json` as:

```json
"verifierform-core": "github:provably-fair-betting/verifierform-core#v1.0.0"
```

Other contributors only need `pnpm install` as normal.

### Upgrading

```bash
pnpm add github:provably-fair-betting/verifierform-core#v1.1.0
```

Check [CHANGELOG.md](https://github.com/provably-fair-betting/verifierform-core/blob/main/CHANGELOG.md) for what changed between versions.

### Importing

```ts
import { VerifierForm } from 'verifierform-core';
import type { GameEntry, GameDefinition, Control } from 'verifierform-core';
```

---

## 🎮 Define a Game

Each game is described by a `GameDefinition` and registered via a `GameEntry` that lazily loads it. This means each game's components, composables, and assets are bundled into a separate Vite chunk that only loads when the user selects that game.

### `GameDefinition`

```ts
import { z } from 'zod';
import type { GameDefinition } from 'verifierform-core';
import DiceResult from './DiceResult.svelte';
import DiceExplanation from './DiceExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Dice',
  controls: [
    { id: 'clientseed', label: 'Client Seed', type: 'text', required: true },
    { id: 'serverseed', label: 'Server Seed', type: 'text', required: true },
    { id: 'nonce', label: 'Nonce', type: 'number', required: true, default: 0, min: 0 },
  ],
  schema: z.object({
    clientseed: z.string(),
    serverseed: z.string(),
    nonce: z.number().nonnegative(),
  }),
  result: DiceResult,
  explanation: DiceExplanation, // optional
};
```

### `GameEntry` (lazy registry)

Wrap each definition in a `GameEntry` so `VerifierForm` can load it on demand:

```ts
import type { GameEntry } from 'verifierform-core';

const games: Record<string, GameEntry> = {
  dice: {
    name: 'Dice',
    loader: () => import('./dice').then((m) => m.gameDefinition),
  },
  plinko: {
    name: 'Plinko',
    loader: () => import('./plinko').then((m) => m.gameDefinition),
  },
};
```

Pass the registry to `VerifierForm`:

```svelte
<VerifierForm {games} />
```

The `name` on each entry is used to populate the game selector dropdown — it is available immediately without loading the full definition.

---

## 🕹 Control Types

Controls are a discriminated union on `type`. `id` and `label` are the only fields common to all visible types.

### `text`

```ts
{ id: 'clientseed', label: 'Client Seed', type: 'text', required: true }
```

| Field       | Type                      | Default | Description                        |
| ----------- | ------------------------- | ------- | ---------------------------------- |
| `required`  | `boolean`                 | `false` | Marks the field mandatory          |
| `syncToUrl` | `boolean`                 | `true`  | Includes value in URL query params |
| `default`   | `string`                  | —       | Pre-filled value on game selection |
| `hide`      | `(formValues) => boolean` | —       | Conditionally hides the control    |

### `number`

```ts
{ id: 'nonce', label: 'Nonce', type: 'number', required: true, default: 0, min: 0 }
```

Same as `text` plus:

| Field  | Type     | Description                    |
| ------ | -------- | ------------------------------ |
| `min`  | `number` | Sets the HTML `min` attribute  |
| `max`  | `number` | Sets the HTML `max` attribute  |
| `step` | `number` | Sets the HTML `step` attribute |

### `select`

```ts
{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard'] }
```

| Field       | Type                      | Description           |
| ----------- | ------------------------- | --------------------- |
| `options`   | `string[]`                | The selectable values |
| `required`  | `boolean`                 | `false` by default    |
| `syncToUrl` | `boolean`                 | `true` by default     |
| `hide`      | `(formValues) => boolean` | Conditionally hides   |

### `hidden`

A URL-synced state bucket — never rendered, lives only in `formValues` and URL params. Useful for persisting state set by result components back into the shareable URL.

```ts
{ id: 'selectedbars', type: 'hidden' }
```

| Field       | Type      | Default | Description                      |
| ----------- | --------- | ------- | -------------------------------- |
| `syncToUrl` | `boolean` | `true`  | Whether to include in URL params |

### `static`

A read-only display field with a fixed value. Rendered as a disabled input but not included in form state or URL params. Useful for showing a constant seed value alongside the form (e.g. crash's block hash).

```ts
{ id: 'blockhash', label: 'Block Hash', type: 'static', value: '0000000000...' }
```

---

## 🧪 Testing

```bash
# Run unit tests once (no UI)
pnpm vitest run

# Run unit tests in watch mode with browser UI
pnpm test:unit

# Run e2e tests (requires the dev server to be running separately)
pnpm test:e2e

# Run everything
pnpm test
```

Mocks `$app/state` and `$app/navigation` for stable test runs. Game definitions are passed as `GameEntry` objects with `loader: () => Promise.resolve(def)` to test the async loading path without actual dynamic imports.

---

## 📊 Coverage

```bash
pnpm vitest run --coverage
```

Opens `coverage/index.html` for the full report. The library targets 100% line/function coverage and ≥95% branch coverage. The only unreachable branches are null-guard stubs emitted by the Svelte 5 compiler for optional props — these are not reachable through normal component usage.

---

## 🔍 Type Checking

```bash
pnpm check
```

Runs `svelte-check` against the full `tsconfig.json`. This covers both the library source and the demo playground.

---

## 🏗 Building the Library

```bash
pnpm build
```

Outputs to `dist/`. The entry point is `dist/index.js` with type declarations at `dist/index.d.ts`. Run `publint` automatically as part of the build to verify the package exports are correctly declared.

---

## 🔧 Built With

- [Svelte 5](https://svelte.dev)
- [SvelteKit 2](https://kit.svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev)
- [Vitest](https://vitest.dev)
- [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro)
