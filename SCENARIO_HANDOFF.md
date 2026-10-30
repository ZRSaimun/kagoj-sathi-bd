# Passport scenario handoff — stage 4

Project ID: `REPO-kagoj-sathi-bd` (stage-2 shared ID not yet assigned).
Input: stage-4 question guide draft PR #3 at `99fbc8077dd292ce674cd238b8f107f89de40532`, based on stage-3 PR #2 (`e2fe27c9f515930b178772d37143d0301943a5f7`), which depends on foundation PR #1.
Output branch: `stage4/passport-scenario-handoff`. This branch is stacked on PR #3; it does not edit upstream branches.

## User task

After choosing applicant location, age band and request type in the Bangla/English FAQ, open the corresponding preparation checklist without re-entering the three choices. A complete, valid selection is passed as a versioned URL **fragment**, not a query string. The checklist validates all values against the same stage-3 allowlist, fills the selects, generates the list, and tells the visitor to check the carried choices. Incomplete choices keep a plain checklist link. Any unknown, duplicate, extra, malformed or oversized fragment is ignored. Editing a select hides the old result and the carried-choice notice.

Only three coarse, pre-defined choices are encoded: location (inside Bangladesh / mission), age band, and request type. **No question text, name, NID, passport number, document, OTP or application is transferred.** Fragments are not sent in HTTP requests, but can remain in browser history, be visible to someone with the link, or be included in voluntary sharing. The UI discloses this. There is no browser storage, backend, provider request, analytics or automatic sharing. A static no-JavaScript checklist and official links remain available.

This is not an AI model or live official rule check. The reviewed FAQ and checklist retain their original source, expiry and safety warnings. No new requirements or fees were introduced.

## Reproduce and checks

Run `npm test`, `node --check assistant.js`, `node --check passport-guide.js` and `node --check scenario-link.js`. Serve the repository with `python3 -m http.server 8000`; open `http://localhost:8000/assistant.html`, select all three fields and ask `What documents do I prepare?`. The answer's checklist link and sidebar link should open a matching, generated checklist with the carried-choice notice. Test missing selections, a tampered `#v=1...` fragment, changing a selection, browser back, no-JavaScript links, print, 320/390px and 200% zoom, keyboard focus, screen-reader status, reduced motion and Bangla glyphs. These served-browser checks are required before release, not implied by unit tests.

The seven added Node tests cover all 18 valid combinations, partial selections, invalid and duplicated keys, unknown versions, oversized fragments, prototype-like keys, source integration and JavaScript syntax for both browser pages. No runtime dependencies or paid services were added.

## Research and release limits

- [MDN: URI fragments](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment) — fragments are processed client-side and not sent in HTTP requests.
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) — standardized parsing, including duplicate-key behavior.
- [W3C WCAG 2.2 updates](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — focus and accessible navigation review guidance.

Checked 2026-10-30. No external runtime dependency, API key, source scraping, paid AI, data feed or licence-restricted asset is introduced. Static hosting is sufficient. GitHub Actions validates JavaScript and model behavior, not actual served-page browser accessibility, mobile field performance or source accuracy.

**Stage 5:** Review foundation PR #1 → stage-3 PR #2 → stage-4 PR #3 → this PR in order. Verify the exact-head CI and served browser behavior, official instructions and review dates, privacy wording, print/no-JS fallback and accessibility before considering release. No production merge/deployment is authorised by this stage.
