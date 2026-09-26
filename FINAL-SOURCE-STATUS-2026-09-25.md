# SuberTube — Final Source Status — 2026-09-25

## Source state

This archive is a source package for a private Android/WebView application. It is intended for the user to build and deploy independently.

## Implemented source boundaries

- Protected Header/reference shell retained.
- Empty Home/Search state retained.
- User query creates YouTube Search URL only on submit.
- Android WebView keeps YouTube discovery inside the app surface.
- Android intercepts supported YouTube video URLs and extracts an 11-character Video ID.
- Local bundled page receives the Video ID and renders the official YouTube IFrame.
- Guest/local profiles are independent from Google/YouTube credentials.
- Fullscreen and Android media-volume routing are implemented.
- PiP capability is implemented as best effort.
- Arbitrary external top-level navigation is blocked.
- `file://` access and mixed content are disabled.
- No API key, password, OAuth token, signing key, or other real secret is included.

## Verification performed in source environment

- JavaScript/static regression tests: expected to run with `npm test`.
- Security preflight: expected to run with `npm run security`.
- Release manifest/integrity: expected to run with `npm run integrity`.
- Malwarebytes URL reputation checks: recorded in `EVIDENCE-MALWAREBYTES-2026-09-25.md`.
- Current stable AndroidX WebKit is pinned to `1.17.1`.
- The Android runtime does not use the YouTube Data API, scraping, direct-media extraction, proxy playback, or player/ad modification.

## Not asserted as completed here

- APK build output.
- Physical-device validation.
- Guaranteed locked-screen/background playback.
- Removal/bypass of YouTube-served advertising.
- Real Google/YouTube account OAuth.
