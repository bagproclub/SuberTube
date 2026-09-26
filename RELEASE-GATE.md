# SuberTube Release Gate — 2026-09-25

## Source release state

`SOURCE-FINAL / USER-DEVICE-VALIDATION-PENDING`

The source-side release gates below are complete in this archive. APK compilation and device validation are intentionally delegated to the user's own Android build environment.

## Passed source gates

- GAP review and source-side remediation complete for the current navigation path.
- Home starts with an empty search state; stray query parameters are canonicalized away, except a valid `video` parameter used for player state.
- Search creates the official YouTube Search URL only after the user submits a non-empty query.
- Android keeps allowed YouTube discovery navigation inside the WebView.
- Supported YouTube video URLs are intercepted and reduced to an 11-character Video ID before returning to the local app page.
- Official YouTube IFrame boundary retained.
- Guest/local profile behavior retained; no YouTube credentials are stored.
- Mixed content, file access, arbitrary external top-level navigation, and non-HTTPS schemes are blocked.
- AndroidX WebKit is pinned to current stable `1.17.1`.
- WebView renderer crash recovery is implemented via `onRenderProcessGone`.
- Static regression suite: PASS.
- Security preflight: PASS.
- Foreign-content scan: PASS.
- Malwarebytes URL reputation checks recorded and rechecked; `unknown` is not treated as safe.
- Source integrity manifest: PASS.

## User-device gates

These cannot be truthfully marked PASS in the current environment:

1. Compile the Android project into an APK.
2. Install on a physical device/emulator.
3. Verify Search → selection → intercepted Video ID → local IFrame playback.
4. Verify Back/Home, fullscreen, hardware volume, and PiP on device.
5. Observe and record screen-off/background behavior.
6. Re-check the user's actual deployment URL with Malwarebytes immediately before real use.

## YouTube boundary

This package does not use the YouTube Data API, scraping, direct-media extraction, proxy playback, or player/ad modification. The official YouTube player's own advertising is not removed or bypassed by this source package; the app shell itself does not inject advertisements.
