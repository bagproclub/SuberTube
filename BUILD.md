# SuberTube Android Build

## Toolchain

- Android Gradle Plugin: 9.4.0
- Gradle: 9.6.0
- JDK: 17
- compileSdk: 36
- targetSdk: 36
- minSdk: 26
- AndroidX WebKit: 1.17.1

AGP 9.4.0 requires Gradle 9.6.0 or newer and JDK 17. The project intentionally pins Gradle 9.6.0 in `gradle/wrapper/gradle-wrapper.properties`.

## Android Studio

Open the `android/` directory as the project root. Let Gradle sync, install the requested SDK components, then use the `app` run configuration or Build > Build APK(s).

## Command line

If your environment already has Gradle 9.6.0 installed:

```bash
gradle --version
gradle -p android :app:assembleDebug
gradle -p android :app:assembleRelease
```

A Gradle Wrapper JAR is intentionally not vendored in this archive. The project retains the official wrapper properties so Android Studio or a trusted development environment can generate/use its wrapper without introducing an unverified binary into the source package.

## Runtime acceptance

Building an APK is not device verification. After compilation, validate on an actual Android device/emulator:

1. App opens to local Home with an empty Search field.
2. Search creates the YouTube Search URL only after the user enters a query.
3. YouTube Search remains inside the WebView.
4. Selecting a watch/shorts/live URL is intercepted by Android and converted to an 11-character Video ID.
5. The Video ID returns to the local SuberTube page and loads the official YouTube IFrame.
6. Back/Home, fullscreen, hardware volume, and PiP are tested on device.
7. Screen-off/background behavior is recorded as observed; no guarantee is assumed.
