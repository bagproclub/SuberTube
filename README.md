SuberTube — Current Project State (README)

> ชั้นเอกสาร: ไฟล์นี้คือ Current Project State — สถานะจริงของโปรเจกต์ ณ วันที่อัปเดตล่าสุด
เป็นเอกสารชั้นล่างสุดของ chain ตาม MASTER GUIDE (One canonical home — เรื่องเดียวมีแหล่งหลักเดียว)

📚 Documentation Chain (ลำดับเอกสาร)

```text
MASTER GUIDE FINAL-5.5                    ← มาตรฐานกลาง ใช้ได้กับหลายโปรเจกต์ในอนาคต
  ↓
Mobile Quick Reference FINAL-5.5          ← ใช้กับโปรเจกต์ใกล้เคียงที่เน้นมือถือ
  ↓
SuberTube Project Reference FINAL-5.5     ← เฉพาะโปรเจกต์ SuberTube (รวม Reference Image handling)
  ↓
Current Project State (README นี้)        ← สถานะปัจจุบันของโปรเจกต์เท่านั้น
```

ข้อกำหนดการใช้เอกสาร:
- รูปภาพอ้างอิง (Reference Image) ใช้เฉพาะกับโปรเจกต์ SuberTube เท่านั้น → `assets/subertube-project-reference.jpg`
- เอกสารรอง (Mobile Quick Reference) ใช้กับโปรเจกต์ใกล้เคียงที่เน้นมือถือ
- เอกสารหลัก (MASTER GUIDE) นำไปประยุกต์ใช้กับหลายโปรเจกต์ในอนาคตได้
- กฎสำคัญ (MASTER GUIDE #13): Reference Image ไม่ใช่หลักฐานว่า feature มีอยู่จริง — ทุก feature ต้องยืนยันด้วย Current State ก่อน

---

🚧 Explicit Project Isolation (กฎ #9)

- ห้ามนำ requirements, variables, architecture, credentials, assumptions หรือ decisions จากโปรเจกต์อื่นมาใช้กับ SuberTube โดยไม่มี current project authority
- ห้ามนำเนื้อหาของ SuberTube ไปผูกกับเอกสารมาตรฐานกลาง (MASTER GUIDE เป็นมาตรฐาน ไม่ใช่ project state)
- ทุกการตัดสินใจที่มีผลต่อระบบ ต้องมีแหล่งอ้างอิงในโปรเจกต์นี้ หรือถามผู้ใช้ (Human Authority) ก่อน

---

1. Project Scope / System Overview

SuberTube — Android App (WebView + Web Core) สำหรับค้นหาและเล่นวิดีโอ YouTube โดยเฉพาะ

สโลแกน: "เรียบง่าย ปลอดภัย ไร้โฆษณา ควบคุมได้"

คุณสมบัติหลัก (ตาม Scope): ปลอดโฆษณา (Ad-Free) · ปลอดภัย (Secure) · ป้องกันมัลแวร์ (Anti-malware) · ป้องกันตัวติดตาม (Anti-tracking) · ไม่มีค่าลับในโค้ด (No Secrets — ใช้ placeholder เท่านั้น)

หลักการสถาปัตยกรรม — No-API Build (ยืนยันแล้วจากซอร์ส):
แอป ไม่ใช้ YouTube Data API, ไม่ scraping, ไม่ใช้ proxy retrieval, ไม่ดึง media-stream โดยตรง, ไม่แยก audio/video, ไม่มี nested-iframe workaround — การค้นพบวิดีโอใช้ผิวการค้นหา YouTube อย่างเป็นทางการผ่าน Android WebView เท่านั้น

Flow การทำงานของระบบ:

```text
เปิด SuberTube (Android App)
  ↓
หน้า Home (ค้นหา = ว่าง)
  ↓
ผู้ใช้พิมพ์คำค้น
  ↓
YouTube Search (WebView)
  ↓
ผู้ใช้เลือกวิดีโอ
  ↓
Android Intercept (ดัก URL และตรวจสอบ)
  ↓
Validate Video ID (ตรวจ 11 ตัวอักษร)
  ↓
กลับเข้า SuberTube (Player State — เล่นใน IFrame)
```

จุดที่ต่างจากเว็บต้นแบบ: ระดับ Android routing — navigation ของ YouTube ปกติถูกดัก (intercept) ก่อนระบบส่งต่อให้แอพอื่น แล้ว Video ID ถูกส่งกลับเข้าหน้า SuberTube ในเครื่อง

ระบบ Profile (Local): Guest (ใช้งานได้ทันที) / Add / Select / Remove — เก็บเฉพาะในเครื่อง ไม่ผูกบัญชี YouTube ไม่มีบัญชีผู้ใช้ระยะไกล ไม่เก็บรหัสผ่าน/token/API key ใดๆ

---

2. สถานะการยืนยันจากซอร์สจริง (Verified Status — ตรวจจากโค้ด 2026-09-29)

> ส่วนนี้คือสถานะ Current State จริง แยกจาก Reference Image (กฎ #13)

Feature	สถานะ	หลักฐาน	
URL Intercept + Validate Video ID 11 ตัวอักษร	PASS	`MainActivity.java` — รองรับ watch/shorts/live/embed/attribution_link, บล็อก non-HTTPS scheme ทั้งหมด	
Web Core โหลดผ่าน WebViewAssetLoader	PASS	`https://appassets.androidplatform.net/assets/index.html` (โดเมนในเครื่อง มาตรฐาน AndroidX)	
Fullscreen ผ่าน WebChromeClient custom-view	PASS	`SuberTubeChromeClient` ใน MainActivity.java	
ปุ่มเสียงฮาร์ดแวร์ → STREAM_MUSIC	PASS	`setVolumeControlStream` ใน onCreate	
PIP (Picture-in-Picture)	PASS (เฉพาะ Android O+)	`enterPictureInPictureMode` เมื่อวิดีโอเปิดอยู่	
Back navigation ผ่าน WebView history ก่อน	PASS	`onBackPressed`	
บล็อก top-level navigation ที่ไม่ใช่ HTTPS	PASS	`handleNavigation()`	
Guest + Add/Remove local profile	PASS	โครงสร้างใน `index.html` + เอกสารยืนยันไม่เก็บ credentials	
Screen-off playback (เล่นต่อเมื่อจอปิด)	NOT VERIFIED	ระบุชัดในเอกสารว่าไม่ยืนยัน	
OS-level background playback หลังล็อกจอ	NOT VERIFIED	ระบุชัดในเอกสารว่าไม่ยืนยัน	
บล็อก/ลบโฆษณาจาก YouTube player อย่างเป็นทางการ	NOT VERIFIED	ต้องตัดสินใจ feasibility/policy แยก ห้ามอ้างจากรูป	
YouTube Data API / scraping / proxy	NOT APPLICABLE	ตัดสินใจแล้วว่า No-API — ไม่มีในระบบ	

---

3. Header Design (v0.1) — สถานะ NOT VERIFIED

ดีไซน์จาก Reference Image: โลโก้ 16dp · ไอคอนห่างกัน 12dp (แจ้งเตือน/ค้นหา/โปรไฟล์/ตั้งค่า)
⚠️ ยังเป็นเพียง design intent — ต้องตรวจกับ build จริงก่อนประกาศ PASS

สิ่งที่ยืนยันแล้วจากซอร์ส (`web/public/index.html`): มี header ปุ่มแจ้งเตือน + ปุ่มค้นหา + ปุ่มโปรไฟล์ (avatar สีตามธีม) — ส่วนไอคอน gear ⚙ ยัง NOT VERIFIED

---

4. ระบบ Profile (Local)

การทำงาน	สถานะ	หมายเหตุ	
Guest ใช้งานทันที	PASS	ค่าเริ่มต้น	
เพิ่ม/ลบโปรไฟล์ในเครื่อง	PASS	ไม่เก็บ credentials ใดๆ	
เลือกโปรไฟล์	PASS		
ลบโปรไฟล์ที่ใช้อยู่ → กลับ Guest	NOT VERIFIED	ต้องทดสอบบนอุปกรณ์จริง	
Sync ข้ามเครื่อง	NOT APPLICABLE	ออกแบบให้ local-only	

---

5. เส้นทาง URL (URL Map)

ส่วน	URL รูปแบบ	ใช้งานเมื่อ	
Home (Local)	`https://appassets.androidplatform.net/assets/index.html`	เปิดแอพ (โดเมนในเครื่องของ WebViewAssetLoader — ไม่ได้ออกเน็ต)	
Search	`https://www.youtube.com/results?search_query={query}`	กดค้นหา	
Watch	`https://www.youtube.com/watch?v={VIDEO_ID}`	ดัก URL	
Shorts	`https://www.youtube.com/shorts/{VIDEO_ID}`	ดัก URL	
Live	`https://www.youtube.com/live/{VIDEO_ID}`	ดัก URL	
Embed (Player)	`https://www.youtube.com/embed/{VIDEO_ID}`	เล่นใน IFrame	
youtu.be	`https://youtu.be/{VIDEO_ID}`	ดัก URL (รองรับแล้วในซอร์ส)	

Validate Video ID: รูปแบบ 11 ตัวอักษร `[A-Za-z0-9_-]{11}` ก่อนเข้าสู่ Player State (ยืนยันแล้วจาก `normalizeVideoId()`)

---

6. ความปลอดภัย (Security & Privacy)

หลักการ	สถานะ	หลักฐาน	
ไม่มีค่าลับในโค้ด	PASS	Secret scan 2026-09-29: gradle.properties, package.json, MainActivity.java, index.html สะอาด	
บล็อก navigation ที่ไม่ใช่ HTTPS	PASS	handleNavigation() บล็อก intent://, market://, tel:, mailto: ฯลฯ	
WebView hardening	PASS	setAllowFileAccess(false), setGeolocationEnabled(false), setDatabaseEnabled(false), MIxED_CONTENT_NEVER_ALLOW	
Security preflight	PASS (เครื่องมือพร้อม)	`tools/security-preflight.mjs` — สแกน foreign script, invisible control, secret, injection marker, forbidden network API, Android bridge	
Response headers / CSP	BLOCKED	ต้องสร้าง `web/public/_headers` ให้ครบตามเกณฑ์ preflight ก่อน	
Malwarebytes scan	PASS	หลักฐาน: `docs/04-security/EVIDENCE-MALWAREBYTES-2026-09-25.md`	

URL ภายนอกที่ปรากฏในเอกสาร/ซอร์ส (ต้องผ่าน Malwarebytes URL Reputation ทุกครั้งก่อนปล่อย)
- `appassets.androidplatform.net` — โดเมนจำลองมาตรฐานของ AndroidX WebViewAssetLoader (Safe)
- `youtube.com`, `youtu.be` — โดเมนปลายทางตามออกแบบ (Safe)
- `incredible-mooncake-21b036.netlify.app` — reference/gateway เก่า ไม่ใช่ runtime dependency ตามดีซิชัน No-API (ตรวจซ้ำทุกรอบปล่อย)

---

7. Workflow + QA + Malwarebytes (12 ขั้น)

```text
 1. GAP  2. Research  3. Evidence  4. Malwarebytes URL Reputation
 5. Code/Config (เฉพาะ GAP)  6. Secret + Foreign Scan  7. Regression Test
 8. Malwarebytes Re-check  9. Release Candidate  10. Release Integrity
11. Deployment URL Check  12. Real-use Monitoring
→ HUMAN RELEASE APPROVAL ทุกครั้ง
```

---

8. โครงสร้างเอกสารและโค้ด (หลัง Cleanup 2026-09-29)

```text
├── README.md                        ← ไฟล์นี้ (Current Project State)
├── SuberTube-Project-Reference-FINAL-5.5.md
├── CLEANUP-MANIFEST.md / CLEANUP-MANIFEST-REPO-2026-09-29.md
├── docs/ (01-overview … 07-templates)
├── android/                         ← Gradle project (สร้าง APK)
│   └── app/src/main/{AndroidManifest.xml, java/com/subertube/app/MainActivity.java, res/…}
├── web/public/                      ← Web core (index.html, app.js, _headers)
├── tools/                           ← security-preflight.mjs, run-tests.mjs, release-integrity.mjs
├── package.json
├── .github/workflows/android-build.yml
└── assets/subertube-project-reference.jpg
```

---

9. Evidence / Current-State / Status Model

สถานะ	ความหมาย	
PASS	ตรวจแล้วด้วยหลักฐาน (โค้ด/เอกสาร/การทดสอบ)	
FAIL	ตรวจแล้ว ไม่ผ่าน ต้องแก้	
BLOCKED	รอ dependency/อนุมัติ/ข้อมูล	
NOT VERIFIED	ยังไม่มีหลักฐานเพียงพอ (ค่าเริ่มต้นของทุกสิ่งจาก Reference Image)	
NOT APPLICABLE	ไม่เกี่ยวข้อง (เช่น YouTube API — ตัดสินใจแล้วว่าไม่ใช้)	

กฎ: ห้ามใช้ PASS โดยไม่มีหลักฐาน · รูปกับ Current State ขัดกัน → ยึด Current State แล้วเปิด GAP

---

10. Human Review — Release Gate

```text
CURRENT GITHUB → ยืนยัน CLEANUP MANIFEST → DELETE/REPLACE → RE-SCAN ทั้ง repo
→ URL RECHECK → LEGACY FINGERPRINT → DUPLICATE ✓ → MALFORMED TREE ✓
→ SECRET ✓ → FOREIGN/INVISIBLE ✓ → HUMAN RELEASE APPROVAL
```

รายละเอียด: `CLEANUP-MANIFEST.md` · ผลตรวจ repo ล่าสุด: `CLEANUP-MANIFEST-REPO-2026-09-29.md`

---

> อัปเดตล่าสุด: 29 กันยายน 2026 (รวมเนื้อยืนยันจากซอร์สจริง + ผล cleanup repo รอบที่ 1 + Workflow Law ฉบับปรับปรุง)
หลักการสุดท้าย: ค้นหาหลักฐานจากเอกสารมาประกอบการตัดสินใจ — มนุษย์เป็นผู้อนุมัติขั้นสุดท้าย (กฎ #1 ปรับปรุงใหม่) — Evidence over assertion