# Supabase Setup Guide for ALBO FITNESS

## Step-by-Step Setup

### 1. Create Supabase Account
- Go to https://supabase.com
- Click "Sign Up"
- Use Google or GitHub account (easiest)
- Complete verification

### 2. Create New Project
- Click "New Project" button
- **Project Name:** `albo-fitness`
- **Password:** Create a strong password (you'll need this)
- **Region:** Select the region closest to your location (India: Singapore is good)
- **Pricing:** Free tier is fine for starting
- Click "Create New Project" and wait 1-2 minutes

### 3. Get Your Credentials (IMPORTANT!)

Once project is ready:

1. Go to **Settings** (bottom left menu)
2. Click **API** tab
3. You'll see:
   - **Project URL** - Copy this
   - **Anon Public Key** - Copy this
4. Save both in a safe place

Example format:
```
Project URL: https://abc123xyz.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables

Go to **SQL Editor** (left menu):

#### Table 1: trainers
```sql
CREATE TABLE IF NOT EXISTS trainers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  photo_url TEXT,
  certifications TEXT,
  experience_years INT,
  specialization TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table 2: testimonials
```sql
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table 3: faqs
```sql
CREATE TABLE IF NOT EXISTS faqs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table 4: gym_info
```sql
CREATE TABLE IF NOT EXISTS gym_info (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT DEFAULT 'ALBO FITNESS',
  address TEXT,
  phone TEXT,
  email TEXT,
  hours TEXT,
  about TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table 5: enquiries
```sql
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INT,
  gender TEXT,
  goal_physique TEXT,
  height DECIMAL(5,2),
  weight DECIMAL(6,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### How to Run SQL:
1. In SQL Editor, click "New Query"
2. Paste the SQL code
3. Click "Run" button
4. You should see "Success" message
5. Repeat for all 5 tables

### 5. Add Test Data (Optional but Recommended)

Add a trainer:
```sql
INSERT INTO trainers (name, photo_url, certifications, experience_years, specialization, bio)
VALUES (
  'John Doe',
  'https://via.placeholder.com/400x500?text=Trainer',
  'ACE Certified
NASM Certified',
  5,
  'Strength Training',
  'Expert in powerlifting and strength conditioning with 5 years of experience.'
);
```

Add gym info:
```sql
INSERT INTO gym_info (name, address, phone, email, hours, about)
VALUES (
  'ALBO FITNESS',
  'Chennai, Tamil Nadu',
  '+91 9876543210',
  'info@albofitness.com',
  'Monday - Friday: 6:00 AM - 10:00 PM
Saturday - Sunday: 7:00 AM - 9:00 PM',
  'ALBO FITNESS is dedicated to transforming your fitness journey with state-of-the-art equipment and expert trainers.'
);
```

## Next Steps

1. Copy your **Project URL** and **Anon Key**
2. Go back to the React project
3. Create `.env` file with:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Run `npm install` and `npm run dev`
5. Click "Admin" button and login with password: `admin123`
6. Start adding your gym content!

## Troubleshooting

**Error: "Missing Supabase credentials"**
- Check .env file exists in the root folder
- Check credentials are correct (copy-paste from Supabase Settings)
- Make sure no extra spaces in the .env file

**Error: "Table does not exist"**
- Make sure all 5 SQL queries were executed successfully
- Go to Supabase "Table Editor" to verify tables exist

**Can't login to admin**
- Default password is: `admin123`
- Check it matches in `src/components/AdminDashboard.jsx`

## Support

- Supabase Docs: https://supabase.com/docs
- Project issues: Review README.md for help

---

**You're all set! 🚀 Now run the website and start managing your gym content.**
