# কাগজসাথী: first working foundation

## Run

Requires Node 20+ for tests and Python 3 for the local server. No npm installation or third-party runtime dependency is needed.

```sh
npm test
python3 -m http.server 8000
```

Open http://localhost:8000 . Use an HTTP server rather than opening index.html directly, because JavaScript modules use browser origin rules.

## Scope

A preparation workspace for official paperwork. No identity document uploads required.

The interface mixes English guidance and short Bangla headings. Full localisation and real-user testing remain to be done. External official links are navigation links, not integrated data feeds or evidence that all content has been editorially verified.

## Data and privacy

No backend, analytics, AI provider, account system or uploads are configured. Grocery prices and job listings are synthetic demonstrations; flood status is always unavailable until an official adapter is connected. Paperwork content is a general preparation aid, not a verified official document list. Optional browser-local progress is recoverable by clearing site storage and is not backed up.

## Deployment handoff

Static files use relative asset paths and can run under a GitHub Pages project subpath. Serve index.html, styles.css, app.js, common.js, model.js and .nojekyll. No deployment or Pages settings change is made by this foundation. Stage 5 should configure publishing and verify the rendered site. Keep tests and planning documents in the repo; they do not contain secrets.

## Next work

- Review source content and connect permitted real data with timestamps.
- Add full Bangla/English localisation and test with users.
- Test rendered behaviour on mobile and keyboard navigation.
- Add advanced features only after the basic flow is reviewed.
- Model-backed AI requires a secure backend, provider access and an authorised budget.
