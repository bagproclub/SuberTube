# SuberTube — Private APK / No-API Build

## Purpose

This package is a private-use Android/WebView application built from the supplied SuberTube Web Core release-candidate source as the prototype baseline.

The implementation track for this package is explicitly **NO API** for YouTube discovery. The Android bundle is kept synchronized with the web source, and its local asset paths are relative so the bundled Web Core loads correctly through `WebViewAssetLoader`. The app does not use the YouTube Data API, scraping, proxy retrieval, direct media-stream extraction, audio/video separation, or a nested-iframe workaround.

## Main flow

```text
SUBERTUBE
   ↓
HEADER (PROTECTED)
   ↓
SEARCH
   ↓
Official YouTube Search surface inside Android WebView
   ↓
User selects a real YouTube video
   ↓
Android WebView navigation interceptor captures the YouTube video URL
   ↓
Video ID
   ↓
SuberTube local page
   ↓
Official YouTube IFrame
```

The important difference from the prototype is the Android routing layer: a normal HTTPS YouTube video navigation is intercepted before Android hands it to another application. The selected Video ID is then routed back into the bundled SuberTube page.

## Profile behavior

- Guest mode is the default.
- A user can add a local app profile name.
- A user can remove a local app profile.
- Removing the active profile returns the UI to Guest.
- No YouTube password, token, API key, or other credential is stored by the profile feature.
- This feature is an **app-local profile selector**, not a YouTube OAuth account manager.

## Playback

The video player remains the official YouTube IFrame player.

Implemented in the Android shell:

- Fullscreen handling through `WebChromeClient` custom-view callbacks.
- Hardware side-volume control routed to `STREAM_MUSIC`.
- Android Picture-in-Picture entry when a video page is active.
- Back navigation returns through the WebView history first.
- Non-HTTPS/custom-scheme top-level navigation is blocked.

Not claimed as fully verified:

- Guaranteed screen-off playback.
- Guaranteed OS-level background playback after the screen is locked.
- Removal or blocking of ads served by the official YouTube player.

Those behaviors require a separate feasibility/policy decision and are not implemented by extracting or modifying YouTube media.

## Netlify gateway decision

The supplied URL:

`https://incredible-mooncake-21b036.netlify.app/`

is retained as a project reference/gateway, but it is **not required for the private APK runtime**.

The APK bundles the SuberTube web source and serves it through AndroidX `WebViewAssetLoader` at:

`https://appassets.androidplatform.net/assets/index.html`

This avoids a dependency on the current Netlify SSO state. YouTube content itself is still fetched from YouTube over HTTPS.

## YouTube URLs used by the application

See `urls/youtube-url-map.md`.

## Build

Open the `android/` directory in a current Android Studio installation. The project targets Android API 36 and uses Android Gradle Plugin 9.4.0 with Gradle 9.6.0 compatibility. The environment used to create this package did not contain a local Android SDK/Gradle installation, so a signed APK binary is **not included** in this package.

## Verification

Run:

```text
npm test
npm run security
npm run integrity
```

The package is designed so development artifacts, APKs, AABs and `.git` metadata are excluded from the release source tree.

## Release position

This archive is a **private APK source package**. It is not a claim of public web production approval, and it does not claim that screen-off/background playback or YouTube ad-free playback has been verified.
