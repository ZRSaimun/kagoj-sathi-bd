# Passport question guide — stage 4 handoff

Project queue ID: `REPO-kagoj-sathi-bd`. Input: stage-3 draft PR #2 at `e2fe27c9f515930b178772d37143d0301943a5f7` (itself stacked on foundation PR #1). Stage-4 branch: `stage4/passport-guidance-assistant`; draft PR targets `stage3/passport-preparation-guide`. This does not replace or modify stage-3's branch.

## What works

Open `assistant.html` through a static HTTP server. A Bangla/English reviewed FAQ helps with passport preparation, lost/reissue documents, age and location distinctions, appointments and fees. Three scenario selectors prevent guesses about the applicant. It imports the stage-3 `passport-model.js` checklist so the answer and checklist use the same curated steps. Every substantive answer has official source links. The full checklist opens separately. Unsupported, current, stale and suspicious questions fail closed. Input and responses are held in the page DOM only, with a clear-history button; no localStorage, cookies, analytics, provider requests, application submissions or account access. Mobile-first layout, keyboard-native controls, screen-reader announcements, focus to answers, no-JS source links and reduced-motion support are included.

**Not a live AI chatbot:** `provider-adapter.js` is intentionally disabled and tested to reject every call. No provider, API key, hosting budget or server exists; no model responses, live fees, appointments, official decisions or processing guarantees are claimed. A ChatGPT subscription does not provide website API access. The local 20-question limit is a UX guard only, not a server rate limit. No personal data should be typed into the question box; obvious identifiers are rejected and questions are not echoed into the transcript. This does not provide a guarantee against all accidental personal-data entry.

## Editorial evidence and constraints

The source links and review metadata are reused from stage-3's curated `passport-model.js` (reviewed 2026-10-30; review due 2026-11-30):
- [Official e-passport instructions](https://www.epassport.gov.bd/instructions/instructions) — stage-3 recorded update 2026-08-03; source content must be rechecked by stage 5.
- [Enrolment checklist notice](https://www.epassport.gov.bd/landing/notices/160) — stage-3 recorded update 2024-10-21.
- [Appointment FAQ](https://www.epassport.gov.bd/landing/faqs/15) — stage-3 recorded update 2025-05-24.
- [Fees and payments](https://epassport.gov.bd/instructions/passport-fees) — stage-3 recorded update 2026-07-12.
- [Application portal](https://www.epassport.gov.bd/).

No official source is scraped, uploaded, cached or republished. A source URL is not proof of current applicability. The guide abstains when the review date is overdue, the device date is invalid, the question seeks live information or the evidence does not cover the request. A wrong device date can defeat local freshness checks; a server-side clock and scheduled editorial review would be required for stronger assurance.

Provider research (rechecked 2026-10-30):
- https://developers.openai.com/api/docs/guides/tools-file-search — optional hosted vector-store search requires an API account, uploaded knowledge files and costs; not enabled.
- https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety — keys must not be shipped in browser code or Git; backend and spend enforcement required.

Before enabling a real model: approve a separate budget and provider; implement a server-only adapter, per-IP/session rate limits, max request/response tokens, hard spend controls, authenticated source ingestion with effective/review dates, citations checked against allowlisted official URLs, injection/PII tests, retention disclosure and a kill switch. Keep deterministic FAQ available when provider fails. Never send user questions or upload documents without privacy review and notice.

## Reproduce and review

```sh
npm test
node --check assistant.js
node --check assistant-model.js
node --check provider-adapter.js
python3 -m http.server 8000
# open http://localhost:8000/assistant.html
```

No external runtime dependencies or lockfile are needed. Tests cover Bangla/English, scenario locality and age, fee/appointment nonclaims, unsupported/current requests, review expiry, prompt injection, personal identifiers, input limits and disabled provider. Check the actual served page in mobile widths 320/390 px, 200% zoom, tab order, focus, Bangla glyph rendering, reduced motion, offline links and screen-reader announcements. Browser/field performance and real-user comprehension have not been established by unit tests.

**Stage-5 next action:** Review PR #1, then stage-3 PR #2, then this stacked PR. Recheck official instruction wording and source dates; verify served ES modules, accessibility and mobile layout; obtain consented comprehension feedback. Do not deploy or activate a paid model without separate approval.
