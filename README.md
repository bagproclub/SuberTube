
> **PLAY BEYOND LIMITS**  
> เว็บแอปสำหรับรับชม YouTube พร้อมระบบเล่นสื่อ การควบคุมการแสดงผล และสถาปัตยกรรมที่แยกส่วนอย่างปลอดภัย

SuberTube เป็นโปรเจกต์เว็บแอปที่ออกแบบให้ผู้ใช้สามารถค้นหาและรับชมวิดีโอจาก YouTube ผ่าน WebView พร้อมเชื่อมต่อระบบควบคุมการเล่นสื่อกับ Android ในส่วนที่จำเป็น

แนวคิดหลักของโครงการคือ

**เรียบง่าย → ปลอดภัย → แยกส่วน → ควบคุมได้ → ตรวจสอบได้**

---

## ✨ Project Overview

SuberTube แบ่งระบบออกเป็นหลายส่วนอย่างชัดเจน เพื่อไม่ให้ UI, Search, WebView, Playback และ Security ผูกติดกันทั้งหมดในจุดเดียว

ภาพรวมการทำงาน:

```text
User
 │
 ▼
SuberTube Android App
 │
 ▼
Home
 │
 ├── Profile (Local)
 │
 ▼
Search
 │
 ▼
YouTube Search (WebView)
 │
 ▼
Video Selection
 │
 ▼
Android Intercept
 │
 ▼
Validate Video ID
 │
 ▼
SuberTube Player State