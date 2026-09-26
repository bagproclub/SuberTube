# SuberTube — Project Authority

**Current task:** `RELEASE-CANDIDATE-BUILD-001`
**Status:** `AUTHORIZED / BOUNDED / CANDIDATE BUILD`
**Standard:** `MASTER GUIDE FINAL-5.12`

## Persistent gateway reference

`https://incredible-mooncake-21b036.netlify.app/`

This is the standing entry/gateway reference for the project chain. It is not the final product domain and does not force the final release artifact to be deployed there.

## Authority and source roles

```text
MASTER GUIDE FINAL-5.12
        ↓
SuberTube current project authority
        ↓
bounded Task Contract
        ↓
Working Source
        ↓
Verification Evidence
        ↓
Release Gate
        ↓
FINAL RELEASE ARTIFACT (once)
        ↓
Approved Deployment Target
```

## Current source

`/mnt/data/SuberTube-new/`

Role: **NEW CURRENT SOURCE**


## Open items carried forward — do not reopen completed gates

- Final custom domain: **NOT SELECTED**; the supplied Netlify URL remains the persistent gateway/reference.
- Production deployment of the new source: **NONE**.
- Browser/public runtime verification: **NOT VERIFIED until its own authorized gate**.
- Search/provider/API decisions outside the current bounded task: **OPEN / DEFERRED**.
- URL/network safety boundary: **DOCUMENTED / VERIFIED**.
- Web Header shell: **IMPLEMENTED / STATIC VERIFIED / BROWSER VERIFICATION NOT YET CLAIMED**.
- Search Entry: **IMPLEMENTED / STATIC VERIFIED / BROWSER VERIFICATION NOT YET CLAIMED**.
- YouTube IFrame feasibility: **IMPLEMENTED / STATIC VERIFIED / BROWSER VERIFICATION NOT YET CLAIMED**.
- Library / History: **IMPLEMENTED / STATIC VERIFIED / BROWSER VERIFICATION NOT YET CLAIMED**.
- Header 1.1-A / 1.1-B: **PROTECTED / PRODUCT CENTER / UNCHANGED**.
- Any future Header work requires a separate Header-specific Task Contract.

## Protected product center

Header 1.1-A / 1.1-B is protected and remains the product center. The bounded Header shell task is the only current task authorized to implement this protected surface from the supplied v0.1 reference. Unrelated tasks must not modify Header UI or interaction semantics.

## Current architecture direction

Web-first → browser verification → approved deployment target → Android wrapper later.

Retired/reference-only: old FastAPI, old Piped, old Worker experiments, old Android implementation, historical ZIPs.

## Current decisions

- Web-first direction: selected by project plan.
- Gateway reference: persistent Netlify URL recorded above.
- Current delivery/gateway target: **NETLIFY** (the supplied `*.netlify.app` gateway URL).
- Final custom domain: **NOT SELECTED**.
- Production deployment of the new source: **NONE**.
- Real secrets in source: **NONE**.

## Current Header continuity

The supplied `SuberTube — Header Design (v0.1)` remains the visual/reference authority for Header 1.1-A / 1.1-B. The current shell implements the bounded reference states. Search Entry uses the existing Header search control only as a focus trigger; Header visual/layout semantics remain protected. The bounded YouTube IFrame feasibility task adds Video URL Entry and official-player rendering without redesigning the Header.

## Release/artifact rule

Working source is the only implementation input. No development ZIP is created. A final release artifact is created once, after all applicable release gates pass, and its contents/integrity are verified before an approved deployment target is used.

## Persistent security/content hygiene rule — 2026-09-23

Unexpected foreign-language/script text that appears in source or control artifacts without documented purpose must be scanned, narrowly quarantined, provenance-checked, and removed only when confirmed unrelated/unauthorized.

This is **not** a blanket ban on multilingual content. Thai and Latin/English remain valid project languages. The control exists to detect unexpected script injection/provenance anomalies without damaging legitimate user-facing content.

Current baseline evidence: `EV-FOREIGN-CONTENT-002` = `PASS / 0 unexpected-script findings`.

## Gateway path

`https://incredible-mooncake-21b036.netlify.app/`

This URL is the persistent Netlify gateway/reference path requested for the project chain. It is not, by itself, proof of final custom-domain ownership or authorization to mutate DNS.


## Current bounded step — 2026-09-23

`SECURITY-VERIFICATION-001` = PASS / EVIDENCE RECORDED / STOP.

Header 1.1-A / 1.1-B remains PROTECTED / PRODUCT CENTER.

## Header notification continuity — 2026-09-23

The notification control shown in Header Design v0.1 is retained as a **visual shell state only** in the current Header. Its indicator/badge is not a claim of live notification data. Security Verification does not redesign or change Header 1.1-A / 1.1-B.

## Foreign-script hard-gate continuity — 2026-09-23

`FOREIGN-CONTENT-HARD-GATE-001` is now a persistent fail-closed control for source/control artifacts.

- Current project content languages: Thai + Latin/English.
- Cyrillic and other unexpected scripts are rejected by the security preflight unless separately authorized with documented purpose.
- The reported Cyrillic UI token was not present in the current Working Source, so no source file was deleted.
- External screenshots/UI surfaces are observation evidence only and are not modified as part of source hygiene.
- Regression test: `tests/foreign-content-hard-gate.test.mjs` = PASS.


## Local verification continuity — 2026-09-23

`LOCAL-VERIFICATION-001` = PASS / EVIDENCE RECORDED / STOP.

Local HTTP smoke and static regression checks passed. Browser/public runtime remains NOT VERIFIED because the execution environment could not complete a valid headless Chromium run. No deployment or release artifact is implied.



## Current bounded step — RELEASE-CANDIDATE-BUILD-001 — 2026-09-23

Status: `CANDIDATE BUILT / NOT FINAL / NOT PRODUCTION APPROVED`.

The release-candidate package includes the foreign-content hard gate, security preflight, release integrity/hash verification, tests, and the current Web Core source/control artifacts.

### Public deployment gate

`PUBLIC-DEPLOYMENT-VERIFICATION-001` is `BLOCKED / PUBLIC RUNTIME NOT VERIFIED`. The existing Netlify project is SSO-protected and an external public fetch returned HTTP 401. The current Netlify deploy is a manual drop deployment, but this execution cannot prove that its deployed bytes are the current `/mnt/data/SuberTube-new/` Working Source.

Final release remains blocked until the exact current source is publicly verifiable and the applicable Release Gate is approved.

### Header continuity

Header 1.1-A / 1.1-B = **PROTECTED / PRODUCT CENTER**.
The supplied Header Design v0.1 remains the visual/reference authority. No unrelated task may redesign or alter Header semantics.
