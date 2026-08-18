---
description: "Task list for Digital Display Promotional Application"
---

# Tasks: Digital Display Promotional Application

**Input**: Design documents from `specs/001-digital-display-app/`
**Branch**: `001-digital-display-app`
**Generated**: 2026-08-11

**Prerequisites used**: plan.md, spec.md, data-model.md, contracts/routing.md, research.md

**Tests**: Not explicitly requested — validation against quickstart.md scenarios covers
independent testability for each user story.

---

## Format

- **[P]**: Parallelizable — different files, no dependency on an incomplete sibling task
- **[USn]**: User story label (US1–US4) — required for all user story phase tasks
- Each task includes an exact file path

---

## Phase 1: Setup

**Purpose**: Initialize the Vite + React + TypeScript project and install all dependencies.

- [X] T001 Run `npm create vite@latest . -- --template react-ts` at repository root to scaffold the project; delete generated placeholder files (`src/App.css`, `src/assets/react.svg`, `index.css` boilerplate)
- [X] T002 [P] Install runtime dependencies: `npm install react-router-dom@6 react-i18next i18next`
- [X] T003 [P] Install PWA dependency: `npm install -D vite-plugin-pwa workbox-window`
- [X] T004 [P] Install test dependencies: `npm install -D vitest @testing-library/react @testing-library/user-event jsdom @playwright/test`
- [X] T005 [P] Configure `tsconfig.json` — enable `strict: true`; add path alias `"@/*": ["src/*"]`; set `target: "ES2020"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that all user stories depend on. No user story work begins
until this phase is complete.

**⚠️ CRITICAL**: Phases 3–7 require this phase to be complete.

- [X] T006 Create `src/config/env.ts` — export `ENV` object reading `import.meta.env.VITE_PIN_HASH` with a TypeScript type guard; throw a descriptive error if `VITE_PIN_HASH` is absent at runtime (guards misconfigured deployments)
- [X] T007 [P] Create `src/config/defaults.ts` — export `DEFAULT_CONFIGURATION: DisplayConfiguration` with all supported locales and a 15-second rotation interval
- [X] T008 [P] Create `src/config/languages.ts` — export `LANGUAGE_CATALOGUE: LanguageCatalogueEntry[]` with the 6 Planet-approved locales (`en`, `zh-CN`, `ar`, `fr`, `es`, `pt`) including `code`, `label`, and `direction` fields; export `LocaleCode` union type (`'en' | 'zh-CN' | 'ar' | 'fr' | 'es' | 'pt'`); export `DisplayConfiguration` interface (`selectedLocales: LocaleCode[]`, `rotationIntervalSeconds: number`) — this is the canonical type definition file
- [X] T009 [P] Create `src/i18n/locales/en.json` with all required `LanguageContent` keys: `headline`, `subheading`, `qrCallToAction`, `shopperPortalName`, `heroImageAltText`, and all `settings.*` keys (`title`, `pinPrompt`, `pinError`, `languagesLabel`, `intervalLabel`, `intervalUnit`, `saveButton`, `restoreDefaultsButton`, `restoreDefaultsConfirm`); populate with Planet-approved English copy supplied by Planet — do not use placeholder or machine-generated content
- [X] T010 [P] Create locale JSON files for the remaining 5 approved locales (`zh-CN`, `ar`, `fr`, `es`, `pt`) in `src/i18n/locales/` — same key shape as `en.json`; populate with Planet-approved copy for each locale; do not use machine-generated or placeholder translations — all copy is supplied by Planet
- [X] T011 Create `src/i18n/index.ts` — initialize i18next with `initReactI18next`; import and register all 6 Planet-approved locale JSON files as resources (`en`, `zh-CN`, `ar`, `fr`, `es`, `pt`); set `fallbackLng: 'en'`; set `interpolation.escapeValue: false`; export initialized `i18n` instance
- [X] T012 Create `src/hooks/useConfiguration.ts` — export `useConfiguration()` returning `{ config, save, restoreDefaults }`: `config` reads from `localStorage` key `ndsk:config` (JSON parse; fall back to `DEFAULT_CONFIGURATION` on missing or malformed value); `save(next: DisplayConfiguration)` validates (`selectedLocales` non-empty, `rotationIntervalSeconds >= 5`) then writes to `localStorage`; `restoreDefaults()` removes `ndsk:config` from `localStorage`; hook is synchronous (reads localStorage on each render via `useState` initializer)
- [X] T013 Create `src/App.tsx` — wrap application in `<BrowserRouter>`; define routes: `path="/"` → `<DisplayPage />`, `path="/settings"` → `<SettingsPage />`; import and apply i18n initialization from `src/i18n/index.ts`
- [X] T014 Update `vite.config.ts` — add path alias `@` → `src/`; configure `vite-plugin-pwa` with `registerType: 'autoUpdate'`, `workbox.globPatterns` to include `**/*.{js,css,html,json,png,webp,svg,woff2}`, `navigateFallback: '/offline.html'`, cache strategies: `CacheFirst` for assets (`/assets/`), `NetworkFirst` for navigation; add `manifest` with `name`, `short_name`, `display: standalone`, `background_color`, `theme_color`
- [X] T015 [P] Create `public/offline.html` — self-contained HTML page (no external resources, inline CSS) that informs the user the display is temporarily unavailable and will resume automatically; must work without any loaded JS or CSS
- [X] T016 [P] Place the Planet-provided hero image at `public/assets/hero-image.png`; the image is supplied by Planet and already contains the QR code managed by Planet's marketing team; use exactly as provided without modification; do not generate or substitute a placeholder

**Checkpoint**: Project builds (`npm run build`), routes are defined, config reads/writes localStorage, i18n loads all 6 Planet-approved locales, Service Worker precaches assets.

---

## Phase 3: User Story 1 — Shopper Display with Hero Image (Priority: P1) 🎯 MVP

**Goal**: Deploy a full-screen promotional display showing headline at top, Planet-provided
hero image in centre, supporting text below — legible on tablets, kiosks, and large-format
displays in both portrait and landscape orientations. No shopper interaction required.

**Independent Test**: Run `npm run dev`, open at 768×1024 and 1920×1080 viewports.
Verify the visual hierarchy (headline → hero image → supporting text) is immediately
visible without scrolling. Verify the settings icon is present in the bottom-right corner
and is not obtrusively visible.

- [X] T017 [US1] Create `src/components/display/HeroImage.tsx` — renders `<img src="/assets/hero-image.png" alt={t('heroImageAltText')} />` using `useTranslation`; CSS: `width: 100%`, `height: auto`, `max-height: 60vh`, `object-fit: contain`; image is language-invariant (same file for all locales, only alt text translates)
- [X] T018 [US1] Create `src/components/display/LanguageSlide.tsx` — accepts `locale: LocaleCode` prop; calls `i18n.changeLanguage(locale)` when locale prop changes; renders `<h1>{t('headline')}</h1>` and `<p>{t('subheading')}</p>` using `useTranslation`; sets `document.documentElement.dir` to `'rtl'` or `'ltr'` based on `LANGUAGE_CATALOGUE` entry for the active locale
- [X] T019 [US1] Create `src/components/display/DisplayView.tsx` — accepts `activeLocale: LocaleCode` prop; renders: (1) `<LanguageSlide locale={activeLocale} />` headline section at top, (2) `<HeroImage />` in centre, (3) `<LanguageSlide>` supporting text section below, (4) discreet settings icon `<button>` fixed to bottom-right corner (`position: fixed; bottom: 1rem; right: 1rem; opacity: 0.3`); no click handler on icon yet (wired in US3); CSS: full-viewport flex column layout
- [X] T020 [P] [US1] Implement portrait CSS in `src/components/display/DisplayView.tsx` — viewport height 100dvh; vertical flex column; headline `font-size: clamp(1.5rem, 4vw, 3rem)`; hero image `flex: 1 1 auto`, `max-height: 60dvh`; supporting text `font-size: clamp(1rem, 2.5vw, 1.75rem)`; all text `line-height: 1.4`; padding `clamp(1rem, 3vw, 3rem)`
- [X] T021 [P] [US1] Implement landscape CSS in `src/components/display/DisplayView.tsx` — at `@media (orientation: landscape)`: adjust font sizes for wide viewports; hero image `max-height: 70dvh`; verify layout at 1920×1080 and 3840×2160 (no overflow, no horizontal scroll)
- [X] T022 [US1] Create `src/pages/DisplayPage.tsx` — calls `useConfiguration()` to get active config; passes `config.selectedLocales[0]` as initial `activeLocale` to `DisplayView`; activeLocale state will be managed by the rotation hook added in US2 (for now, single locale only)

**Checkpoint**: `npm run dev` shows full-screen display with placeholder hero image, English headline and supporting text, settings icon bottom-right. Layout is correct at tablet (768×1024 portrait) and TV (1920×1080 landscape) viewports.

---

## Phase 4: User Story 2 — Language Rotation (Priority: P2)

**Goal**: Display automatically cycles through all configured languages at the configured
interval. Only headline and supporting text change; hero image remains static. Timer
continues if connectivity is lost.

**Independent Test**: Open settings (direct URL `/settings` in dev), enter PIN, set 2+
languages with 10-second interval, save, return to display. Observe rotation over 30 seconds.
Verify hero image does not change. Verify smooth transition. Disable network mid-rotation;
verify rotation continues.

- [X] T023 [US2] Create `src/hooks/useLanguageRotation.ts` — accepts `{ selectedLocales: LocaleCode[], rotationIntervalSeconds: number }`; returns `{ activeLocale: LocaleCode, activeIndex: number }`; when `selectedLocales.length === 1` return immediately without starting a timer; when `selectedLocales.length > 1` start `setInterval` advancing index cyclically; enforce minimum interval of 5 seconds regardless of input; clean up interval on unmount and on prop changes; reset to index 0 when `selectedLocales` changes
- [X] T024 [US2] Integrate `useLanguageRotation` into `src/pages/DisplayPage.tsx` — pass `config.selectedLocales` and `config.rotationIntervalSeconds` from `useConfiguration()`; pass `activeLocale` from hook to `<DisplayView activeLocale={activeLocale} />`; remove the static `selectedLocales[0]` initializer added in T022
- [X] T025 [P] [US2] Add CSS transition to `src/components/display/LanguageSlide.tsx` — wrap content in a container with `transition: opacity 0.4s ease-in-out`; on locale change briefly set `opacity: 0` then restore to `opacity: 1`; hero image does not participate in this transition
- [X] T026 [P] [US2] Add `key={activeLocale}` prop to the `<LanguageSlide>` element in `DisplayView.tsx` to trigger remount (and therefore re-animation) on each locale change — ensures stale content is never shown mid-transition

**Checkpoint**: Rotation cycles through all configured locales at the correct interval. Single-locale displays without rotation. Network disconnection does not stop rotation. Hero image is visually stable during language transitions.

---

## Phase 5: User Story 3 — Settings Area with PIN Gate (Priority: P3)

**Goal**: Settings icon tapped 5 times in 5 seconds triggers a PIN prompt. Correct PIN
reveals language selector, rotation interval picker, Save, and Restore Defaults.
Changes persist to localStorage and apply immediately to the display on this device.

**Independent Test**: Tap settings icon 4 times — no prompt. Tap 5th time within 5 seconds — PIN prompt appears. Enter wrong PIN — error shown. Enter correct PIN — settings form visible. Change languages and interval, save, return to display, verify changes applied. Restore defaults — all languages and a 15-second interval are restored after the three-second preservation screen.

- [X] T027 [US3] Create `src/components/settings/PinGate.tsx` — maintains a tap counter and timestamp in component state; increments counter on each `onClick` of the settings icon button passed via `onActivate` ref or forwarded from `DisplayView`; resets counter if >5 seconds elapse between taps; on 5th tap within window show the PIN form; PIN form renders a single `<input type="password" inputMode="numeric" maxLength={4} />` and a Submit button; on submit compute `SHA-256` of the entered string using `window.crypto.subtle.digest('SHA-256', ...)`, convert to hex, compare to `ENV.pinHash`; on match call `onUnlock()`; on mismatch show error message and clear the input; component does not navigate — it calls a callback
- [X] T028 [US3] Wire the settings icon button in `src/components/display/DisplayView.tsx` to `PinGate` — import `PinGate`; manage `isSettingsOpen: boolean` in DisplayPage state; render `<PinGate onUnlock={() => navigate('/settings')} />` as an overlay (position fixed, full-screen semi-transparent backdrop) when activated; pass the `onIconClick` handler down through `DisplayView` to the settings icon button
- [X] T029 [P] [US3] Create `src/components/settings/LanguageSelector.tsx` — accepts `selectedLocales: LocaleCode[]` and `onChange: (locales: LocaleCode[]) => void`; renders `LANGUAGE_CATALOGUE` as a list of toggle buttons with `role="checkbox"` and `aria-checked`; prevents deselecting the last remaining language (show disabled state with tooltip); displays language `label` and a direction indicator for RTL entries
- [X] T030 [P] [US3] Create `src/components/settings/RotationIntervalPicker.tsx` — accepts `value: number` and `onChange: (seconds: number) => void`; renders `<input type="number" min={5} />` with label "Rotation interval (seconds)"; validates on blur — clamps to minimum 5; displays validation error below input if value < 5
- [X] T031 [US3] Create `src/components/settings/SettingsView.tsx` — manages `pendingConfig: DisplayConfiguration` in local state (initialized from `useConfiguration().config`); renders `<LanguageSelector>` and `<RotationIntervalPicker>` bound to `pendingConfig`; **Save button**: calls `useConfiguration().save(pendingConfig)`; on success navigate back to `/`; **Restore Defaults button**: shows confirmation dialog; on confirm calls `useConfiguration().restoreDefaults()` then navigate to `/`; **Back button**: navigate to `/` without saving
- [X] T032 [US3] Create `src/pages/SettingsPage.tsx` — renders `<PinGate onUnlock={() => setUnlocked(true)} />` when not unlocked; renders `<SettingsView />` when unlocked; on navigate away reset unlocked state (use `useEffect` with location listener)

**Checkpoint**: 5-tap gesture on settings icon triggers PIN prompt. Correct PIN shows settings form. Language selection and rotation interval are configurable, persist to localStorage, and are reflected immediately on the display. Restore Defaults resets to all supported languages / 15s and replays the three-second preservation screen.

---

## Phase 6: User Story 4 — Offline Resilience (Priority: P4)

**Goal**: After a successful initial load, the display continues operating through internet
outages — language rotation continues, hero image remains visible. A clear fallback is shown
if the app has never loaded before going offline.

**Independent Test**: Build (`npm run build`) and serve (`npm run preview`). Fully load the
display. Go offline in DevTools. Reload — display loads from Service Worker cache. Rotate
for 2 minutes — rotation continues. Clear SW cache, go offline, reload — `/offline.html`
shown instead of browser error.

- [ ] T033 [US4] Verify `public/assets/hero-image.png` is included in Workbox precache manifest — run `npm run build`, open `dist/sw.js`, confirm `hero-image.png` URL appears in the generated precache manifest array; if missing, add explicit `globPattern` or `additionalManifestEntries` entry in `vite.config.ts`
- [ ] T034 [US4] Verify all locale JSON files are included in Workbox precache manifest — run `npm run build`, confirm each of the 10 `locales/*.json` files appears in `dist/sw.js` manifest; they must be under `src/i18n/locales/` and referenced via Vite's asset pipeline; if missing, configure `vite-plugin-pwa` `globDirectory` or include pattern to cover JSON assets
- [ ] T035 [US4] Add error boundary in `src/pages/DisplayPage.tsx` — wrap display content in a React `<ErrorBoundary>` (create `src/components/shared/ErrorBoundary.tsx`); on uncaught error render a styled fallback UI (`"Display temporarily unavailable"`) rather than a blank screen; this covers the edge case where locale assets fail to load after initial render
- [ ] T036 [US4] Validate `navigateFallback` behaviour — serve the production build (`npm run preview`), open DevTools → Application → Storage, clear site data, reload while offline; confirm browser shows `/offline.html` content (not a browser network error page); if `offline.html` is not served, adjust `navigateFallback` and `navigateFallbackDenylist` in `vite.config.ts`

**Checkpoint**: Production build serves full display from Service Worker cache after first load. Language rotation is unaffected by network loss. Hero image remains visible offline. Pre-cache-miss scenario shows `offline.html`.

---

## Phase 7: Screen Preservation

**Purpose**: Reduce image retention risk on continuously running displays.

- [X] T047 Add focused timer, interaction, pause, and overlay tests in `src/hooks/useScreenPreservation.test.ts`, `src/hooks/useLanguageRotation.test.ts`, and `src/components/display/ScreenPreservationMode.test.tsx`
- [X] T048 Create `src/hooks/useScreenPreservation.ts` with configurable activation, 15-second duration, interaction dismissal, cleanup, and trigger reset
- [X] T049 Add pause support to `src/hooks/useLanguageRotation.ts` without resetting the active locale
- [X] T050 Create the fading black overlay and centred logo in `src/components/display/ScreenPreservationMode.tsx` and `src/components/display/ScreenPreservationMode.css`
- [X] T051 Copy the supplied logo to `public/assets/tax-free-from-planet.svg`
- [X] T052 Integrate preservation state and language pause in `src/pages/DisplayPage.tsx`
- [X] T053 Update `spec.md`, `data-model.md`, and `quickstart.md` with preservation requirements and validation
- [X] T054 Show preservation mode for three seconds on initial load and after Restore defaults while retaining interaction dismissal
- [X] T055 Change default and restored configuration to all supported languages with a 15-second rotation interval
- [X] T056 Add automated coverage for startup preservation, defaults, and Restore defaults navigation

**Checkpoint**: The display enters preservation mode after its configured cycle or time trigger, exits after 15 seconds or any supported interaction, and resumes the unchanged QR experience and language cycle without reloading.

### Configurable Preservation Trigger Enhancement

- [X] T057 Extend `DisplayConfiguration` defaults and local-storage migration with a persisted `screenPreservationTrigger`, defaulting legacy configurations to five minutes.
- [X] T058 Track completed language rotation cycles and activate preservation after the configured cycle or time trigger while resetting runtime counters after preservation.
- [X] T059 Add the exclusive Screen Preservation Trigger settings control with positive-whole-number validation and save blocking for invalid values.
- [X] T060 Add focused configuration, trigger, cycle, and settings validation coverage; update feature documentation and quickstart scenarios.
- [X] T061 Add a persisted 5–30 second Screen Preservation duration setting using the shared interval picker; retain interaction dismissal and migrate existing settings to the 15-second default.
- [X] T062 Show the supplied localized preservation message beneath the Tax Free from Planet logo, cycling one active language per preservation activation.
- [X] T063 Resume normal language rotation from the locale used by the completed preservation mode and measure cycles from that locale.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive validation, and deployment readiness.

- [ ] T039 [P] Audit semantic HTML in `DisplayView.tsx` and `SettingsView.tsx` — `<main>` wrapper on both pages; display headline uses `<h1>`; settings form uses `<form>` with associated `<label>` elements; no `<div>` used where a semantic element is appropriate
- [ ] T040 [P] Add ARIA attributes — settings icon button: `aria-label="Open settings"`, `aria-haspopup="dialog"`; PIN input: `aria-label="Enter PIN"`, `aria-describedby` pointing to error message element; error message: `role="alert"`; language toggles: `role="checkbox"`, `aria-checked`
- [ ] T041 [P] Validate colour contrast — use browser DevTools accessibility panel or `axe-core`; confirm all text in `DisplayView.tsx` achieves ≥4.5:1 contrast ratio against background (WCAG 2.2 AA); confirm settings form text meets same standard; fix any failing combinations by adjusting colour values in CSS
- [ ] T042 [P] Keyboard navigation for settings — confirm Tab order: settings icon → PIN input → Submit button → language toggle 1…n → interval input → Save → Restore Defaults → Back; all interactive elements reachable by keyboard alone; Enter activates buttons; Space toggles language checkboxes
- [ ] T043 [P] Validate responsive layouts — manually verify the five viewports from `quickstart.md` (768×1024 portrait, 1024×768 landscape, 1920×1080 landscape, 3840×2160 landscape, 1080×1920 portrait); confirm visual hierarchy is preserved; confirm no horizontal overflow; confirm text does not fall below 16px equivalent at any supported viewport
- [ ] T044 [P] RTL layout validation — set browser language to Arabic, confirm `document.documentElement.dir` is `"rtl"` when `ar` locale is active; confirm text alignment and icon positions adapt correctly (settings icon should remain bottom-right in logical terms; verify CSS uses logical properties or explicit RTL overrides)
- [ ] T045 Run Lighthouse accessibility audit (`npx lighthouse http://localhost:4173 --only-categories=accessibility`) on `/` and `/settings`; resolve all violations with severity ≥ "serious" until Lighthouse accessibility score ≥ 90
- [ ] T046 Create `README.md` at repository root — sections: Project Purpose, Prerequisites (Node 20+, npm), Setup (`npm install`), Environment Variables (`VITE_PIN_HASH` with PowerShell SHA-256 generation command), Development (`npm run dev`), Production Build (`npm run build`, `npm run preview`), Deployment (copy `dist/` to any static host), Hero Image (replace `public/assets/hero-image.png` with Planet-provided asset before deployment)

---

## Dependency Graph

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        ├── Phase 3 [US1 - MVP] ──────────────┐
        │     └── Phase 4 [US2]               │
        │           └── Phase 5 [US3]         │
        │                 └── Phase 6 [US4]
        │                       └── Phase 8 (Polish)
        └──────────────────────────────────────┘
            (US stories are sequential by priority;
             Polish can begin once US1 is complete)
```

**Within-phase parallel opportunities**:
- Phase 1: T002, T003, T004, T005 parallel after T001
- Phase 2: T007, T008, T009, T010, T015, T016 parallel; T011 after T007+T008; T012 after T011; T013 after T001
- Phase 3: T017, T018 parallel; T019 after T017+T018; T020, T021 parallel after T019
- Phase 4: T025, T026 parallel after T024
- Phase 5: T029, T030 parallel; T031 after T029+T030
- Phase 8: T039–T045 fully parallel; T046 independent

---

## Implementation Strategy

**MVP** (Phases 1–3): 22 tasks. Delivers a live shopper-facing display with hero image,
English headline and supporting text, correct visual hierarchy across all target screen
sizes, and a visible (non-functional) settings icon. Ready for stakeholder review.

**After MVP**: Each subsequent phase is independently deployable:
- Add US2 for language rotation
- Add US3 for settings configuration
- Add US4 to harden offline resilience
- Apply Phase 8 polish for WCAG compliance and deployment readiness

**Total tasks**: 44
**Parallel opportunities**: 23 tasks are marked [P]

**Per user story**:
- US1: 6 tasks (T017–T022)
- US2: 4 tasks (T023–T026)
- US3: 6 tasks (T027–T032)
- US4: 4 tasks (T033–T036)
- Setup: 5 tasks (T001–T005)
- Foundational: 11 tasks (T006–T016)
- Polish: 8 tasks (T039–T046)
