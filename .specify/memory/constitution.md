<!--
Sync Impact Report
==================
Version change: (none) → 1.0.0
Added sections: Core Principles (11), Success Metrics, Governance
Modified principles: n/a (initial ratification)
Removed sections: n/a
Templates checked:
  ✅ plan-template.md — Constitution Check gate present; no outdated references
  ✅ spec-template.md — user story structure aligns with conversion/journey principles
  ✅ tasks-template.md — phased structure compatible with all principles
Follow-up TODOs: none
-->

# New Digital Kiosk Constitution

## Core Principles

### I. Conversion First

Every feature MUST directly contribute to increasing the number of shoppers who
successfully request a tax-free refund through Shopper Portal. Features with no
clear, measurable path to improving the primary KPI (refund requests via QR
journey) MUST be challenged before development begins.

**Rationale**: The product exists solely to drive shopper refund conversions;
unfocused features dilute effort and introduce unnecessary complexity.

### II. Public Screen First

The application is designed for unattended public environments. Content MUST be
immediately understandable without staff assistance and MUST communicate its
purpose within a few seconds of display. No interaction or instruction from
staff should be required for a shopper to understand and act.

**Rationale**: Digital kiosks operate without supervision; designs that assume
human guidance will fail in production.

### III. Device Agnostic

The application MUST operate correctly across tablets, kiosks, desktop browsers,
and large-format digital displays. User experiences MUST adapt appropriately to
different screen sizes and orientations without loss of functionality or
legibility.

**Rationale**: Deployment environments are heterogeneous; a single rigid layout
will break across the device fleet.

### IV. Configuration Over Development

Merchant, shopping centre, and partner-specific branding, language selection, and
display settings MUST be configurable through administration tools. Code changes
MUST NOT be required for per-partner or per-location customisation.

**Rationale**: Operational scalability demands that onboarding new partners does
not require a development cycle.

### V. Offline Resilience

Once loaded, the shopper-facing experience MUST continue operating during
temporary internet outages. Core display functionality MUST remain available when
connectivity is interrupted. Degradation MUST be graceful and silent to the
shopper.

**Rationale**: Network reliability at physical retail locations is inconsistent;
a blank or errored screen kills conversion.

### VI. Accessibility

All user-facing and administrative experiences MUST meet WCAG 2.2 AA
accessibility standards. The application MUST support users with a wide range of
accessibility needs including visual, motor, and cognitive requirements.

**Rationale**: Public kiosks serve the general public; excluding any user segment
is both ethically and legally unacceptable.

### VII. Analytics First

All significant shopper interactions MUST be measurable. The application MUST
support tracking the complete customer journey from QR code scan through to
Shopper Portal usage and refund request creation. No meaningful interaction may
be added without a corresponding analytics event.

**Rationale**: Without measurement there is no improvement; the primary KPI
cannot be managed if the journey cannot be observed.

### VIII. Performance

The application MUST load quickly and provide smooth, responsive interactions
across a wide range of devices and network conditions. Performance regressions
that affect perceived load time or interaction responsiveness MUST be treated as
defects.

**Rationale**: Slow or janky experiences increase drop-off before conversion,
directly harming the primary KPI.

### IX. Simplicity

The shopper journey MUST minimise cognitive load and focus on directing shoppers
to Shopper Portal. Unnecessary functionality, decorative steps, and distractions
MUST be avoided. When in doubt, remove.

**Rationale**: Every additional element is an opportunity for a shopper to
abandon the journey; the path to conversion must be frictionless.

### X. Maintainability

The codebase MUST be modular and designed to support future enhancements without
unnecessary complexity. Components MUST have clear boundaries and responsibilities.
Undocumented workarounds and tightly coupled logic MUST be refactored proactively.

**Rationale**: The platform will evolve; unmaintainable code compounds the cost
of every future change.

### XI. Brand Consistency

The application MUST support configurable partner branding while maintaining the
integrity of the Planet brand and the Shopper Portal experience. Partner
customisation MUST operate within defined guardrails that preserve brand safety.

**Rationale**: Inconsistent or uncontrolled branding erodes shopper trust and
undermines the Planet-partner relationship.

## Success Metrics

### Primary KPI

- Number of refund requests created through Shopper Portal by users entering via
  the digital screen QR code journey.

### Supporting Metrics

- QR code scans
- Shopper Portal visits
- Shopper Portal registrations
- Refund requests from existing Shopper Portal users
- Refund requests from newly registered Shopper Portal users
- QR scan → refund request conversion rate
- QR scan → registration conversion rate

All features MUST be evaluated against their expected impact on these metrics.
Analytics instrumentation covering these metrics is a delivery requirement, not
an optional enhancement.

## Governance

This constitution supersedes all other guidance documents. Amendments require:

1. A written rationale explaining why the change is necessary.
2. An impact assessment against existing specs, plans, and tasks.
3. Version increment following semantic versioning:
   - **MAJOR**: removal or redefinition of a principle.
   - **MINOR**: new principle or section added, or material guidance expanded.
   - **PATCH**: clarification, wording, or non-semantic refinement.

All implementation plans MUST include a Constitution Check gate before work
begins. Pull requests that violate any principle MUST be rejected unless the
constitution is first amended to reflect the new direction.

**Version**: 1.0.0 | **Ratified**: 2026-08-11 | **Last Amended**: 2026-08-11
