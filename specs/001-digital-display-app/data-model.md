# Data Model: Digital Display Promotional Application

**Phase**: 1 — Design
**Date**: 2026-08-11
**Feature**: [spec.md](spec.md) | **Research**: [research.md](research.md)

---

## Entities

### DisplayConfiguration

The single configuration object persisted to `localStorage` for a deployment.
Governs the shopper-facing experience on the local device.

**Storage key**: `ndsk:config`
**Persistence**: `localStorage` (local to this browser/device)
**Scope**: One per deployment; changes affect only this device

```typescript
interface DisplayConfiguration {
  /** Ordered list of locale codes to display. Must be non-empty. */
  selectedLocales: LocaleCode[];

  /**
   * Duration in seconds each language is shown before rotating.
   * Minimum: 5 (enforced on save). Ignored when selectedLocales.length === 1.
   */
  rotationIntervalSeconds: number;
}
```

**Default value** (applied when no saved config exists or after Restore Defaults):

```typescript
const DEFAULT_CONFIGURATION: DisplayConfiguration = {
  selectedLocales: ['en'],
  rotationIntervalSeconds: 30,
};
```

**Validation rules**:
- `selectedLocales` must contain at least one entry from `LANGUAGE_CATALOGUE`
- `selectedLocales` entries must all be valid `LocaleCode` values
- `rotationIntervalSeconds` must be an integer ≥ 5

---

### LanguageCatalogueEntry

A static, read-only record describing a supported locale. Defined in source code;
not editable by administrators.

```typescript
interface LanguageCatalogueEntry {
  /** IETF BCP 47 locale tag used as i18next namespace key */
  code: LocaleCode;
  /** Human-readable label shown in the settings language selector */
  label: string;
  /** Text direction for this locale */
  direction: 'ltr' | 'rtl';
}
```

**Planet-approved locale catalogue (v1)**:

```typescript
const LANGUAGE_CATALOGUE: LanguageCatalogueEntry[] = [
  { code: 'en',    label: 'English',    direction: 'ltr' },
  { code: 'zh-CN', label: '中文',        direction: 'ltr' },
  { code: 'ar',    label: 'العربية',   direction: 'rtl' },
  { code: 'fr',    label: 'Français',  direction: 'ltr' },
  { code: 'es',    label: 'Español',   direction: 'ltr' },
  { code: 'pt',    label: 'Português', direction: 'ltr' },
];

type LocaleCode = 'en' | 'zh-CN' | 'ar' | 'fr' | 'es' | 'pt';
```

---

### LanguageContent

A locale-specific translation bundle. Stored as a static JSON file bundled with
the application. Loaded at initialisation by i18next. Not user-editable.

**File path pattern**: `src/i18n/locales/{code}.json`

**Shape** (all keys required per locale):

```typescript
interface LanguageContent {
  /** Promotional headline displayed at the top of the screen */
  headline: string;
  /** Supporting text displayed below the hero image */
  subheading: string;
  /** Call-to-action below the supporting text (e.g. "Scan to get your refund") */
  qrCallToAction: string;
  /** Shopper Portal display name for this locale */
  shopperPortalName: string;
  /** Accessibility label for the hero image (locale-specific; the image asset is language-invariant) */
  heroImageAltText: string;
  /** Settings area labels (not shown on display) */
  settings: {
    title: string;
    pinPrompt: string;
    pinError: string;
    languagesLabel: string;
    intervalLabel: string;
    intervalUnit: string;
    saveButton: string;
    restoreDefaultsButton: string;
    restoreDefaultsConfirm: string;
  };
}
```

---

### EnvironmentConfiguration

Static values provided at build time via Vite environment variables. Read-only
at runtime.

```typescript
interface EnvironmentConfiguration {
  /**
   * SHA-256 hash (hex, lowercase) of the 4-digit administrator PIN.
   * Used for client-side PIN validation. Raw PIN is never stored.
   */
  pinHash: string;
}
```

**Source**: `src/config/env.ts` reads from:
- `import.meta.env.VITE_PIN_HASH`

---

## State Transitions

### Language Rotation State Machine

```
              ┌─────────────────────────────────┐
              │           ROTATING               │
              │  currentIndex: 0..n-1            │
              │  interval: rotationInterval secs │
              └───────────────┬─────────────────┘
                              │ timer fires
                              ▼
              currentIndex = (currentIndex + 1) % selectedLocales.length
                              │
              ┌───────────────┘
              │ selectedLocales.length === 1
              ▼
              ┌─────────────────────────────────┐
              │           STATIC                 │
              │  currentIndex: always 0          │
              │  no timer running                │
              └─────────────────────────────────┘

On config change: reset currentIndex to 0, restart timer with new interval.
On connectivity loss: no state change; timer continues unaffected.
```

### Settings Access State Machine

```
  ┌──────────┐  navigate to /settings   ┌───────────┐
  │  LOCKED  │ ─────────────────────── ▶│ PIN ENTRY │
  └──────────┘                          └─────┬─────┘
                                              │
                              ┌───────────────┼──────────────────┐
                              │ incorrect PIN │                  │ correct PIN
                              ▼               │                  ▼
                        ┌──────────┐          │         ┌──────────────┐
                        │  ERROR   │          │         │  UNLOCKED    │
                        │  shown   │          │         │  (settings   │
                        └──────────┘          │         │   visible)   │
                              │               │         └──────┬───────┘
                              └───────────────┘                │
                                                    ┌──────────┴──────────┐
                                                    │                     │
                                                   save              navigate away
                                                    │                     │
                                                    ▼                     ▼
                                             ┌──────────┐         ┌──────────┐
                                             │ SAVED    │         │  LOCKED  │
                                             │ display  │         │ (reset)  │
                                             │ updates  │         └──────────┘
                                             └──────────┘
```

---

## Persistence and Recovery

| Scenario | Behaviour |
|----------|-----------|
| First load (no saved config) | Default configuration applied (`selectedLocales: ['en']`, `rotationIntervalSeconds: 30`) |
| Page reload with saved config | Config read from localStorage; display resumes immediately |
| Network lost after full load | All assets served from Service Worker cache; localStorage config intact; rotation continues |
| Network lost before full load | Service Worker serves cached shell if available; error state shown if not yet cached |
| localStorage cleared | Equivalent to first load; default config applied |
| Restore Defaults action | `ndsk:config` key removed from localStorage; default config applied |
