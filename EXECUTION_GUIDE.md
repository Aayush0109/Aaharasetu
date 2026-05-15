# AharaSetu - Complete Execution Guide

This guide walks you through every step to get AharaSetu running on your local machine.

---

## Phase 1: Pre-Download Preparation

### Step 1: Install System Requirements

**Check Node.js:**
```bash
node --version  # Should be 18.0.0 or higher
```

If not installed, download from https://nodejs.org

**Install pnpm:**
```bash
npm install -g pnpm
pnpm --version  # Should output a version
```

### Step 2: Set Up Neon Database

1. Go to https://neon.tech
2. Sign up for a free account (email or GitHub)
3. Click "New Project"
4. Choose your region (closest to you)
5. Create the project
6. You'll see a connection string like: 
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```
7. **COPY and SAVE this string** - you'll need it next

---

## Phase 2: Download & Extract

### Step 3: Download from v0

1. In v0 interface, click the **three dots** (top-right corner)
2. Select **"Download ZIP"**
3. Wait for download to complete
4. Extract the ZIP to your preferred location

### Step 4: Navigate to Project

```bash
cd path/to/aharasetu-app
ls -la  # Should show package.json, scripts/, etc.
```

---

## Phase 3: Local Setup

### Step 5: Create Environment File

Create a new file called `.env.local` in the project root:

```bash
# macOS/Linux
touch .env.local
nano .env.local

# Windows (PowerShell)
New-Item -Name ".env.local" -Type File
notepad .env.local
```

Add these lines (replace with your actual values):
```env
DATABASE_URL=postgresql://your-user:your-password@your-host.neon.tech/your-db?sslmode=require
JWT_SECRET=MySecureJWTSecretKey123!@#$%^&*()Make_It_Long
```

**Save the file.**

**Verify it was created:**
```bash
cat .env.local  # Should show your DATABASE_URL and JWT_SECRET
```

### Step 6: Install Dependencies

```bash
pnpm install
```

This will:
- Download all packages (~500MB)
- Create `node_modules/` folder
- Create `pnpm-lock.yaml` file

**Wait for it to finish.** You should see:
```
WARN  ... 
done in 2m34s
```

### Step 7: Initialize Database

**Option A: Using psql (Recommended)**

If you have PostgreSQL installed locally:

```bash
# Run first migration (creates tables)
psql "$DATABASE_URL" -f scripts/001-create-tables.sql

# Run second migration (seeds sample data)
psql "$DATABASE_URL" -f scripts/002-seed-data.sql
```

**Option B: Using Neon Dashboard**

1. Go to your Neon project
2. Click **"SQL Editor"** (top menu)
3. Copy the entire contents of `scripts/001-create-tables.sql`
4. Paste into the SQL Editor
5. Click **"Run"**
6. Repeat for `scripts/002-seed-data.sql`

**Verify it worked:**
```bash
# Check if tables exist
psql "$DATABASE_URL" -c "\dt"

# You should see these tables:
# - diet_chart_items
# - diet_charts
# - doctors
# - food_items
# - patients
# - recipe_ingredients
# - recipes
```

---

## Phase 4: Start the Application

### Step 8: Start Development Server

```bash
pnpm dev
```

You should see output like:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### Step 9: Open in Browser

1. Open your browser
2. Go to: http://localhost:3000
3. You should see the **AharaSetu Login Page**

---

## Phase 5: First Login

### Step 10: Login with Demo Credentials

The login form has pre-filled credentials:

**Email:** `nutrition@aharasetu.in`  
**Password:** `NutritionAyur@2024!`

Just click **"Sign In"**

### Step 11: What Happens Automatically

On first load:
1. Page auto-calls `/api/seed` endpoint
2. Creates demo doctor account
3. Creates 3 sample patients
4. Seeds 40 food items
5. Seeds 5 recipes

Wait 2-3 seconds for this to complete, then click Sign In.

### Step 12: Enter Dashboard

If login succeeds, you'll see:
- **Left sidebar** with navigation
- **Dashboard cards** showing statistics
- **Doctor name** at bottom (Dr. Aayush Verma)

🎉 **You're in!**

---

## Phase 6: Explore the Application

### Dashboard (`/dashboard`)
- View statistics
- Quick action cards
- Recent patients
- System status

### Patients (`/dashboard/patients`)
- View all patients (Priya, Rajesh, Ananya)
- Create new patient
- Click patient name to edit

### Food Database (`/dashboard/food-database`)
- Browse 40 Ayurvedic foods
- Filter by category, Rasa, Virya
- View nutritional values
- View Ayurvedic properties

### Recipes (`/dashboard/recipes`)
- View 5 sample recipes
- See ingredient breakdown
- View cooking instructions

### Diet Charts (`/dashboard/diet-charts`)
- List all diet plans
- Create new diet chart
- View existing charts
- Export to PDF

### Create Your First Diet Chart

1. Go to **Diet Charts**
2. Click **"New Diet Chart"**
3. Select a patient (e.g., Priya Mehta)
4. Add foods for each meal:
   - Breakfast
   - Lunch
   - Dinner
   - Snacks
5. Drag items to adjust quantities
6. Click **"Save Chart"**
7. View the chart and click **"Print/Export PDF"**

---

## Maintenance & Troubleshooting

### If You Hit Issues

**"Invalid credentials"**
- Wait 3 seconds for auto-seed
- Try refreshing the page
- Check `.env.local` exists and has DATABASE_URL

**"Cannot connect to database"**
- Verify DATABASE_URL in `.env.local`
- Make sure Neon project is active
- Test connection: `psql "$DATABASE_URL" -c "SELECT 1"`

**"Port 3000 in use"**
- Stop the running server (Ctrl+C)
- Or use different port: `pnpm dev -- -p 3001`

**"Module not found"**
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `pnpm install`

See `TROUBLESHOOTING.md` for more issues.

### Reset Demo Data

If you want to start fresh:

```bash
psql "$DATABASE_URL" -f scripts/003-reset-demo-account.sql
```

Then refresh the page - it will auto-seed again.

### Stop the Server

```bash
Ctrl + C  # Press Ctrl and C together
```

---

## Production Deployment

To build for production:

```bash
pnpm build
pnpm start
```

This creates an optimized build ready for deployment to Vercel or other platforms.

---

## File Locations Checklist

- ✓ `.env.local` - Root directory
- ✓ `scripts/001-create-tables.sql` - Database schema
- ✓ `scripts/002-seed-data.sql` - Sample data
- ✓ `app/` - Next.js application
- ✓ `components/` - React components
- ✓ `lib/` - Database & auth logic
- ✓ `public/` - Static assets

---

## Summary: The 12 Steps

1. ✅ Install Node.js & pnpm
2. ✅ Create Neon database account
3. ✅ Download ZIP from v0
4. ✅ Extract to local folder
5. ✅ Create `.env.local` with DATABASE_URL & JWT_SECRET
6. ✅ Run `pnpm install`
7. ✅ Run SQL migrations (scripts)
8. ✅ Run `pnpm dev`
9. ✅ Open http://localhost:3000
10. ✅ Click "Sign In" (auto-seeded credentials)
11. ✅ Explore the dashboard
12. ✅ Create your first diet chart!

---

## Quick Reference Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Install dependencies
pnpm install

# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# View all tables
psql "$DATABASE_URL" -c "\dt"

# Check existing doctors
psql "$DATABASE_URL" -c "SELECT * FROM doctors;"

# Reset demo (if needed)
psql "$DATABASE_URL" -f scripts/003-reset-demo-account.sql
```

---

## Next Steps After Setup

1. **Create a new patient:** Patients → New Patient
2. **Browse foods:** Food Database → Filter by Rasa
3. **Build a diet chart:** Diet Charts → New Chart
4. **Export to PDF:** Open chart → Print button

Enjoy using AharaSetu! 🌿

---

## Getting Help

- **Setup issues:** See `SETUP.md`
- **Common problems:** See `TROUBLESHOOTING.md`
- **Quick start:** See `QUICKSTART.md`
- **Full details:** See `README.md`

**Time to full setup: ~10-15 minutes**
