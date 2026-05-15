# AharaSetu - Quick Start (5 Minutes)

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Neon database account (free at neon.tech)

## Steps

### 1️⃣ Extract & Install (1 min)
```bash
cd aharasetu-app
pnpm install
```

### 2️⃣ Setup Environment (2 min)
Create `.env.local`:
```
DATABASE_URL=postgresql://your-user:pass@your-host/dbname?sslmode=require
JWT_SECRET=YourSecretKeyMakeItLongAndSecure32Chars!!!
```

Get `DATABASE_URL` from [neon.tech](https://neon.tech) → Copy connection string

### 3️⃣ Initialize Database (1 min)
```bash
# Using psql (if PostgreSQL installed)
psql "$DATABASE_URL" -f scripts/001-create-tables.sql 
psql "$DATABASE_URL" -f scripts/002-seed-data.sql

# OR manually via Neon Dashboard:
# 1. Go to SQL Editor
# 2. Copy-paste scripts/001-create-tables.sql → Run
# 3. Copy-paste scripts/002-seed-data.sql → Run
```

### 4️⃣ Start App (1 min)
```bash
pnpm dev
```

Visit: http://localhost:3000

### 5️⃣ Login
**Email:** `nutrition@aharasetu.in`  
**Password:** `NutritionAyur@2024!`

---

## ✅ Pre-Flight Checklist

Before starting, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Downloaded ZIP from v0
- [ ] Neon account created with database
- [ ] `.env.local` file created with DATABASE_URL & JWT_SECRET
- [ ] SQL migrations executed (`001-create-tables.sql`, `002-seed-data.sql`)
- [ ] Port 3000 is available (or use `pnpm dev -- -p 3001`)

If all checked, you're ready! Run `pnpm dev` and login.

---

## 🆘 Quick Fixes

| Issue | Fix |
|-------|-----|
| "Invalid credentials" | Ensure SQL migrations ran successfully |
| "Cannot connect to database" | Check DATABASE_URL format in `.env.local` |
| "Module not found" | Run `pnpm install` again |
| "Port 3000 in use" | `pnpm dev -- -p 3001` |
| "Database tables don't exist" | Re-run SQL scripts from scripts/ folder |

---

## 📚 Full Setup Guide

See `SETUP.md` for detailed instructions and troubleshooting.

---

## 🎯 What You Can Do

✅ Manage multiple patients  
✅ Browse 40+ Ayurvedic foods  
✅ Create personalized diet charts  
✅ View recipes and meal plans  
✅ Export diet charts as PDF  
✅ Track nutritional metrics  

Enjoy! 🌿
