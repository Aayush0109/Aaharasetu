# START HERE 👋

Welcome to AharaSetu! This file will guide you to the right documentation.

## What is AharaSetu?

An **Ayurvedic Diet Management System** for healthcare practitioners to create personalized diet plans for patients. Includes a comprehensive food database, recipe management, and nutritional tracking.

---

## 🚀 Choose Your Path

### Path 1: I want to START IMMEDIATELY (5 minutes)
→ Read: **`QUICKSTART.md`**

- Fastest possible setup
- Assumes you have Neon database ready
- Copy-paste commands
- No explanations, just action

### Path 2: I want DETAILED INSTRUCTIONS (15 minutes)
→ Read: **`EXECUTION_GUIDE.md`**

- Step-by-step walkthrough
- Screenshots and examples
- Explains every step
- Verification points included

### Path 3: I want COMPLETE DOCUMENTATION
→ Read: **`SETUP.md`**

- Comprehensive setup guide
- Troubleshooting included
- All environment variables explained
- Project structure details

### Path 4: I have a PROBLEM
→ Read: **`TROUBLESHOOTING.md`**

- "Invalid credentials" fix
- Database connection issues
- Environment variable problems
- Common errors & solutions

### Path 5: I want to understand the PROJECT
→ Read: **`README.md`**

- Project overview
- Tech stack details
- API documentation
- Feature list
- Security information

---

## 📋 Pre-Flight Checklist

Before you start, verify you have:

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Neon database account created (free at neon.tech)
- [ ] Connection string from Neon copied & saved

Not ready? → See **`PRE_DOWNLOAD_CHECKLIST.md`**

---

## ⏱️ How Long Will This Take?

- **Download ZIP:** 2 minutes
- **Install dependencies:** 3 minutes
- **Database setup:** 2 minutes
- **Start server:** 1 minute
- **First login:** 1 minute

**Total: ~10 minutes** (assuming you have Neon ready)

---

## 📁 What You're Getting

```
✓ Complete Next.js 16 application
✓ Secure JWT authentication
✓ PostgreSQL database (7 tables)
✓ 40+ Ayurvedic foods database
✓ Patient management system
✓ Diet chart builder with PDF export
✓ Recipe management
✓ Beautiful shadcn/ui components
✓ Comprehensive documentation
```

---

## 🔑 Demo Credentials

Once you run the app, login with:

```
Email:    nutrition@aharasetu.in
Password: NutritionAyur@2024!
```

These are **automatically created** when you start the app.

---

## 🛠️ Technology

- **Backend:** Next.js 16, Node.js
- **Database:** PostgreSQL (Neon serverless)
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Auth:** JWT + HTTP-only cookies
- **Data:** SWR for caching

---

## 📚 Quick Guide

### I'm ready to start →
Go to **`QUICKSTART.md`** or **`EXECUTION_GUIDE.md`**

### I need detailed steps →
Go to **`SETUP.md`**

### Something went wrong →
Go to **`TROUBLESHOOTING.md`**

### I want to know everything →
Go to **`README.md`**

---

## ✅ The 5-Step Quickstart

1. **Create `.env.local`** with DATABASE_URL from Neon
2. **Run `pnpm install`**
3. **Run SQL migrations** from `scripts/` folder
4. **Run `pnpm dev`**
5. **Login** with pre-filled credentials

Done! You're in the dashboard.

---

## 🆘 Common Mistakes (Avoid These!)

❌ **Mistake:** "I'll set up .env.local later"  
✅ **Fix:** Create it FIRST before running `pnpm dev`

❌ **Mistake:** "I skipped the SQL migrations"  
✅ **Fix:** Run both SQL files or login will fail

❌ **Mistake:** "My DATABASE_URL has quotes around it"  
✅ **Fix:** Remove the quotes in `.env.local`

❌ **Mistake:** "I copied the wrong connection string"  
✅ **Fix:** Use the full Neon connection string from dashboard

---

## 🎯 What Happens After Setup

1. App loads at http://localhost:3000
2. Login page appears (credentials pre-filled)
3. Auto-seed creates demo data (3-5 seconds)
4. Click "Sign In"
5. Dashboard loads with:
   - Overview statistics
   - 3 sample patients
   - Navigation to all modules

Then you can:
- **Manage Patients** → Add/edit patient profiles
- **Browse Foods** → Search 40+ Ayurvedic foods
- **View Recipes** → See meal combinations
- **Create Diet Charts** → Build personalized meal plans
- **Export to PDF** → Print for patients

---

## 📞 Getting Help

| Issue | Go To |
|-------|-------|
| Setup steps | `EXECUTION_GUIDE.md` |
| Fast setup | `QUICKSTART.md` |
| Database errors | `TROUBLESHOOTING.md` |
| Project info | `README.md` |
| Detailed setup | `SETUP.md` |

---

## 🎓 Learning Path

1. **Day 1:** Setup & explore dashboard
2. **Day 2:** Create patient profiles, browse food database
3. **Day 3:** Create first diet chart, export to PDF
4. **Day 4:** Build multiple diet charts for patients
5. **Day 5+:** Customize for your needs

---

## 🌿 Ready?

**Choose your path above and get started!**

Most users should go to: **`QUICKSTART.md`** or **`EXECUTION_GUIDE.md`**

---

## Version Info

- **Next.js:** 16.1.6
- **React:** 19.2.3
- **Node:** 18.0.0+
- **Database:** PostgreSQL (Neon)
- **Last Updated:** February 2026

---

Good luck! You've got this! 💪🌿
