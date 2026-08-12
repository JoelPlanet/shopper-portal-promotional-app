# Research: Digital Display Promotional Application

**Phase**: 0 — Architectural Research
**Date**: 2026-08-11
**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

All decisions below are informed by the feature specification, the project
constitution, and the explicit guidance to prioritise simplicity, offline
resilience and low operational overhead.

---

## Decision 1: Architecture — Static SPA, No Backend

**Decision**: Build a pure frontend Single Page Application (SPA). No backend
service, no API, no database.

**Rationale**:
- Planet-provided content (hero image, translations) is deployed as part of
  the application bundle — it does not need to be fetched dynamically.
- PIN validation is a UX guard (no sensitive data behind it) — it can be
  performed client-side against a hash without a backend.
- Static hosting is the lowest possible operational overhead: no servers to
  maintain, no backend deployments, no scaling concerns.

**Alternatives considered**:
- **Node/Express backend**: Rejected. Adds infrastructure overhead and
  deployment complexity with no corresponding benefit given the constraints.
- **Next.js (SSR/SSG)**: Rejected. SSR adds complexity and a Node runtime.
  SSG output is acceptable but the full framework is over-engineered for this
  use case. Vite produces a static build with less configuration overhead.
- **CMS-backed frontend**: Rejected. Planet owns all content and deploys it
  with the application. A CMS would add infrastructure and a content management
  layer that is explicitly out of scope.

---

## Decision 2: Framework — React 18 + TypeScript + Vite

**Decision**: React 18 with TypeScript, bundled by Vite.

**Rationale**:
- React is widely understood, has a mature ecosystem, and integrates well with
all required libraries (i18next, vite-plugin-pwa).
- TypeScript enforces correctness on the configuration schema and locale
  catalogue, reducing runtime errors in an unattended display.
- Vite provides fast development builds and first-class PWA support via
  `vite-plugin-pwa`, which eliminates the need for a custom Service Worker.

**Alternatives considered**:
- **Vue 3**: Equally valid technically. React chosen for broader team familiarity
  and ecosystem depth.
- **Plain HTML/CSS/JS**: Rejected. Acceptable for a static page but becomes
  unmaintainable for language rotation logic, settings state management, and
  component reuse across display/preview/settings views.
- **Svelte**: Strong offline and performance story but smaller ecosystem; rejected
  to reduce risk of dependency gaps.

---

## Decision 3: Offline Resilience — PWA with Workbox Precaching

**Decision**: Use `vite-plugin-pwa` (Workbox) in `generateSW` mode. Precache all
application assets and translation JSON files at build time.

**Rationale**:
- Workbox precaching installs all assets to the browser cache on first load,
  making them available immediately on subsequent loads regardless of
  connectivity.
- Translations are bundled JSON files (not fetched from an API), so they are
  included in the precache manifest automatically.
- The hero image (containing the QR code) is a static asset deployed in
  `public/assets/` and included in the precache manifest automatically.
- After first load, the entire shopper-facing experience operates independently
  of network state.

**Service Worker strategy**:
- Static assets (JS, CSS, images): `CacheFirst`
- Navigation (HTML shell): `NetworkFirst` with offline fallback to cached shell
- No runtime caching rules needed (no dynamic API calls)

**Alternatives considered**:
- **Manual Service Worker**: More control but significant maintenance burden.
  Rejected in favour of Workbox which handles cache versioning and cleanup
  automatically.
- **No offline support**: Rejected. FR-007/FR-008/FR-009 are non-negotiable;
  Constitution Principle V requires graceful offline operation.

---

## Decision 4: Internationalisation — react-i18next with Bundled JSON

**Decision**: Use `react-i18next` with translation files as static JSON assets
bundled at build time. No runtime fetching of translations.

**Rationale**:
- Bundling translations at build time ensures they are available offline
  immediately after the first load — no separate network request needed per
  locale.
- `react-i18next` is the standard React i18n solution: mature, well-documented,
  and supports RTL languages (Arabic) via `dir` attribute on the HTML element.
- Planet manages all translation content; it is updated by deploying a new build,
  which is consistent with the chosen static architecture.

**Planet-approved locale catalogue (v1)**:

| Code    | Language   | Script direction |
|---------|------------|------------------|
| `en`    | English    | LTR              |
| `zh-CN` | Chinese    | LTR              |
| `ar`    | Arabic     | RTL              |
| `fr`    | French     | LTR              |
| `es`    | Spanish    | LTR              |
| `pt`    | Portuguese | LTR              |

Adding a language in future requires adding a JSON file and an entry in the
catalogue — no other code changes.

**Alternatives considered**:
- **Runtime API fetch of translations**: Rejected. Breaks offline requirement.
- **Separate translation CDN**: Rejected. Adds network dependency and operational
  overhead.

---

## Decision 5: QR Code — Planet-Provided Hero Image (Static Asset)

**Decision**: The QR code is not generated by this application. Planet's
marketing team provides a UX-approved hero image that includes a Shopper Portal
screenshot with an embedded QR code. The application deploys this as a static
asset in `public/assets/` and renders it with a standard `<img>` element.
The hero image is **language-invariant** — a single image serves all configured
locales. Language rotation updates only the localised headline and supporting text.

**Rationale**:
- The QR code is managed by Planet's external link management service, which
  handles redirect management, campaign attribution and scan reporting
  independently of this application.
- Rendering a Planet-supplied image eliminates client-side QR generation,
  removes the `qrcode.react` dependency, and removes the `VITE_QR_URL`
  build-time variable. The display has no knowledge of the QR destination.
- A static image has zero network dependency at render time and is included in
  the Service Worker precache automatically.
- The visual presentation of the QR code is guaranteed to match Planet's
  UX standards because Planet controls the image directly.

**Alternatives considered**:
- **Client-side QR generation (qrcode.react)**: Previously planned. Rejected
  because the QR destination URL, campaign parameters and scan tracking are
  managed by Planet's marketing team outside this application. Generating the
  code client-side would duplicate that responsibility unnecessarily.

---

## Decision 6: Configuration Storage — localStorage

**Decision**: Store `DisplayConfiguration` (selected locales, rotation interval)
in `localStorage` keyed to the application origin. Default values are defined
as typed constants in source code.

**Rationale**:
- localStorage is universally available in the target browser environments and
  persists across page reloads and device restarts without a network request.
- It is scoped to the origin, meaning each deployed instance (different URL or
  subdomain) naturally maintains its own configuration in isolation.
- "Restore Defaults" is implemented as clearing the configuration keys and
  reverting to in-code defaults.

**Data persisted**:

```
localStorage key: "ndsk:config"
Value: JSON serialisation of DisplayConfiguration (see data-model.md)
```

**Alternatives considered**:
- **IndexedDB**: Overkill for a simple key-value configuration object.
- **Cookie**: Not appropriate for structured data at this size.
- **Remote config service**: Explicitly out of scope (no sync, no central management).

---

## Decision 7: PIN Validation — SHA-256 Hash in Environment Variable

**Decision**: The 4-digit PIN is validated client-side. The application stores
only the SHA-256 hash of the correct PIN, provided at build time via the
environment variable `VITE_PIN_HASH`. When an administrator enters a PIN, the
application hashes the input and compares it to `VITE_PIN_HASH`.

**Rationale**:
- The PIN protects language/rotation settings — not financial data or PII.
  Client-side validation is an appropriate security level for this UX guard.
- Storing a hash (not the raw PIN) means the PIN is not readable from the
  JavaScript bundle in plain text.
- Build-time environment variables are appropriate because PIN management is
  explicitly out of scope for v1 (changing the PIN requires a redeployment,
  which is acceptable per the spec).

**PIN reset**: Handled operationally. If a PIN is forgotten, the configuration
can be reset by clearing `localStorage` in the browser's developer tools or by
redeploying with a known PIN hash.

**Alternatives considered**:
- **Plain PIN in env var**: Rejected. The hash approach costs nothing and avoids
  leaking the raw PIN in the built JavaScript bundle.
- **PIN stored in localStorage**: Would allow the PIN to be changed at runtime,
  but PIN management is out of scope for v1. Adds complexity and a factory-reset
  risk if localStorage is cleared.
- **Backend PIN validation**: Rejected. Adds infrastructure for a capability
  that does not require server-side enforcement given the data it protects.

---

## Decision 8: Analytics — No Client-Side SDK Required

**Decision**: This application does not integrate with any analytics SDK.
Attribution and scan reporting are managed externally by Planet's marketing
team QR service and Shopper Portal's existing Heap workspace.

**Rationale**:
- The QR code is managed by Planet's external link service (redirect management,
  scan reporting, campaign tracking). Shopper Portal's Heap workspace measures
  conversion from arrival onwards. Neither capability requires any code in this
  application.
- Removing the SDK eliminates a third-party script dependency, reduces bundle
  size, and removes a potential failure point (network unavailability affecting
  SDK loading).
- The display cannot detect QR scans; attribution via the managed QR service
  is the correct and only available mechanism.

**Alternative considered**: Integrating Heap's client-side snippet to fire
`display_loaded` and similar events. Rejected — attribution is managed entirely
externally by Planet's marketing team QR service, and conversion analytics are
in Shopper Portal.

---

## Decision 9: Testing — Vitest (Unit) + Playwright (E2E)

**Decision**: Unit and component tests with Vitest (native Vite integration);
critical user journey E2E tests with Playwright.

**Rationale**:
- Vitest runs in the same Vite pipeline as the application — no separate
  configuration needed, fast feedback loop.
- Playwright is cross-browser, supports simulating offline mode (via
  `context.setOffline(true)`), and can validate responsive layouts at different
  viewport sizes.

**Critical E2E scenarios**:
1. Display loads and QR code is visible at tablet and TV viewports (portrait and
   landscape).
2. Language rotation cycles through all configured locales.
3. Connectivity lost after load → display continues, QR visible (offline mode).
4. PIN gate: incorrect PIN rejected; correct PIN grants settings access.
5. Configure languages + interval → save → display reflects changes.
6. Restore defaults → display reverts to default configuration.

---

## Decision 10: Hosting — Static Files Only

**Decision**: The application is deployed as a static bundle (`dist/`). It can
be served from any static hosting platform (Azure Static Web Apps, AWS S3 +
CloudFront, Vercel, Netlify, or any web server serving files).

**Environment variables set at build/deployment time**:

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_PIN_HASH` | SHA-256 hash of the configured 4-digit PIN | (output of `echo -n "1234" \| sha256sum`) |

No other infrastructure is required.

**Alternatives considered**:
- **Containerised app (Docker)**: Adds operational complexity with no benefit
  for a static site.
- **Server-rendered deployment**: Rejected. No SSR is needed; static hosting
  is simpler and cheaper.
