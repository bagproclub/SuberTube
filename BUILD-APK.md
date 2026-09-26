# SuberTube — Build / Install

## Current package

This archive contains the final private Android source package. The Web Core is bundled under `android/app/src/main/assets/` and served with `WebViewAssetLoader`.

## Build in Android Studio

1. Open the `android/` directory as the Android Studio project.
2. Let Gradle sync complete using the project's Android Gradle Plugin / Gradle / JDK configuration.
3. Run the `app` configuration on a connected Android device or build a debug APK from the Build menu.
4. Install the generated APK on the device.

## Expected runtime flow

`SuberTube → Header → Search → Official YouTube Search inside the WebView → select a video → Android WebViewClient captures the HTTPS YouTube video URL → validated Video ID → bundled SuberTube page → Official YouTube IFrame`.

The Home/brand link is mapped by the Android navigation layer back to `/assets/index.html`, so it does not escape the bundled app origin.

## Important runtime limits

- Search is the real YouTube web Search surface rendered inside the app WebView. It is not a custom scraped result list.
- The package does not use the YouTube Data API, scraping, direct-media extraction, proxy playback, or YouTube ad-bypass logic.
- Guest/local profiles are app-local names only; they are not Google/YouTube OAuth accounts.
- Fullscreen and Android music-volume routing are implemented in the shell.
- PiP is implemented as a best-effort Android capability. Guaranteed locked-screen/background playback is not claimed.
- The official YouTube player's own advertising is not modified or bypassed.

## Source URL map

See `urls/youtube-url-map.md` for the exact YouTube and local-origin URLs used by the application.
