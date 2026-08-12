# Implementation Plan: Digital Display Promotional Application

**Branch**: `001-digital-display-app` | **Date**: 2026-08-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-digital-display-app/spec.md`

## Summary

A lightweight, offline-capable Progressive Web Application (PWA) that displays
a promotional QR code experience on public digital screens. Shoppers scan a QR
code and are directed to Shopper Portal to request a tax refund. A PIN-gated
settings screen allows administrators to configure which languages are displayed
and at what rotation interval. All content (translations, imagery, messaging)
is Planet-managed and bundled at build time. Configuration is local to each
deployment, stored in `localStorage`. No backend service is required.

**Architecture in one sentence**: Static SPA (React + TypeScript + Vite) with
Workbox PWA offline caching and `localStorage` configuration. The shopper-facing
display renders a Planet-provided hero image containing a managed QR code.

## Technical Context

**Language/Version**: TypeScript 5.x, targeting ES2020+

**Primary Dependencies**:
- React 18 — UI framework
- Vite 5 — build tool and dev server
- vite-plugin-pwa (Workbox) — Service Worker and precache generation
- react-i18next — internationalisation with bundled locale JSON files
- React Router 6 — client-side routing (`/` and `/settings`)
- Vitest — unit and component tests
- Playwright — E2E tests including offline and responsive scenarios

**Storage**: `localStorage` (key: `ndsk:config`) — local per-device only. No
remote storage. No synchronisation.

**Testing**: Vitest (unit/component) + Playwright (E2E critical flows)

**Target Platform**: Modern browsers — Chrome 90+, Safari 15+, Edge 90+.
Devices: tablet (~768px), kiosk (~1024px), full HD TV (1920×1080), 4K
display (3840×2160). Portrait and landscape orientations.

**Project Type**: Static Single Page Application — no backend, no server

**Performance Goals**:
- Initial load < 3 seconds on 4G
- 60fps language transition animations
- Full offline operation after first load (all assets precached)

**Constraints**:
- No backend infrastructure
- All assets precached by Service Worker at install time
- PIN validated client-side against SHA-256 hash (env var `VITE_PIN_HASH`)
- Hero image is a Planet-provided static asset in `public/assets/`
- One deployment per physical display; no cross-device config sync

**Scale/Scope**: One SPA deployment per display location. Supports up to ~15
locales in the initial catalogue. No concurrent user sessions; one device, one
configuration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Conversion First | ✅ PASS | The entire application drives one journey: shopper sees QR → scans → Shopper Portal. No extraneous features. |
| II. Public Screen First | ✅ PASS | Display view is full-screen, requires zero shopper interaction, and communicates purpose immediately. |
| III. Device Agnostic | ✅ PASS | CSS responsive design; portrait and landscape layout variants; validated at tablet, kiosk, and TV viewports. |
| IV. Configuration Over Development | ✅ PASS | Languages and rotation interval configurable via settings UI. PIN hash set via env var at deploy time. Hero image is a Planet-managed static asset updated via application deployment. No code change needed per-location. |
| V. Offline Resilience | ✅ PASS | Workbox precaches all assets and locale files at install time. `localStorage` config survives network loss. Language rotation timer is client-side only. |
| VI. Accessibility | ✅ PASS | WCAG 2.2 AA required; enforced in tasks (semantic HTML, ARIA labels, colour contrast, keyboard navigation). |
| VII. Analytics First | ✅ PASS | Attribution and scan reporting are managed externally by Planet's marketing team QR service. Shopper Portal's existing Heap integration measures the full conversion journey. No analytics SDK or QR URL management required within this application. |
| VIII. Performance | ✅ PASS | Static SPA with no runtime network calls after initial load; assets precached; no backend latency. |
| IX. Simplicity | ✅ PASS | No backend, no accounts, no database, no CMS. Minimal dependency set. Admin capability limited to language selection and rotation interval. |
| X. Maintainability | ✅ PASS | TypeScript throughout; one component per concern; custom hooks for config and rotation; modular i18n catalogue. |
| XI. Brand Consistency | ⚠️ V1 SCOPE | Partner branding removed from v1 by deliberate product decision (see spec). Planet brand integrity maintained throughout by Planet-controlled bundled assets. Architecture does not prevent future addition of partner branding. |

**Constitution Check: PASS** ✅
*(Principle XI: v1 scope reduction is a documented product decision, not a
technical violation. No gate error raised.)*

## Project Structure

### Documentation (this feature)

```text
specs/001-digital-display-app/
├── plan.md              # This file
├── research.md          # Phase 0: 10 architectural decisions with rationale
├── data-model.md        # Phase 1: configuration schema, locale catalogue, state machines
├── quickstart.md        # Phase 1: 6 validation scenarios
├── contracts/
│   └── routing.md       # Application routes and Service Worker contract
└── tasks.md             # Phase 2 (generated by /speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── display/
│   │   ├── DisplayView.tsx           # Full-screen shopper display root
│   │   ├── HeroImage.tsx             # Planet-provided hero image (static asset, language-invariant)
│   │   └── LanguageSlide.tsx         # Localised headline and supporting text (hero image excluded)
│   ├── settings/
│   │   ├── SettingsView.tsx          # Settings area layout
│   │   ├── PinGate.tsx               # 5-tap gesture detection and 4-digit PIN entry
│   │   ├── LanguageSelector.tsx      # Catalogue toggle list
│   │   └── RotationIntervalPicker.tsx
│   └── shared/
│       └── ErrorBoundary.tsx         # Catches render errors; shows fallback UI
├── config/
│   ├── defaults.ts                   # Default DisplayConfiguration constants
│   ├── languages.ts                  # Supported locale catalogue
│   └── env.ts                        # Typed VITE_* env var accessors
├── hooks/
│   ├── useConfiguration.ts           # localStorage read/write for DisplayConfiguration
│   └── useLanguageRotation.ts        # Interval timer; returns active locale
├── i18n/
│   ├── index.ts                      # i18next initialisation
│   └── locales/
│       ├── en.json
│       ├── zh-CN.json
│       ├── ar.json                   # RTL — requires layout mirroring
│       ├── fr.json
│       ├── es.json
│       └── pt.json
├── pages/
│   ├── DisplayPage.tsx               # Route: /
│   └── SettingsPage.tsx              # Route: /settings
└── App.tsx                           # Router and global providers

public/
└── assets/                           # Planet-provided imagery and icons

tests/
├── unit/                             # Vitest component and hook tests
└── e2e/                              # Playwright scenarios (offline, responsive, PIN)
```

**Structure Decision**: Single SPA at repository root. No backend. Static output
from `vite build` served by any static host. Two client-side routes: `/`
(display, public) and `/settings` (admin, PIN-gated). All content bundled at
build time.

## Complexity Tracking

No constitution violations requiring justification. No complexity introduced
beyond what is directly required by the specification.
