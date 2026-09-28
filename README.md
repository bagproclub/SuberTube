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
- รูปภาพอ้างอิง (Reference Image) ใช้เฉพาะกับโปรเจกต์ SuberTube เท่านั้น
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

SuberTube — Android App สำหรับค้นหาและเล่นวิดีโอ YouTube โดยเฉพาะ

สโลแกน: "เรียบง่าย ปลอดภัย ไร้โฆษณา ควบคุมได้"

คุณสมบัติหลัก (ตาม Scope):
- ✅ ปลอดโฆษณา (Ad-Free)
- ✅ ปลอดภัย (Secure) — ผ่านกระบวนการ Malwarebytes
- ✅ ป้องกันมัลแวร์ (Anti-malware)
- ✅ ป้องกันตัวติดตาม (Anti-tracking)
- ✅ ไม่มีค่าลับในโค้ด (No Secrets — ใช้ placeholder เท่านั้น)

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

ระบบ Profile (Local): Guest (ใช้งานได้ทันที) / Add (เพิ่มโปรไฟล์) / Select (เลือกโปรไฟล์) / Remove (ลบโปรไฟล์)

> เก็บข้อมูลเฉพาะในเครื่อง ไม่ผูกกับบัญชี YouTube ไม่มีบัญชีผู้ใช้ระยะไกล

---

2. UI Flow (ลำดับหน้าจอหลัก)

ขั้น	หน้าจอ	รายละเอียด	
1	หน้า Home	ค้นหา = ว่าง (ช่องค้นหาว่าง, ปุ่มค้นหา)	
2	ไล่ค้น	YouTube Search (WebView)	
3	ผลการค้นหา	แสดงใน WebView	
4	เล่นวิดีโอใน IFrame	กลับเข้าแอพ (Player State)	

---

3. Header Design (v0.1)

```text
[Logo SuberTube] 16dp |  SuberTube  |  🔔 12dp  🔍 12dp  [Profile] 12dp  [Gear ⚙] 12dp
```

- ระยะห่างไอคอนแต่ละตัว: 12dp
- ขอบโลโก้: 16dp
- สถานะ: ดีไซน์ v0.1 — ยังไม่ยืนยันเป็น feature จริง (ต้องตรวจสอบกับ Current State ก่อนใช้งานจริง ตามกฎ #13)

---

4. ระบบ Profile (Local)

การทำงาน	คำอธิบาย	
Guest	ใช้งานได้ทันที ไม่ต้องล็อกอิน	
Add	เพิ่มโปรไฟล์ (เก็บในเครื่อง)	
Select	เลือกโปรไฟล์	
Remove	ลบโปรไฟล์	

ข้อจำกัด: ข้อมูลอยู่เฉพาะในเครื่อง ไม่มีการ sync ข้ามเครื่อง ไม่ผูกบัญชี YouTube

---

5. ระบบเพลเบ็ค & การควบคุม (Playback & OS Integration)

คุณสมบัติ	สถานะใน Reference	หมายเหตุ	
เล่น/หยุด ใน IFrame	✅ ออกแบบไว้	ยืนยันกับ Current State	
ปุ่มข้าม เพิ่ม/ลดเสียง	⚠️ Hardware	ใช้ปุ่มฮาร์ดแวร์ของเครื่อง	
Fullscreen (เต็มจอ)	✅ ออกแบบไว้		
PIP (เล็กลง)	✅ ออกแบบไว้	Picture-in-Picture	
ปิดจอไม่ได้ (พับหลัง)	✅ ออกแบบไว้	เล่นต่อเมื่อจอปิด	
เล่นเสียงเมื่อจอหลับ	✅ ออกแบบไว้	Background play	
แจ้งเตือน/เล่นต่อ	✅ ออกแบบไว้	Media notification	

> ⚠️ ทุกข้อในตารางนี้เป็น สิ่งที่ออกแบบไว้ใน Reference Image ยังไม่ใช่หลักฐานว่าทำงานจริง — ต้องผ่าน QA ก่อนประกาศ PASS

---

6. เส้นทาง URL (URL Map)

ส่วน	URL รูปแบบ (ตัวอย่าง)	ใช้งานเมื่อ	
Home (Local)	`/assets/index.html`	เปิดแอพ	
Search	`https://www.youtube.com/results?search_query={query}`	กดค้นหา	
Watch	`https://www.youtube.com/watch?v={VIDEO_ID}`	ดัก URL	
Shorts	`https://www.youtube.com/shorts/{VIDEO_ID}`	ดัก URL	
Live	`https://www.youtube.com/live/{VIDEO_ID}`	ดัก URL	
Embed (Player)	`https://www.youtube.com/embed/{VIDEO_ID}`	เล่นใน IFrame	

Validate Video ID: ตรวจรูปแบบ 11 ตัวอักษร ก่อนอนุญาตให้เข้าสู่ Player State

---

7. ความปลอดภัย (Security & Privacy)

หลักการ	การทำ	
ไม่มีค่าลับในโค้ด	ใช้เฉพาะ placeholder เท่านั้น	
บล็อกโฆษณา	ผ่าน WebView / Network rules	
ป้องกันมัลแวร์ / ตัวติดตาม	ใช้ Malwarebytes เป็นประจำ	
ตรวจสแกนไฟล์ / โค้ด	ทุกครั้งที่เพิ่มไฟล์ใหม่	

Malwarebytes Integration Guide
- ✅ สแกนไฟล์ในโปรเจกต์
- ✅ ตรวจมัลแวร์ / PUP
- ✅ ตรวจ tracker / suspicious (แบบทดลอง Malwarebytes)
- ✅ ใช้วินโดวส์ในกลุ่ม
- ✅ ตรวจความสะอาด (ทุกครั้งที่เพิ่มไฟล์)

---

8. ขั้นตอนการทำงาน (Workflow + QA + Malwarebytes)

```text
 1. GAP              ระบุปัญหา / ระบุข้อยกเว้น
 2. Research         ค้นคว้า / ตรวจสอบกฎ
 3. Evidence         บันทึกหลักฐาน
 4. Malwarebytes     ตรวจ URL/โดเมน URL Reputation → ผล: Safe/Unknown/Malicious
 5. Code/Config      แก้ไขเฉพาะ GAP ไม่ใช่ทั้งไฟล์
 6. Secret Scan      สแกนค่าลับ + สแกนไฟล์แปลกปลอม + ตรวจ tracker
 7. Regression Test  ทดสอบซอฟต์แวร์ / ทดสอบออนไลน์ / ทดสอบเน็ตช้า
 8. Malwarebytes     ตรวจซ้ำหลังแก้ + ตรวจระยะไกล → ต้อง Safe/Unknown
 9. Release Candidate สร้างเวอร์ชันทดสอบ ตรวจความครบถ้วน
10. Release Integrity ตรวจไฟล์สุดท้าย ไม่มีลับ ไม่มีมัลแวร์
11. Deployment       ตรวจ URL ที่ค้นหา ซ่อนในโปรเจกต์ ด้วย Malwarebytes URL Check
12. Real-use         ติดตามการใช้งาน ตรวจจับมัลแวร์ ตรวจ log/พฤติกรรม
```

> หมายเหตุ: ก่อนปล่อย (Release) ทุกครั้ง ต้องผ่าน HUMAN RELEASE APPROVAL — ผู้ใช้เป็นผู้สั่งและอนุมัติก่อนเสมอ (ดู CLEANUP-MANIFEST.md)

---

9. โครงสร้างเอกสาร (Documentation Structure)

```text
/docs
├── 01-overview/      ← ภาพรวมโปรเจกต์
├── 02-workflow/      ← ขั้นตอนการทำงาน
├── 03-url-map/       ← เส้นทาง URL
├── 04-security/      ← มาตรฐานความปลอดภัย
├── 05-release/       ← การปล่อยเวอร์ชัน
├── 06-testing/       ← การทดสอบ
└── 07-templates/     ← เทมเพลต
```

หลักการจัดเอกสาร:
- โลกภายนอก (Generic Master Guide): แนวทางการพัฒนาแบบไม่ผูกโปรเจกต์ / มาตรฐานความปลอดภัย / แนวทาง Best Practice / ใช้กับหลายโปรเจกต์ได้
- โลกภายใน (Project Control — SuberTube): โครงสร้างไฟล์ของ SuberTube / UI Flow + URL + Playback / Security Checklist (Malwarebytes) / แผนการทดสอบและ Regression / ใช้ควบคุมเฉพาะโปรเจกต์นี้

---

10. สรุปผลการทำงานที่สำคัญ (Summary)

- ✅ ป้องกันมัลแวร์ / ตัวติดตาม (ใช้ Malwarebytes)
- ✅ ไม่มีค่าลับในโค้ด (ใช้เฉพาะค่าตัวอย่าง)
- ✅ คนพิมพ์เฉพาะผู้ใช้พิมพ์
- ✅ กลับเข้าแอพและเล่นใน IFrame
- ✅ คนสั่งและอนุมัติก่อนปล่อย
- ✅ ปิดจอไม่ได้ / เล่นข้างหลัง
- ✅ ปุ่มข้าม / เพิ่มเสียงได้
- ✅ พร้อมขึ้นไปใช้ระดับนานาชาติ

---

11. Evidence / Current-State / Status Model

นิยามสถานะ (ใช้ให้ตรงกันทั้งโปรเจกต์)

สถานะ	ความหมาย	
PASS	ตรวจสอบแล้วด้วยหลักฐาน ผ่านตามเกณฑ์	
FAIL	ตรวจสอบแล้ว ไม่ผ่านเกณฑ์ ต้องแก้ไข	
BLOCKED	ไม่สามารถดำเนินการต่อได้ (รอ dependency / รออนุมัติ / รอข้อมูล)	
NOT VERIFIED	ยังไม่ได้ตรวจสอบ หรือตรวจแล้วแต่ไม่มีหลักฐานเพียงพอ	
NOT APPLICABLE	ไม่เกี่ยวข้องกับงานนี้ / ไม่ต้องใช้ใน context นี้	

กฎการใช้สถานะ
- ห้ามใช้ PASS ถ้าไม่มีหลักฐาน (Evidence over assertion)
- สิ่งที่มาจาก Reference Image เริ่มต้นที่ NOT VERIFIED เสมอ จนกว่าจะยืนยันกับ Current State
- ทุก feature ต้องระบุ: หลักฐานที่ใช้ตรวจ / วิธีตรวจ / ผู้ตรวจ / วันที่

Reference Image Handling (กฎ #13)

> Reference Image ไม่ใช่หลักฐานว่า feature มีอยู่จริง
- ใช้ Reference Image เป็น "แนวทางออกแบบ" เท่านั้น
- ใช้ได้เฉพาะกับโปรเจกต์ SuberTube
- ทุก feature ในรูปต้องถูกตรวจสอบกับ Current State ก่อนประกาศสถานะใดๆ
- หากรูปกับ Current State ขัดแย้งกัน → ยึด Current State เป็นหลัก และบันทึก GAP

---

12. Human Review — การปล่อยงาน (Release Gate)

แก้ไขจากเวิร์กโฟลว์เดิม (มองภาพรวม → ตรวจ → แก้ไข → ตรวจซ้ำ → วิเคราะห์มัลแวร์ → ตัวแปลคำค้น → เปลี่ยนเส้นทางผู้ใช้ URL)
เป็น HUMAN REVIEW workflow ใหม่ ที่ผู้ใช้เป็นผู้สั่งและอนุมัติก่อนปล่อยทุกครั้ง:

```text
CURRENT GITHUB
  ↓ (ผู้ใช้ตรวจ)
ยืนยัน CLEANUP MANIFEST
  ↓ (ผู้ใช้สั่ง)
DELETE / REPLACE
  ↓
RE-SCAN ทั้ง repository
  ↓
URL RECHECK
  ↓
LEGACY FINGERPRINT
  ↓
DUPLICATE ✓
  ↓
MALFORMED TREE ✓
  ↓
SECRET ✓
  ↓
FOREIGN / INVISIBLE ✓
  ↓
HUMAN RELEASE APPROVAL ← ผู้ใช้อนุมัติเท่านั้น จึงจะปล่อยได้
```

รายละเอียดแต่ละขั้น: ดู `CLEANUP-MANIFEST.md`

---

> อัปเดตล่าสุด: 29 กันยายน 2026
หลักการสุดท้าย: ศูนย์ยืนปลอดภัย = ก่อน Assumptions ให้ถาม ✋