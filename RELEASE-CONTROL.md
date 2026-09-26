# SuberTube — Release Control

## Required lifecycle

GAP
→ Research
→ Evidence
→ Malwarebytes URL Reputation
→ Code / Config Change
→ Secret Scan
→ Foreign-content Scan
→ Tracker / Suspicious URL Review
→ Regression Test
→ Malwarebytes Re-check
→ Release Candidate
→ Release Integrity
→ Deployment URL Check
→ Malwarebytes Re-check
→ Real-use Monitoring
→ Final Source Archive

## Final-source rule

The final source archive is produced only after all source-side gates pass. Device/runtime gates are explicitly identified as deployment-time validation when they cannot be executed in the current environment.

## Security boundary

No real secrets belong in source, fixtures, screenshots, examples, ZIP archives, or documentation. Placeholders are allowed only when clearly marked as non-secret examples.

## YouTube boundary

The project uses the official YouTube web Search surface and official IFrame player. It does not use the YouTube Data API, scraping, direct-media extraction, proxy playback, or player/ad modification.

“Ad-free” in project communication must not be used to claim that YouTube-served advertising is technically removed or bypassed. The app shell itself does not inject advertisements.

## Device gate

The following require a real Android build and device/emulator evidence:

- APK compilation and installation
- Search → selection → local IFrame return
- Real playback
- Back/Home
- Fullscreen
- Hardware volume
- PiP
- Screen-off/background behavior
