# Passport preparation guide — stage 3 handoff

Project queue ID: `REPO-kagoj-sathi-bd` (stage-2 idea ID not assigned). Upstream: Bangladesh Project Repository Register v1 and Research Idea Bank v1 (neither contains a separate passport idea). Foundation dependency: PR #1 (`foundation/basic-website`). This increment is a separate feature branch and draft stacked PR; do not merge into `main` before resolving foundation.

## User task

Choose application location (Bangladesh or Bangladesh mission), age band (under 18 / 18–20 / over 20), and request type (new / reissue / lost). Generate a sourced Bangla checklist, tick preparation tasks and print it. Each task links to an official primary source. No ID numbers, names, scans, local storage, backend, analytics or payment are used. The guide never submits a passport application.

Failure and safety states: incomplete/invalid selections show an error and no checklist; changing a selection hides the previous checklist; content review overdue after 2026-11-30 shows a warning; an invalid device date shows unknown freshness; JavaScript disabled still leaves official links. Official instructions may change at any time. The user must verify directly before acting. Printing includes the warnings and sources. GitHub issue links are optional public drafts, not a feedback submission mechanism.

## Sources reviewed 2026-10-30

- https://www.epassport.gov.bd/instructions/instructions — last updated 2026-08-03; age bands, location and request rules.
- https://www.epassport.gov.bd/landing/notices/160 — last updated 2024-10-21; enrolment document notice.
- https://www.epassport.gov.bd/landing/faqs/15 — last updated 2025-05-24; online appointment workflow.
- https://epassport.gov.bd/instructions/passport-fees — last updated 2026-07-12; payment methods (no fees copied into app).

No automatic source feed or permission to publish live status is implied. The official portal and office remain authoritative. Specific offices, mission-specific details, age under six photo nuances, government service cases, name corrections, and availability are not exhaustively modeled.

## Reproduce

From repo root: `npm test`, `node --check passport-guide.js`, `node --check passport-model.js`, then `python3 -m http.server 8000` and open `http://localhost:8000/passport-guide.html`. Requires Node 20+ and Python 3; no dependency install. Test the three selects, empty submission, checklist sources, reset, print, keyboard focus and no-JS official links. For preview publishing, verify actual HTTP module loading and mobile 320/390/1280 layouts, 200% zoom, Bangla glyphs, print and accessibility; do not claim a live preview until independently checked.

Performance budget: new HTML+CSS+JS+model under 25 KiB uncompressed, zero external runtime requests other than optional official links. Review content by 2026-11-30, earlier if an official change is detected. Stage 5 owns release and should review source accuracy, run real browser tests, check security alerts, and obtain user comprehension testing before treating this as production-ready. No real-user feedback has been collected.
