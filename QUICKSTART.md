# Quick Start Guide - ALBO FITNESS Website

## 🚀 Get Running in 5 Minutes

### Step 1: Supabase Setup (2 min)
1. Go to https://supabase.com → Sign Up
2. Create Project: `albo-fitness` in Singapore region
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon Public Key

### Step 2: Project Setup (2 min)
```bash
# Extract the zip file
cd albo-fitness

# Create .env file
cp .env.example .env

# Edit .env and paste your Supabase credentials:
# VITE_SUPABASE_URL=https://your-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-key-here

# Install & Run
npm install
npm run dev
```

### Step 3: Create Database Tables (1 min)
1. In Supabase → **SQL Editor → New Query**
2. Copy-paste all 5 SQL blocks from `SUPABASE_SETUP.md`
3. Click "Run" for each query

**Done! 🎉**

Visit: http://localhost:5173

## Admin Login
- Click **"Admin"** button
- Password: `admin123`

## Next Steps
1. **Trainers** → Add your gym trainers
2. **Gym Info** → Update your gym details
3. **FAQs** → Add common questions
4. **Testimonials** → Add client reviews

## File Structure (What You're Getting)
```
albo-fitness/
├── README.md                 ← Full documentation
├── SUPABASE_SETUP.md        ← Database setup guide
├── QUICKSTART.md            ← This file
├── .env.example             ← Copy to .env
├── package.json             ← Dependencies
├── src/
│   ├── components/          ← All React components
│   ├── services/            ← Supabase config
│   └── App.jsx             ← Main app
└── tailwind.config.js       ← Styling config
```

## Troubleshooting

**"Missing Supabase credentials"**
→ Check .env file has correct values (no quotes, no spaces)

**"Table does not exist"**
→ Run the SQL in Supabase SQL Editor (SUPABASE_SETUP.md)

**Can't login to admin**
→ Password is `admin123` (case-sensitive)

## Want to Deploy?
```bash
# Build for production
npm run build

# Deploy to:
# - Vercel: vercel
# - Netlify: upload dist/ folder
# - GitHub Pages: npm run build && gh-pages -d dist
```

---

**Questions?** Check README.md or SUPABASE_SETUP.md 📚
