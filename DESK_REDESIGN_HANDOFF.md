# Guided service desk redesign

Project queue ID: `REPO-kagoj-sathi-bd` (stage-2 has not assigned an idea ID). Input: stage-2 repository register v1, stage-1 research bank v1 (neither contains a paperwork idea), and `main` at `289b420bcc3ded23f5d9219f8eb31d2936d8d528` on 2026-10-30. This is a visual and interaction redesign of the existing homepage, not a new official information source.

## User journey

Choose passport, birth registration or NID using a native radio group. Read the official service link and generic preparation prompts. Tick a four-step personal preparation list, switch services without mixing checkmarks, clear the current service's marks, and print. Passport visitors can open the existing scenario-specific, source-linked checklist and deterministic FAQ. An empty state appears before service selection. The printer is disabled until a service is chosen. Invalid or corrupt browser storage is ignored; when storage is unavailable, checkmarks work for the current visit only. No names, ID numbers, document scans, API calls or server are used. This homepage does not claim that generic preparation prompts are an authoritative checklist.

## Design change

Before: English-first generic hero, one select, two similar rounded cards and a single progress list. After: Bangla-first editorial masthead, explicit three-stage service desk, left-side numbered step rail, full-width radio service rows, official-source reading area and a lined preparation ledger. On mobile the step rail moves above the workspace and the service choices become compact rows. This is intentionally different from KajerSetu's career search/detail board, BazarTulona's market quote comparison and BonnaSotorko's historical bulletin. Other passport pages and their model/data logic are untouched.

## Verification and release limits

Run `npm test`, `npm run build`, and `node --check app.js`. Serve `dist/` using `python3 -m http.server 8000 --directory dist`; inspect at 320, 390 and 1280 CSS px, 200% zoom, keyboard radio navigation and focus, Bangla glyphs, reset, saved progress, storage blocked, print and no-JS official links. Confirm `passport-guide.html` and `assistant.html` still work and compare visually with the other sites. Aim for homepage HTML+CSS+JS+model under 35 KiB uncompressed. Automated tests do not prove WCAG 2.2 AA. Official source links are navigation only; no live fees, rules, eligibility, application submissions or current government affiliation. Public GitHub issue links create drafts only and explicitly warn against private data. Stage 5 must verify the served page and editorial sources before any release. Do not merge or deploy from this coding stage.
