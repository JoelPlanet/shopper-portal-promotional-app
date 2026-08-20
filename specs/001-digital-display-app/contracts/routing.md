# Contract: Application Routes

**Feature**: Digital Display Promotional Application
**Date**: 2026-08-11

The application exposes two browser routes. There are no server-side routes;
all routing is client-side (React Router or equivalent).

---

## Routes

### `GET /`

**Name**: Display View
**Audience**: Shoppers (public, unattended)
**Access**: Unrestricted — no authentication required

**Description**: The full-screen shopper-facing promotional display. Shows a
fixed visual hierarchy: a localised promotional headline at the top, the
Planet-provided hero image (containing the QR code) in the centre, and
localised supporting text below. Rotates through configured locales at the
configured interval, updating only the headline and supporting text — the hero
image remains constant across all languages. A discreet settings icon is
displayed in the bottom-right corner. Requires no shopper interaction.

**Behaviour**:
- On mount: reads `DisplayConfiguration` from `localStorage`; falls back to
  defaults if none is saved.
- Starts language rotation timer if `selectedLocales.length > 1`.
- Shows a bottom-left temporary language picker containing every supported
  locale. Temporary selections are runtime-only, last 20 seconds, pause normal
  rotation, and then restart configured rotation from the first active locale.
- Continues rendering from cached assets if network is unavailable.

**URL query parameters**: None consumed. The route itself has no parameters.

**Layout variants**:
- Portrait (≤ 768px width or device in portrait orientation)
- Landscape (> 768px width in landscape orientation, including large displays)

---

### `GET /settings`

**Name**: Settings View
**Audience**: Administrators
**Access**: Accessed via 5-tap gesture on settings icon, then 4-digit PIN

**Description**: The administrator configuration area. Allows language
selection, rotation interval configuration, preview, save, and restore defaults.
Protected by a global PIN validated client-side.

**Behaviour**:
- On mount: renders PIN entry screen.
- On correct PIN: renders settings form with current saved configuration loaded.
- On incorrect PIN: shows error message; remains on PIN entry screen.
- On save: persists `DisplayConfiguration` to `localStorage`.
- On restore defaults: removes `ndsk:config` from `localStorage`; applies
  default configuration.
- On navigate away (back to `/`): settings view closes; PIN state is cleared
  (re-entry required on next visit to `/settings`).

**URL query parameters**: None.

---

## Navigation

| From | To | Trigger |
|------|----|-------|
| `/` | `/settings` | Settings icon tapped 5× within 5 seconds |
| `/settings` | `/` | “Back to display” action or after save |

A discreet settings icon is displayed in the bottom-right corner of the
shopper-facing display. Tapping it five times within five seconds navigates
to `/settings` and presents the PIN prompt. The icon is intentionally subtle
to prevent accidental triggering by shoppers.

---

## Service Worker

The Service Worker registers at the application root (`/`) and intercepts all
same-origin requests.

**Precached routes**:
- `/` (HTML shell)
- `/settings` (same HTML shell — client-side routing)
- All JS and CSS chunks
- All images in `public/assets/`
- All locale JSON files in `src/i18n/locales/`

**Cache strategy**: `CacheFirst` for all precached assets. `NetworkFirst` with
offline fallback for the HTML shell navigation.

**Cache invalidation**: On each new build, Workbox generates a new precache
manifest with content hashes. The Service Worker updates automatically when the
application is reloaded with connectivity.
