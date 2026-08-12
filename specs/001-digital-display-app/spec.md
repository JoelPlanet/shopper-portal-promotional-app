# Feature Specification: Digital Display Promotional Application

**Feature Branch**: `001-digital-display-app`

**Created**: 2026-08-11

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Shopper Views Display and Scans QR Code (Priority: P1)

A tax free shopper is standing in a retail environment — at a counter, near a
kiosk, or passing a digital screen. The display immediately communicates that
they can request a tax refund digitally. A promotional headline appears at
the top, the Planet-provided hero image (containing a QR code) fills the
centre, and supporting text sits below. The shopper scans the QR code and
is taken directly to Shopper Portal.

**Why this priority**: This is the sole conversion mechanism. Every other
feature exists to support this journey. A display that shows a visible QR code
with a clear refund message delivers the complete MVP.

**Independent Test**: Deploy the application and observe the shopper-facing
display. Verify that a person unfamiliar with the product can identify the
purpose and locate the QR code in the hero image within 5 seconds without
assistance.

**Acceptance Scenarios**:

1. **Given** the display application is loaded on any supported screen, **When**
   a shopper looks at the screen, **Then** a promotional headline is visible at
   the top, the hero image (containing the QR code) is visible in the centre,
   and supporting text is visible below, all without scrolling or interaction.
2. **Given** the display is active, **When** a shopper scans the QR code,
   **Then** they are directed to the Planet-designated Shopper Portal entry
   point for digital screen arrivals.
3. **Given** a shopper scans the QR code from the hero image, **When** they
   arrive at Shopper Portal, **Then** Planet's marketing QR service records
   the scan and attributes the visit to the digital display channel.

---

### User Story 2 — Display Rotates Promotional Content Across Multiple Languages (Priority: P2)

The display automatically cycles through configured languages at a set interval,
showing each language's promotional content in turn. Shoppers of different
nationalities can each see messaging in a language they understand without any
interaction.

**Why this priority**: Tax free shopping environments attract international
shoppers. Serving content in multiple languages directly increases the reach and
comprehension of the message, improving conversion.

**Independent Test**: Configure two or more languages with a short rotation
interval. Observe the display over time and verify that each language appears,
displays for the configured duration, and transitions smoothly to the next.

**Acceptance Scenarios**:

1. **Given** two or more languages are configured, **When** the rotation
   interval elapses, **Then** the display transitions to the next configured
   language automatically.
2. **Given** a single language is configured, **When** the display is running,
   **Then** content is shown continuously in that language with no rotation.
3. **Given** multiple languages are configured, **When** the display is
   running, **Then** all configured languages cycle through in a repeating
   loop.
4. **Given** the display is running with language rotation active, **When**
   connectivity is lost, **Then** language rotation continues using already
   loaded content.

---

### User Story 3 — Administrator Configures the Display Experience (Priority: P3)

An administrator — a merchant, shopping centre manager, or other authorised
person — accesses the settings area by entering a global 4-digit PIN. They
configure which languages to show and how frequently languages rotate. They
save the configuration and the display immediately reflects the changes.
Administrators can also restore default settings at any time.

Configuration changes made on a device affect only that running instance of
the application. There is no central management portal and no synchronisation
between deployments.

**Why this priority**: Self-service configuration removes the dependency on
technical teams for every deployment, enabling the platform to scale across
many locations without requiring code changes or specialist support.

**Independent Test**: Tap the settings icon in the bottom-right corner five
times within five seconds. Enter the correct PIN. Configure a language
selection and rotation interval. Save. Verify the shopper-facing display
reflects all changes. Restore defaults and verify the display returns to its
default state.

**Acceptance Scenarios**:

1. **Given** the shopper display is active, **When** the settings icon in the
   bottom-right corner is tapped five times within five seconds, **Then** a
   4-digit PIN prompt appears.
2. **Given** the PIN prompt is visible, **When** the correct 4-digit PIN is
   entered, **Then** the settings area becomes accessible.
3. **Given** the PIN prompt is visible, **When** an incorrect PIN is entered,
   **Then** access is denied and a clear error is shown.
4. **Given** the correct PIN has been entered, **When** the administrator
   opens the language settings, **Then** they can select one or more languages
   from the available catalogue and save their selection.
5. **Given** the administrator has selected multiple languages, **When** they
   set the rotation interval, **Then** the interval is saved and applied to
   the display on this device only.
6. **Given** the administrator saves a configuration, **When** the display
   resumes, **Then** the shopper-facing experience reflects the saved settings
   on this device only.
7. **Given** the administrator selects "Restore Defaults", **When** they
   confirm the action, **Then** the configuration is reset to the default
   Planet settings.

---

### User Story 4 — Display Continues Operating After Connectivity Loss (Priority: P4)

The display has loaded successfully and is showing content. The internet
connection is interrupted. The display continues showing promotional content,
cycling through languages, and presenting the QR code for the duration of the
outage.

**Why this priority**: Physical retail environments have variable network
reliability. A blank or errored screen during a connectivity outage kills
conversion at exactly the moment a shopper may be present.

**Independent Test**: Load the display fully on a device. Disable the device's
internet connection. Verify that the display continues showing content, language
rotation continues, and the QR code remains visible and scannable for at least
30 minutes.

**Acceptance Scenarios**:

1. **Given** the display has fully loaded, **When** internet connectivity is
   lost, **Then** the shopper-facing experience continues without visible
   disruption.
2. **Given** the display is running offline, **When** a configured rotation
   interval elapses, **Then** the language transitions as normal using loaded
   content.
3. **Given** the display is running offline, **When** a shopper looks at the
   screen, **Then** the QR code is visible and scannable.
4. **Given** connectivity is lost before the display has finished loading,
   **When** the load cannot complete, **Then** the display shows a clear
   indication that it is unavailable rather than an unformatted error.

---

### Edge Cases

- What happens when no configuration has ever been saved? — The display falls
  back to the default Planet-branded experience showing the hero image.
- What happens when all configured language assets fail to load on first start?
  — The display should show a degraded but operational state indicating a
  configuration error.
- What happens when language rotation is configured with a very short interval
  (e.g., 1 second)? — The system should enforce a minimum rotation interval to
  prevent unusable rapid switching.
- What happens when the PIN is entered incorrectly? — Access to settings is
  denied and a clear error is displayed. The shopper-facing display is
  unaffected.
- What happens when fewer than five taps are registered within the five-second
  window? — The tap counter resets silently; no PIN prompt appears.
- What happens when the display is deployed on a very large screen with wide
  aspect ratio? — Content must scale and remain legible without distortion or
  unconstrained stretching.

---

## Requirements *(mandatory)*

### Functional Requirements

**Shopper Display**

- **FR-001**: The display MUST prominently show the Planet-provided hero image,
  which includes a Shopper Portal screenshot and a QR code managed by Planet's
  marketing team.
- **FR-002**: The display MUST include visual representations of Shopper Portal
  sufficient to identify the destination to a shopper.
- **FR-003**: The display MUST include promotional messaging that clearly
  communicates to a shopper that they can request a tax refund digitally.
- **FR-004**: The display MUST require no shopper interaction to function.
- **FR-005**: The display MUST be visually effective and all content MUST be
  legible on both small screens (tablet, ~10 inch) and large screens (TV,
  55+ inch).
- **FR-006**: The display MUST adapt its layout to the screen size and
  orientation it is rendered on.
- **FR-007**: The shopper-facing experience MUST continue operating after
  internet connectivity is lost, provided the application has completed its
  initial load.
- **FR-008**: The QR code MUST remain visible and scannable during connectivity
  loss.
- **FR-009**: Language rotation MUST continue during connectivity loss using
  previously loaded content.
- **FR-027**: The application MUST be suitable for use as a fallback customer
  journey when a Planet Tax Free kiosk is unavailable or out of service.
- **FR-028**: The display MUST support both landscape and portrait orientations.
- **FR-030**: The shopper-facing display MUST follow a fixed visual hierarchy:
  promotional headline at the top, the Planet-provided hero image in the centre,
  and supporting text below the image. Responsive layouts MUST preserve this
  hierarchy across tablets, kiosks, and large-format displays.
- **FR-031**: The hero image MUST remain constant across all configured
  languages. Language rotation MUST affect only the headline and supporting
  text.

**Multi-Language**

- **FR-010**: The display MUST support a configurable selection of languages
  drawn from a defined catalogue of supported languages.
- **FR-011**: When multiple languages are configured, the display MUST
  automatically rotate through them at a configurable interval.
- **FR-012**: When only one language is configured, the display MUST show that
  language continuously without rotation.
- **FR-013**: Language rotation interval MUST be configurable and MUST enforce
  a minimum interval of at least 5 seconds.

**Administration**

- **FR-017**: The settings area MUST be accessible via a discreet settings icon
  displayed in the bottom-right corner of the shopper-facing display. Tapping
  the icon five times within five seconds MUST trigger a 4-digit PIN prompt.
  The correct PIN MUST be entered before any configuration options are visible.
  Incorrect PIN entry MUST be rejected with a clear error message.
- **FR-018**: Administrators MUST be able to configure which languages appear
  on the display.
- **FR-019**: Administrators MUST be able to configure the language rotation
  interval.
- **FR-023**: Administrators MUST be able to save and retrieve configuration
  settings.
- **FR-029**: Administrators MUST be able to restore the display configuration
  to its default state.

**Analytics**

- **FR-024**: Attribution and scan reporting for the QR code are managed
  externally by Planet's marketing team QR service. This application has no
  responsibility for QR destinations, tracking parameters, or scan analytics.

**Out of Scope**

- The application MUST NOT process tax refunds.
- The application MUST NOT perform Shopper Portal registration.
- The application MUST NOT replace Shopper Portal functionality.
- The application MUST NOT replace existing kiosk functionality.

### Key Entities

- **Display Configuration**: Includes selected languages, language rotation interval and other display settings that govern the shopper-facing experience for a single deployment.
- **Language Entry**: A locale-specific content package containing all
  promotional text, labels, and any locale-specific media needed for the
  display. Drawn from a catalogue of supported locales.
- **Administrator**: An authorised person with access to the PIN-gated settings
  area. Responsible for configuring the display for their deployment context.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A person unfamiliar with the product can identify the display's
  purpose (tax refund, scan QR code) within 5 seconds of viewing the screen,
  without staff assistance.
- **SC-002**: The display continues showing promotional content and a
  scannable QR code for the full duration of an internet outage, provided the
  application completed its initial load before the outage.
- **SC-003**: Configured language rotation operates continuously without manual
  intervention across all supported screen sizes.
- **SC-004**: An administrator can complete the full configuration workflow — language selection, rotation interval configuration, and save — without requiring technical support.
- **SC-005**: A new deployment can be configured using only the local settings area, with no code changes required.
- **SC-006**: QR code scans from the digital display are tracked and attributed
  to the digital display channel by Planet's marketing team QR service.
- **SC-007**: The display renders content correctly and all text remains
  legible across all target screen sizes and orientations without manual
  layout adjustment.
- **SC-008**: The administration area and all shopper-facing content meet
  WCAG 2.2 AA accessibility standards.

---

## Assumptions

- Shopper Portal already exists. The hero image includes a QR code managed by
  Planet's marketing team QR service, which handles redirect management, scan
  reporting and campaign attribution independently of this application.
  Shopper Portal's existing Heap analytics measure conversion from arrival
  onwards. No analytics integration is required within this application.
- The hero image is a static Planet-provided asset containing a QR code managed
  by Planet's marketing team. The application renders it as-is without
  modification. QR destination management, scan tracking and attribution are
  entirely Planet's responsibility.
- A defined catalogue of supported languages already exists or will be defined
  during planning; the administration UI presents this catalogue as a
  configurable toggle list rather than allowing freeform language entry.
- There are no administrator accounts. Access to settings is controlled by a
  global 4-digit PIN. PIN management (setting or changing the PIN) is handled
  operationally and is outside the application scope for v1.
- **Display scope (v1)**: Each running instance of the application maintains
  its own configuration. An administrator configures the language settings and
  display behaviour for the one deployment they are responsible for.
  Configuration changes affect only the local deployment on which they are
  made. There is no central management portal, fleet management capability, or
  configuration synchronisation between deployments in v1. The architecture
  must not prevent future expansion to support multiple displays or deployments
  under a single account, but that capability is explicitly out of scope for
  the initial release.
- Initial internet connectivity is required to load the application and its
  configuration; offline mode activates only after a successful initial load.
- The application is deployed as a hosted web application accessed via a URL;
  no native installation is required on display devices.
- The display operates in a continuous, unattended loop; there is no concept of
  an idle state, screen saver, or session timeout on the shopper-facing view.
- All promotional copy, translations, and Shopper Portal imagery are managed by
  Planet and deployed as part of the application. Administrators can choose
  which languages are active but cannot edit translation content.
