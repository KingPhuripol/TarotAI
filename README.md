# ARCANUM — ดูดวงไพ่ทาโรต์ด้วย AI

เว็บแอปดูดวงไพ่ทาโรต์ภาษาไทย ใช้ AI (GPT-4o) วิเคราะห์ไพ่ทั้ง 78 ใบจากชุด Rider-Waite-Smith

## ✨ ฟีเจอร์

- ไพ่ทาโรต์ครบ 78 ใบ พร้อมภาพ
- เลือกไพ่ผ่าน **วงแหวนแบบ 3D** หรือ **สแกนด้วยกล้อง**
- รูปแบบการดู: ไพ่ประจำวัน, อดีต-ปัจจุบัน-อนาคต, Celtic Cross
- AI อ่านไพ่เป็นภาษาไทย โดย GPT-4o
- ไพ่กลับหัว (reversed) รองรับ
- UI มืด ธีม mystic gold

## 🚀 การติดตั้ง

### 1. Clone repo

```bash
git clone https://github.com/<your-username>/arcanum-tarot.git
cd arcanum-tarot
```

### 2. ตั้งค่า API Key

```bash
cp config.example.js config.js
```

เปิด `config.js` แล้วใส่ OpenAI API key ของคุณ:

```js
const OPENAI_API_KEY = "sk-proj-...";
```

> 🔑 รับ API key ได้ที่ [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. เปิดเว็บ

เปิド `index.html` ด้วย Live Server หรือ HTTP server ใดก็ได้:

```bash
# ตัวอย่างด้วย Python
python3 -m http.server 8080
```

แล้วเปิด `http://localhost:8080`

## 📁 โครงสร้างไฟล์

```
arcanum-tarot/
├── index.html          # หน้าเว็บหลัก
├── styles.css          # สไตล์ทั้งหมด
├── app.js              # logic หลัก
├── api.js              # OpenAI integration
├── cards.js            # ข้อมูลไพ่ทั้ง 78 ใบ
├── deck.js             # mapping ชื่อไพ่ → รูปภาพ
├── config.js           # 🔒 API key (gitignored)
├── config.example.js   # template config
└── deck-images/        # รูปไพ่ 78 ใบ
```

## ⚠️ หมายเหตุ

- `config.js` ถูก gitignore ไว้ อย่า commit ไฟล์นี้
- แอปนี้เป็น client-side ทั้งหมด API key จะมองเห็นได้ใน browser DevTools
- สำหรับ production แนะนำให้ใช้ backend proxy แทน
