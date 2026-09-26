# SuberTube — User Deployment Handoff

This project is intended for the user to build and install independently.

## 1. Prepare Android Studio

Use an Android Studio installation with:

- JDK 17
- Android SDK 36
- SDK Build Tools 36.0.0
- Network access to Google Maven and Maven Central

AGP 9.4.0 and its Gradle/JDK compatibility are documented in `docs/RESEARCH-2026-09-25.md`.

## 2. Open the Android project

Open the `android/` directory as the Android Studio project root.

Allow Gradle sync to resolve:

`androidx.webkit:webkit:1.17.1`

## 3. Build

Use Build > Build APK(s), or a Gradle 9.6.0 environment:

```bash
gradle -p android :app:assembleDebug
gradle -p android :app:assembleRelease
```

The produced APK remains outside this source archive until the user builds it locally.

## 4. Device acceptance flow

```text
Open SuberTube
↓
Home / Search is empty
↓
Type a query
↓
YouTube Search stays inside WebView
↓
Select a video
↓
Android intercepts the YouTube video URL
↓
Validate 11-character Video ID
↓
Return to local SuberTube
↓
Official YouTube IFrame plays
↓
Back / Home
↓
Fullscreen
↓
Hardware volume
↓
PiP
↓
Observe screen-off/background behavior
```

## 5. Final security handoff

Before real use, scan the actual deployed URL with Malwarebytes again. Do not submit credentials, API keys, OAuth tokens, signing keys, or other secrets to the reputation checker.
