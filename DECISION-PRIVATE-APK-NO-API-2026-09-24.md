# SuberTube — Decision Record: Private APK / No API

Date: 2026-09-24

## Decision

For a private-use Android application, the implementation should use the supplied Web Core as the product source and add a thin Android WebView delivery shell.

YouTube discovery uses the real Official YouTube Search web surface inside the app WebView. No YouTube Data API, search scraping, backend proxy, direct-stream extraction, or provider-specific search adapter is added.

## Why the prototype failed

The prototype's browser-side Search handler performs a top-level navigation to:

`https://www.youtube.com/results?search_query=...`

A top-level handoff leaves the SuberTube document. On Android, an installed application that handles YouTube links can therefore become the destination.

The prototype's Video URL path is different: it validates the URL, resolves an 11-character Video ID, and creates a fixed-origin official IFrame. That path is already suitable as the playback boundary.

The correct P0 fix is therefore not to delete Search navigation. The smallest no-API change is to move the navigation control into the Android WebView layer:

```text
YouTube Search page
      ↓
user selects video
      ↓
WebViewClient URL interception
      ↓
YouTube Video ID
      ↓
SuberTube local page
      ↓
Official YouTube IFrame
```

## Domain decision

The Netlify URL is not needed by the private APK because the Web UI can be bundled into the APK and served through AndroidX `WebViewAssetLoader` using the reserved `appassets.androidplatform.net` origin.

This reduces dependence on hosting availability/SSO and keeps the app's own source local to the APK while retaining YouTube as the external media origin.

## Account decision

The profile control is local to SuberTube. It starts in Guest mode and allows add/remove/select of local profile names. No credentialed YouTube account integration is implied.

## Unsupported requirements retained as open feasibility items

- YouTube-served ad blocking/bypass: not implemented.
- Direct media extraction: not implemented.
- Audio/video separation: not implemented.
- Guaranteed screen-off playback: not verified.
- Guaranteed background playback: not verified.

## Evidence basis

- Supplied Web Core source package.
- Supplied Header Design v0.1 visual reference.
- Current Notion Current Master read-only context dated 2026-09-24.
- Google YouTube embedded-player documentation.
- Android WebView / WebViewAssetLoader / WebViewClient documentation.
