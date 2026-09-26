# SuberTube — Final Implementation Index

## Prototype baseline

`SuberTube-Web-Core-Complete-Release-Candidate-2026-09-23.zip`

## Android runtime boundary

`android/app/src/main/java/com/subertube/app/MainActivity.java`

- bundled Web Core: `https://appassets.androidplatform.net/assets/index.html`
- YouTube discovery: `https://www.youtube.com/results?search_query={encoded-query}`
- selected video interception: validated YouTube HTTPS URL → 11-character Video ID
- playback: `https://www.youtube.com/embed/{VIDEO_ID}`
- Home: app-assets root → `/assets/index.html`

## Account/profile boundary

Local Guest / Add / Select / Remove profile names only. No Google credential or YouTube OAuth token is stored.

## External gateway

`https://incredible-mooncake-21b036.netlify.app/` is a reference/gateway URL only. The private APK runtime does not depend on it.

## Integrity / release discipline

No intermediate ZIPs are used by the implementation workflow. This package is produced as the final source/build archive after code, synchronization, tests, security scanning, foreign-content scanning, regression checks, and release-integrity verification.
