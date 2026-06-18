# Worth It?

แอป Next.js สำหรับช่วยตัดสินใจว่า "ของชิ้นนี้คุ้มจะซื้อไหม" โดยประเมินจากความจำเป็น ความถี่ในการใช้งาน ความเสี่ยงจะเสียดาย และสถานะการเงินส่วนตัวของเรา

ตัวแอปทำงานแบบ local-first ข้อมูลถูกเก็บในเบราว์เซอร์ด้วย `localStorage` และสามารถ `Backup` / `Restore` เป็นไฟล์ JSON ได้

## Features

- เพิ่ม แก้ไข ลบ wishlist item ได้จากหน้าเดียว
- ตั้งค่า `Financial Profile` เพื่อใช้เป็นฐานในการประเมินทุกชิ้น
- คำนวณ `worth score`, `regret risk` และสถานะความพร้อมในการซื้อ
- แนะนำ stage ของแต่ละรายการ เช่น `พักไว้ก่อน`, `ศึกษาต่อ`, `กำลังเก็บเงิน`, `ซื้อได้`
- จัดเรียงรายการได้หลายแบบ เช่น ตามความคุ้ม ความเสี่ยง ราคาถูกไปแพง หรือใกล้พร้อมซื้อมากที่สุด
- สำรองข้อมูลเป็นไฟล์ JSON และ restore กลับเข้าแอปได้
- มี demo data ให้เห็น flow การใช้งานตั้งแต่เปิดครั้งแรก

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI

## Getting Started

ติดตั้ง dependencies:

```bash
npm install
```

รันโหมดพัฒนา:

```bash
npm run dev
```

เปิดที่ [http://localhost:3000](http://localhost:3000)

คำสั่งอื่นที่ใช้บ่อย:

```bash
npm run lint
npm run build
npm run start
```

## How It Works

แต่ละ item จะถูกประเมินจากหลายมุม เช่น:

- ระดับความจำเป็น (`essential`, `useful`, `nice`)
- ความถี่ที่คาดว่าจะใช้ (`daily`, `weekly`, `monthly`)
- เป็นการแทนของเดิม อัปเกรด หรือซื้อซ้ำ
- ซื้อด้วยเงินสด เงินที่กันไว้แล้ว หรือหนี้
- มีของคล้ายกันอยู่แล้วไหม
- เป็นของที่อยากได้เพราะเทรนด์ โปร หรือ FOMO หรือเปล่า
- ปัญหาปัจจุบันรุนแรงแค่ไหน และของใหม่ช่วยแก้ปัญหาได้มากแค่ไหน
- งบความสุขรายเดือน เงินสำรองฉุกเฉิน และเงินที่ใช้ไปแล้วในเดือนนี้

ระบบใน [`lib/worth-it.ts`](/Users/sumetph/.codex/worktrees/71ca/worth-it/lib/worth-it.ts) จะสรุปผลออกมาเป็น:

- `worthScore`: คะแนนความคุ้ม 0-100
- `regretRisk`: ความเสี่ยงที่จะซื้อแล้วเสียดาย
- `recommendation`: คำแนะนำเชิงการเงินและความพร้อม
- `stage`: ระยะที่ควรอยู่ตอนนี้ เช่นรอ ศึกษา เก็บเงิน หรือซื้อได้
- `costPerUse`: ต้นทุนต่อครั้งโดยประมาณ

## Data Model

ข้อมูลหลักมี 2 ส่วน:

1. `WishItem`
2. `FinancialProfile`

`WishItem` ใช้เก็บรายละเอียดของของแต่ละชิ้น เช่น ราคา เหตุผล วิธีจ่าย เงินที่เก็บไว้แล้ว ระดับ pain point และพฤติกรรมเสี่ยงต่อการซื้อแล้วเสียดาย

`FinancialProfile` ใช้เก็บตัวเลขกลางของผู้ใช้ เช่น:

- เงินสำรองฉุกเฉินปัจจุบัน
- เป้าเงินสำรองฉุกเฉิน
- งบความสุขรายเดือน
- เงินที่ใช้จากงบความสุขไปแล้วในเดือนนี้

## Backup And Restore

- ปุ่ม `Backup` จะ export ข้อมูลรายการทั้งหมดพร้อม `Financial Profile` เป็นไฟล์ JSON
- ปุ่ม `Restore` จะอ่านไฟล์ JSON และเขียนทับข้อมูลปัจจุบัน
- มีตัวตรวจรูปแบบไฟล์และ normalize ข้อมูลก่อนนำกลับมาใช้

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  worth-it-app.tsx
  ui/
lib/
  worth-it.ts
  utils.ts
```

ไฟล์สำคัญ:

- [`components/worth-it-app.tsx`](/Users/sumetph/.codex/worktrees/71ca/worth-it/components/worth-it-app.tsx): UI หลักและ state ของแอป
- [`lib/worth-it.ts`](/Users/sumetph/.codex/worktrees/71ca/worth-it/lib/worth-it.ts): กติกาการให้คะแนน การจัดเรียง และ backup/restore
- [`app/page.tsx`](/Users/sumetph/.codex/worktrees/71ca/worth-it/app/page.tsx): entry page

## Notes

- โปรเจกต์นี้ยังไม่มี backend หรือ database
- ข้อมูลผูกกับเบราว์เซอร์/เครื่องที่ใช้งาน เว้นแต่จะ export backup ออกมา
- ถ้าต้องการต่อยอด สามารถเพิ่ม auth, cloud sync, shared wishlist หรือ analytics ได้ต่อจากโครงสร้างปัจจุบัน
