Pre-Run Workflow — FINAL-5.5

SuberTube Project | ตรวจก่อนรันทุกครั้ง ตามหลัก MASTER GUIDE

> หลักการ: Reference Image ไม่ใช่หลักฐานว่า feature มีอยู่จริง — สถานะจริงของโปรเจกต์ต้องพิสูจน์ด้วยการตรวจสอบจริงเท่านั้น
โปรเจกต์นี้แยกอิสระจากโปรเจกต์เก่า (Explicit Project Isolation) — ห้ามเอาไฟล์/ค่า/งานจากโปรเจกต์อื่นมาปะปน

---

Workflow ภาพรวม (7 ขั้น)

```
[0] ISOLATION CHECK ──► [1] SECRET SCAN ──► [2] CONFIG VALIDATE ──► [3] TEST
                                                          ▲                │
                                                          │                ▼
                                              [6] FINAL VERIFY ◄── [4] FIX ──► [5] RE-CHECK
                                                          │
                                                          ▼
                                                       [7] RUN
```

---

[0] Isolation Check — ก่อนเริ่มทุกอย่าง

- ยืนยันว่าอยู่ใน directory ของ SuberTube เท่านั้น
- ไม่มีไฟล์จากโปรเจกต์เก่าถูก copy เข้ามา
- `git status` ไม่มีไฟล์แปลกปลอม
- ตั้งค่า PATH/ENV ของโปรเจกต์นี้แยกจากโปรเจกต์อื่น

ถ้า FAIL → หยุด แก้ให้ clean ก่อนเสมอ

[1] Secret Scan — ตรวจตัวแปร API Key / ค่าลับ

รันสคริปต์: `./pre_run_secret_scan.sh` (หรือ `python3 pre_run_secret_scan.py`)

ตรวจหา:
- API key ที่ hardcode ใน source code (เช่น `AIza...`, `apiKey = "..."`)
- `.env` ถูก `.gitignore` จริงหรือไม่
- ไม่มี key จริงถูก commit เข้า git history
- key ใน `local.properties` / `gradle.properties` ไม่ถูก track
- ค่าลับใน log / debug output
- keystore / signing key ไม่อยู่ใน repo

ผลลัพธ์: `PASS` (ไม่พบ) / `FAIL` (พบ key รั่ว →  revoke + rotate ทันที)

[2] Config Validate — ตรวจค่าตั้งต้น

- `.env.example` มีครบทุก key ที่ต้องใช้ (ใส่ค่าว่าง/placeholder เท่านั้น)
- key จริงอยู่ในไฟล์ local เท่านั้น ไม่ถูกอ้างอิงผิดที่
- Build config ชี้ไป environment ถูกต้อง (dev/staging/prod)
- URL Map ตรงกับ Current Project State ที่ยืนยันแล้วเท่านั้น

[3] Test — รันเทสก่อนแก้อะไร

- Unit tests
- Build debug APK ผ่าน
- ทดสอบ flow ตามภาพ: Home → Search → YouTube WebView → Video Selection → Android Intercept → Validate Video ID → Player

บันทึกผลแยกตามสถานะ:

สถานะ	ความหมาย	
PASS	ตรวจพิสูจน์แล้ว ผ่าน	
FAIL	ตรวจแล้ว ไม่ผ่าน → ต้องแก้	
BLOCKED	ตรวจไม่ได้ เพราะมีอะไรขวาง (รอ dependency/สิทธิ์)	
NOT VERIFIED	ยังไม่ได้ตรวจ — ห้ามถือว่าผ่าน	
NOT APPLICABLE	ไม่เกี่ยวกับงานชุดนี้	

[4] Fix — แก้เฉพาะจุดที่ FAIL

- แก้ทีละจุด แล้ว commit แยกชัดเจน
- ห้ามแก้แบบกว้างเกินจำเป็น
- ถ้าแก้เกี่ยวกับ secret → กลับไป [1] เสมอ

[5] Re-Check — ตรวจซ้ำหลังแก้

- รัน secret scan ซ้ำ (ทุกครั้งที่แก้ config/code ที่เกี่ยวกับ key)
- รันเทสซ้ำเฉพาะจุดที่ FAIL เดิม
- ยืนยัน FAIL เดิมกลายเป็น PASS

ยัง FAIL อยู่ → วนกลับ [4] / แก้ไม่ได้ → เปลี่ยนสถานะเป็น BLOCKED แล้วจดบันทึก

[6] Final Verify — ตรวจรวมครั้งสุดท้าย

- Secret scan: PASS
- Config validate: PASS
- ทุก FAIL ถูกแก้หรือระบุเป็น BLOCKED พร้อมเหตุผล
- ไม่มีสถานะ NOT VERIFIED ค้างใน scope ของงานรันนี้

[7] RUN — รันจริง

- รัน build/deploy
- บันทึกผลลง Current Project State
- อัปเดต Evidence ด้วยผลจริง — ไม่ใช่ภาพ reference

---

กฎเหล็ก

1. ห้ามรันก่อนผ่าน [1] Secret Scan เด็ดขาด
2. Reference Image ≠ หลักฐาน — ทุกข้อต้องมีผลตรวจจริง
3. NOT VERIFIED ไม่เท่ากับ PASS
4. พบ key รั่ว → revoke ก่อน แล้วค่อย rotate ใหม่
5. แยกโปรเจกต์เด็ดขาด — ไม่ดึงของเก่ามาใช้