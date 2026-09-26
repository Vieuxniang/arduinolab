# ArduinoLab

A mobile-first, gamified **electronics & Arduino learning app** that runs as a
[Pi Network](https://minepi.com/) mini-app. Learners work through visual
no-code simulations, earn XP and an in-app **LAB** currency, and unlock
higher-tier challenges — with optional AR/VR, voice, and "metaverse" modules on
top.

## Features

- **45 guided missions** across beginner / intermediate / expert tiers
- **No-code block editor** that generates Arduino-style code
- **Visual simulators**: LED, sensor, motor (PWM), LCD/OLED, and IoT dashboard
- **Gamification**: XP, levels (`LPI…`), LAB wallet, combo streaks, leaderboard,
  quick challenges, and time-attack mode
- **Community gallery** with tipping
- **Voice assistant** (LAB-AI) and Web Speech voice commands
- **Internationalization**: French, English, Spanish
- **Pi Network integration**: authentication, in-app purchases, per-user state
- Experimental **AR/VR and neuro** modules

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, shadcn/ui + Radix primitives |
| Icons / charts | lucide-react, Recharts |
| Tests | Vitest + React Testing Library (jsdom) |
| Platform SDK | Pi SDK + SDKLite (auth, purchases, ads, per-user state) |
| Package manager | pnpm 12 |
| CI | GitHub Actions |

## Getting started

Requires **Node.js 20+** and **pnpm 12**.

```bash
pnpm install     # installs deps and configures the pre-commit hook
pnpm dev         # start the dev server at http://localhost:3000
```

> The app authenticates against Pi Network on load. Outside the Pi CDN / App
> Studio wrapper, `SDKLite.login()` will not complete, so the app stays on the
> auth screen. Use the App Studio preview environment when testing end-to-end.

### Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Run the development server |
| `pnpm build` | Production build (runs ESLint + type checking) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run `tsc --noEmit` |
| `pnpm check` | Lint + typecheck (used by the pre-commit hook and CI) |
| `pnpm test` | Run the unit tests once (Vitest) |
| `pnpm test:watch` | Run the unit tests in watch mode |

## Project structure

```
app/                 Next.js routes & layout
contexts/            Pi authentication provider (Pi SDK + SDKLite)
components/
  ui/                shadcn/ui primitives
  lab/               Feature UI (views, sims, voice, metaverse, neuro)
  lab/views/         Per-simulator screens and mission runner
lib/
  lab/               Store, missions, i18n, code-gen, voice AI, particles
  lab/metaverse/     Economy, reputation, multiplayer, star map
  lab/neuro/         Biometrics, AR/VR detection, learning journal
  api.ts             fetch client
  pi-payment.ts      Purchase / ads / state hooks
.github/workflows/   CI (lint, typecheck, test, build)
.githooks/           Git hooks
tests/               Vitest unit tests (store, missions, game modes)
types/               Ambient declarations (e.g. WebXR)
```

## Pi Network integration

- **Config** lives in `lib/system-config.ts` (SDK URLs, sandbox flag) and
  `lib/product-config.ts` (product IDs).
- **Auth** is handled by `PiAuthProvider` in `contexts/pi-auth-context.tsx`,
  which loads the Pi SDK + SDKLite, logs in, fetches the product catalog, and
  restores purchases. It also probes for parent credentials via `postMessage`
  when running inside the App Studio iframe.
- **Persistence** uses SDKLite user state: progress is stored under the key
  `arduinolab.progress` (debounced), with a device UID in `localStorage` under
  `arduinolab.uid`.
- **Payments** use the SDKLite hooks in `lib/pi-payment.ts` — see
  `lib/PAYMENT_USAGE.md` for the full purchase / ads / state reference.

## Deployment

The app deploys as a standard Next.js app on [Vercel](https://vercel.com):

1. Import the repository in Vercel (pnpm is detected via `pnpm-lock.yaml`).
2. No environment variables are required — the Pi SDK URLs live in
   `lib/system-config.ts`.
3. Deploy. `vercel.json` pins installation to `pnpm install --frozen-lockfile`
   and `engines.node` in `package.json` selects the Node version; every deploy
   runs the full lint + typecheck + build.

Security headers are set in `next.config.mjs` (`nosniff`, referrer policy).
No frame-blocking headers are sent on purpose: the Pi App Studio wrapper
embeds the mini-app in an iframe.

> Reminder: outside the Pi CDN / App Studio wrapper the login cannot complete,
> so a deployed site shows the auth screen in a regular browser.

## Quality checks

`pnpm check` (lint + typecheck) runs:

- locally via the **pre-commit hook** (`.githooks/pre-commit`, activated by the
  `prepare` script setting `core.hooksPath=.githooks`), and
- in **CI** (`.github/workflows/ci.yml`) on every push and pull request, along
  with the unit tests (`pnpm test`) and a production build.

The test suite (Vitest + React Testing Library) covers the lab store
(rewards, spending, unlocks, persistence), the mission catalog and code
generation, and the game-mode reward formulas.
