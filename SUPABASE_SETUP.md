# ARD Supabase Setup

ไฟล์เว็บอยู่ที่ `C:\inetpub\wwwroot\ARD` และตั้งค่าให้ใช้โดเมน `a-rdugame-mfu.com`

## 1. สร้าง Supabase Project

1. เข้า Supabase แล้วสร้าง Project ใหม่
2. เปิด SQL Editor
3. คัดลอกเนื้อหาใน `supabase-schema.sql` ไปรันทั้งหมด
4. ไปที่ Project Settings > API แล้วคัดลอก Project URL และ anon public key
5. นำค่าไปใส่ใน `supabase-config.js`

```js
window.ARD_SUPABASE_CONFIG = {
  url: 'https://PROJECT_REF.supabase.co',
  anonKey: 'ANON_PUBLIC_KEY',
  adminEmail: 'ardumfu@gmail.com',
  allowedDomains: ['mfu.ac.th', 'lamduan.mfu.ac.th'],
  productionDomain: 'a-rdugame-mfu.com'
};
```

ห้ามใส่ service_role key ลงในไฟล์เว็บ เพราะผู้ใช้เปิดดูได้จาก browser

## 2. สร้าง Admin User

ไปที่ Authentication > Users แล้วสร้างผู้ใช้:

- Email: `ardumfu@gmail.com`
- Password: `arduMfu1234`

หลังสร้างแล้ว ให้ตรวจที่ตาราง `user_profiles` ว่า role เป็น `admin`

ถ้า profile ยังไม่ถูกสร้าง ให้รัน SQL นี้:

```sql
insert into public.user_profiles(id,email,role)
select id, lower(email), 'admin'
from auth.users
where lower(email) = 'ardumfu@gmail.com'
on conflict (id) do update set role = 'admin';
```

## 3. จำกัดอีเมลผู้สมัคร

ระบบจำกัด 2 ชั้น:

- ฝั่งหน้าเว็บตรวจเฉพาะ `@mfu.ac.th` และ `@lamduan.mfu.ac.th`
- ฝั่งฐานข้อมูล trigger ใน `supabase-schema.sql` ปฏิเสธอีเมลนอกโดเมนนี้

Admin `ardumfu@gmail.com` ได้รับอนุญาตเป็นกรณีพิเศษ

## 4. ตั้งค่า Auth URL

ใน Supabase ไปที่ Authentication > URL Configuration

- Site URL: `https://a-rdugame-mfu.com`
- Redirect URLs:
  - `https://a-rdugame-mfu.com/*`
  - `http://10.1.134.171/ARD/*` สำหรับทดสอบในวง LAN

## 5. ตั้งค่า IIS และโดเมน

ถ้าใช้ IIS ที่เครื่องนี้:

1. ตั้ง DNS A record ของ `a-rdugame-mfu.com` ให้ชี้มาที่ public IP ของเครื่องหรือ gateway
2. เปิด firewall/NAT port 80 และ 443 มาที่ IIS
3. ใน IIS เพิ่ม binding ของ site ที่ต้องการ:
   - Host name: `a-rdugame-mfu.com`
   - Physical path: `C:\inetpub\wwwroot\ARD`
4. ติดตั้ง SSL certificate เช่น Let's Encrypt ผ่าน win-acme

ถ้าไม่มี public IP หรือไม่ได้ forward port ผู้ใช้นอกเครือข่ายจะเข้าไม่ได้ แม้ตั้งโดเมนแล้วก็ตาม

## 6. สถานะการเปิดใช้งานตอนนี้

หน้าเล่นเกมถูกล็อกไว้สำหรับผู้ใช้ทั่วไปตามที่ต้องการ ผู้ใช้ทั่วไปจะเห็นและทำแบบสอบถามก่อน ส่วน admin ยังเข้าเลือกเกมและหลังบ้านได้

## 7. คะแนนควิช

ระบบใส่เฉลยจากตัวเลือกที่มีเส้นใต้ในไฟล์ DOCX แล้ว และจะบันทึก `quiz_score`, `quiz_total`, และ `quiz_percent` ลง Supabase เมื่อผู้เรียนส่งแบบสอบถาม
