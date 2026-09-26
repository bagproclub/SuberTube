# SuberTube — Private APK No-API Release Contents

This final archive is the final source/build package for a private Android APK. It contains the Web Core, Android WebView shell, automated tests, security/integrity tooling, evidence/decision notes, and the official YouTube URL map.

## Runtime architecture

- Local Web Core is bundled into the APK under `android/app/src/main/assets/`.
- Android serves the local app at `https://appassets.androidplatform.net/assets/index.html` using AndroidX WebViewAssetLoader.
- YouTube discovery remains on the official YouTube HTTPS origin inside the same WebView.
- When a real YouTube video URL is selected, Android extracts only the 11-character Video ID and routes it back to the local SuberTube page.
- The local page creates the official `https://www.youtube.com/embed/VIDEO_ID` iframe.

## Deliberate exclusions

No YouTube Data API, scraping, direct-stream extraction, proxy retrieval, audio/video separation, nested-iframe workaround, YouTube ad blocking/bypass, credential storage, or external app launch intent is included.

## Android capabilities

- Guest-first local profile selector (add/select/remove local profile names).
- Official YouTube IFrame fullscreen callback support.
- Hardware volume routed to the Android music-volume stream.
- Best-effort Android Picture-in-Picture entry while a video is active.
- Back navigation remains inside the WebView history before exiting.
- Non-HTTPS and external top-level schemes are blocked.

Screen-off/background playback is not claimed as guaranteed because it depends on the official YouTube player, WebView lifecycle, Android power policy, and device/runtime behavior.

## Home routing correction

The Android navigation layer explicitly maps the bundled `appassets.androidplatform.net` root (`/`) back to `/assets/index.html`. This closes the previous Home/brand routing gap without changing the protected Header semantics.

## Build note

The execution environment used to assemble this archive does not include a local Android SDK or Gradle distribution, so no compiled/signed APK binary is included. Open `android/` in a current Android Studio installation and build there. The project uses AGP 9.4.0, Gradle 9.6.0 compatibility, JDK 17, compile/target SDK 36, and `androidx.webkit:webkit:1.17.0`.

## Verification

Before packaging, the final working source was checked with: `npm test`, security preflight, release-integrity validation, foreign-script scan, invisible/bidi/control scan, secret scan, unsafe DOM/runtime marker scan, unsafe Android bridge/external-launch scan, and forbidden release artifact scan.
