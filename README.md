SuberTube Project Reference — FINAL-5.5

> ชั้นเอกสาร: เอกสารอ้างอิงเฉพาะโปรเจกต์ SuberTube (ชั้นที่ 3 ของ Documentation Chain)
ใช้ควบคุมงานเฉพาะโปรเจกต์นี้เท่านั้น — ห้ามนำไปผูกกับโปรเจกต์อื่น (Project Isolation กฎ #9)

Documentation Chain:

```text
MASTER GUIDE FINAL-5.5 → Mobile Quick Reference FINAL-5.5 → SuberTube Project Reference (ไฟล์นี้) → Current Project State (README)
```

วันที่อัปเดต: 29 กันยายน 2026

---

1. ขอบเขตการใช้เอกสารนี้

เอกสาร	ใช้กับ	
MASTER GUIDE FINAL-5.5	หลายโปรเจกต์ในอนาคต (มาตรฐานกลาง)	
Mobile Quick Reference FINAL-5.5	โปรเจกต์ใกล้เคียงที่เน้นมือถือ	
SuberTube Project Reference (ไฟล์นี้)	เฉพาะ SuberTube	
README (Current Project State)	สถานะปัจจุบันของ SuberTube	

---

2. Reference Image Handling (กฎสำคัญ — กฎ #13)

> Reference Image ไม่ใช่หลักฐานว่า feature มีอยู่จริง

กฎการใช้รูปอ้างอิง
1. รูปภาพอ้างอิงใช้เป็น "แนวทางออกแบบ (Design Intent)" เท่านั้น
2. ใช้ได้เฉพาะกับโปรเจกต์ SuberTube
3. ทุก feature ที่ปรากฏในรูป เริ่มต้นที่สถานะ NOT VERIFIED จนกว่าจะยืนยันกับ Current State
4. หากรูปกับ Current State ขัดแย้งกัน → ยึด Current State เป็นหลัก แล้วเปิด GAP
5. ห้ามเขียนสถานะ PASS จากรูปโดยตรง โดยไม่มีหลักฐานการทดสอบ

ตัวอย่างการใช้

สิ่งในรูป	สถานะเริ่มต้น	การยืนยัน	
Header Design v0.1	NOT VERIFIED	ตรวจกับ build จริง	
Playback (PIP, Background)	NOT VERIFIED	ทดสอบบนอุปกรณ์จริง	
URL Map	NOT VERIFIED	ตรวจในโค้ด + ทดสอบ Intercept	
Local Profile	NOT VERIFIED	ทดสอบ Add/Select/Remove	

---

3. โครงสร้างไฟล์ของ SuberTube (Project Control)

```text
/docs
├── 01-overview/      ← ภาพรวมโปรเจกต์ SuberTube
├── 02-workflow/      ← ขั้นตอนการทำงาน + QA + Malwarebytes
├── 03-url-map/       ← เส้นทาง URL (URL Map)
├── 04-security/      ← มาตรฐานความปลอดภัย + Security Checklist (Malwarebytes)
├── 05-release/       ← การปล่อยเวอร์ชัน + Regression Plan
├── 06-testing/       ← การทดสอบ (ซอฟต์แวร์/ออนไลน์/ออฟไลน์/เน็ตช้า)
└── 07-templates/     ← เทมเพลตเอกสาร
```

หลักการ: โลกภายใน (Project Control) แยกชัดจากโลกภายนอก (Generic Master Guide) — ห้ามปะปนกัน

---

4. UI Flow + URL + Playback (รวมในที่เดียว)

4.1 UI Flow

```text
หน้า Home (ค้นหา=ว่าง) → ไล่ค้น (YouTube Search) → ผลการค้นหา (WebView) → เล่นวิดีโอใน IFrame (กลับเข้าแอพ)
```

4.2 URL Map

ส่วน	URL รูปแบบ	ใช้งานเมื่อ	
Home (Local)	`/assets/index.html`	เปิดแอพ	
Search	`https://www.youtube.com/results?search_query={query}`	กดค้นหา	
Watch	`https://www.youtube.com/watch?v={VIDEO_ID}`	ดัก URL	
Shorts	`https://www.youtube.com/shorts/{VIDEO_ID}`	ดัก URL	
Live	`https://www.youtube.com/live/{VIDEO_ID}`	ดัก URL	
Embed (Player)	`https://www.youtube.com/embed/{VIDEO_ID}`	เล่นใน IFrame	

4.3 Playback & OS Integration

คุณสมบัติ	รายละเอียด	
เล่น/หยุด	ใน IFrame	
ข้าม/เสียง	ใช้ปุ่มฮาร์ดแวร์ (Hardware)	
Fullscreen	เต็มจอ	
PIP	เล็กลง (Picture-in-Picture)	
ปิดจอ	เล่นต่อได้ (พับหลัง)	
Background	เล่นเสียงเมื่อจอหลับ	
Notification	แจ้งเตือน/เล่นต่อ (Media notification)	

---

5. Security Checklist (Malwarebytes)

ขั้น	การทำ	ความถี่	
สแกนไฟล์ในโปรเจกต์	Malwarebytes full scan	ทุกครั้งที่เพิ่มไฟล์	
ตรวจมัลแวร์ / PUP	Malwarebytes	ทุกครั้งที่แก้ไข	
ตรวจ tracker / suspicious	แบบทดลอง Malwarebytes	ทุกครั้งที่แก้ไข	
URL Reputation	ตรวจ URL/โดเมนทั้งหมด	ก่อนแก้ไข + หลังแก้ไข	
Release Integrity	ตรวจไฟล์สุดท้าย ไม่มีลับ ไม่มีมัลแวร์	ก่อนปล่อยทุกครั้ง	
Deployment URL Check	ตรวจ URL ที่ซ่อนในโปรเจกต์	ก่อน deploy	

---

6. แผนการทดสอบและ Regression

ประเภทการทดสอบ	รายละเอียด	
ทดสอบซอฟต์แวร์	ฟังก์ชันหลักทั้งหมด	
ทดสอบออนไลน์	ใช้งานจริงกับเน็ตปกติ	
ทดสอบออฟไลน์	ตรวจพฤติกรรมเมื่อไม่มีเน็ต	
ทดสอบเน็ตช้า	ตรวจ timeout / loading state	

Regression: ทุกครั้งที่แก้ไข Code/Config (ขั้นตอนที่ 5 ของ Workflow) ต้องทำ Regression Test ครบทุกประเภทก่อนปล่อย

---

7. แผนการปล่อยเวอร์ชัน (Release Plan)

```text
GAP → Research → Evidence → Malwarebytes URL Reputation
→ Code/Config Change (เฉพาะ GAP) → Secret Scan + Foreign Scan
→ Regression Test → Malwarebytes Re-check (ต้อง Safe/Unknown)
→ Release Candidate → Release Integrity
→ Deployment URL Check → Real-use Monitoring
→ HUMAN RELEASE APPROVAL (ผู้ใช้อนุมัติเท่านั้น)
```

---

8. Explicit Project Isolation (กฎ #9)

- ✅ เอกสารนี้ใช้เฉพาะ SuberTube
- ✅ ห้ามนำ requirements/variables/decisions จากโปรเจกต์อื่นมาใช้โดยไม่มี authority
- ✅ ห้ามนำเนื้อหา SuberTube ไปใส่ใน MASTER GUIDE (มาตรฐานกลางต้องเป็น generic)
- ✅ หากต้องการนู้นแนวทางไปใช้โปรเจกต์ใหม่ ให้สร้าง Project Reference ใหม่ ไม่แก้ไฟล์นี้

---

> หลักการสุดท้าย: Evidence over assertion — คำกล่าวว่า "น่าจะปลอดภัย" หรือ "AI ตรวจแล้ว" ไม่ใช่หลักฐาน