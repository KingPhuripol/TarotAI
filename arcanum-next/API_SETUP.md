# ARCANUM Next.js — Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd arcanum-next
npm install
```

### 2. Configure Environment Variables
Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

**Get your API key from:** https://aistudio.google.com/app/apikey

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

### `/api/reading` - Tarot Reading
**POST** request with body:
```json
{
  "userPrompt": "Full prompt with question, spread, and cards"
}
```

### `/api/vision` - Card Detection
**POST** request with body:
```json
{
  "base64Data": "base64_encoded_image_data",
  "mimeType": "image/jpeg"
}
```

## 🔧 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **AI Backend:** Google Gemini 2.5 Flash
- **Styling:** Tailwind CSS
- **Fonts:** Cinzel, EB Garamond, Sarabun

## 📦 Deployment (Vercel)

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY` = your API key
   - `GEMINI_MODEL` = gemini-2.5-flash

### Environment Variables in Vercel
Go to: **Project Settings → Environment Variables**

Add:
- `GEMINI_API_KEY` → Production, Preview, Development
- `GEMINI_MODEL` → Production, Preview, Development (optional, has default)

## 🔒 Security

⚠️ **NEVER commit `.env.local` to Git**
- API keys are sensitive and should remain server-side only
- The `.gitignore` file excludes `.env.local` by default
- Use Vercel environment variables for production

## 🎨 Features

- ✅ 78 Tarot cards (Rider-Waite-Smith deck)
- ✅ 3 spreads: Single Card, Three-Card, Celtic Cross
- ✅ AI-powered readings in Thai
- ✅ Camera card detection
- ✅ Beautiful dark theme with animations
- ✅ Fully responsive design
- ✅ TypeScript for type safety

## 📁 Project Structure

```
arcanum-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── reading/route.ts    # Gemini reading API
│   │   │   └── vision/route.ts     # Gemini vision API
│   │   ├── reading/page.tsx        # Reading interface
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── reading/
│   │   │   ├── ReadingApp.tsx      # Main reading component
│   │   │   ├── CardPicker.tsx      # 78-card circle picker
│   │   │   ├── QuestionStep.tsx    # Question input
│   │   │   └── ResultView.tsx      # Reading result
│   │   ├── ui/
│   │   │   ├── AuroraBg.tsx        # Aurora background
│   │   │   └── StarCanvas.tsx      # Starfield canvas
│   │   ├── Nav.tsx                 # Navigation
│   │   └── Footer.tsx              # Footer
│   ├── lib/
│   │   ├── api.ts                  # API client functions
│   │   ├── cards.ts                # Tarot cards data
│   │   └── deck.ts                 # Card images mapping
│   └── types/
│       └── tarot.ts                # TypeScript types
├── public/
│   └── deck-images/                # 78 card images
├── .env.local.example              # Environment template
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## 🐛 Troubleshooting

### "GEMINI_API_KEY not set"
- Make sure `.env.local` exists with your API key
- Restart dev server after creating `.env.local`

### API returns 401 Unauthorized
- Check if your Gemini API key is valid
- Regenerate key at https://aistudio.google.com/app/apikey

### TypeScript errors
```bash
npm run build
# or
npx tsc --noEmit
```

### Port already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## 📄 License

MIT License - See original project for details
