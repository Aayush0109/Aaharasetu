# AharaSetu - Complete Local Setup Guide

## Step 1: Download & Extract

Click the three dots in the top-right of v0, select "Download ZIP", extract it locally, and navigate to the folder:

```bash
cd aharasetu-app
```

## Step 2: Install Dependencies

```bash
pnpm install
```

If you don't have pnpm, install it first:
```bash
npm install -g pnpm
```

## Step 3: Create Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-make-it-at-least-32-chars-long
```

### Where to get DATABASE_URL:
1. Go to [neon.tech](https://neon.tech)
2. Sign in or create a free account
3. Create a new project
4. Copy the "Connection string" from the dashboard
5. Paste it into `.env.local`

### JWT_SECRET:
Generate a random 32+ character string. Example:
```
MySecureJWTSecret123!@#$%^&*()_+
```

## Step 4: Initialize Database Schema

Before starting the app, run the migration scripts against your Neon database.

### Option A: Using psql (Recommended)

If you have PostgreSQL installed:

```bash
# Run migrations
psql "$DATABASE_URL" -f scripts/001-create-tables.sql
psql "$DATABASE_URL" -f scripts/002-seed-data.sql

# Optional: Reset demo account if needed
psql "$DATABASE_URL" -f scripts/003-reset-demo-account.sql
```

### Option B: Using Neon Dashboard

1. Go to your Neon project dashboard
2. Click "SQL Editor"
3. Copy-paste the contents of `scripts/001-create-tables.sql` and run
4. Copy-paste the contents of `scripts/002-seed-data.sql` and run

## Step 5: Start the Development Server

```bash
pnpm dev
```

The app will start at `http://localhost:3000`

## Step 6: Login

When the page loads, the demo credentials are pre-filled:

**Email:** `nutrition@aharasetu.in`  
**Password:** `NutritionAyur@2024!`

Click "Sign In" and you're in!

## Troubleshooting

### "Invalid credentials" error
1. Make sure you ran the SQL migrations (Step 4)
2. Verify DATABASE_URL is correct in `.env.local`
3. Check that the password hasn't been changed in the database

### "Cannot find module" errors
Run `pnpm install` again to ensure all dependencies are installed

### Database connection errors
1. Check your DATABASE_URL format in `.env.local`
2. Verify your Neon project is active
3. Make sure the connection string includes `?sslmode=require`

### Port 3000 already in use
Use a different port:
```bash
pnpm dev -- -p 3001
```

## Project Structure

```
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── patients/     # Patient management
│   │   ├── food-items/   # Food database
│   │   ├── recipes/      # Recipes
│   │   └── diet-charts/  # Diet chart management
│   ├── dashboard/        # Protected dashboard pages
│   ├── page.tsx          # Login page
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
├── lib/
│   ├── db.ts            # Database client
│   ├── auth.ts          # JWT & session management
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utilities
├── scripts/             # SQL migration scripts
├── public/              # Static assets
├── .env.local           # Environment variables (create this)
└── package.json         # Dependencies
```

## Features Available

| Feature | Route |
|---------|-------|
| Dashboard | `/dashboard` |
| Patient Management | `/dashboard/patients` |
| Food Database | `/dashboard/food-database` |
| Recipes | `/dashboard/recipes` |
| Diet Chart Builder | `/dashboard/diet-charts` |
| PDF Export | Chart detail page (print button) |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session
- `POST /api/seed` - Auto-seed demo data

### Data
- `GET /api/patients` - List all patients
- `GET /api/patients/[id]` - Get patient details
- `POST /api/patients` - Create patient
- `GET /api/food-items` - List food items
- `GET /api/recipes` - List recipes
- `GET /api/diet-charts` - List diet charts
- `POST /api/diet-charts` - Create diet chart
- `GET /api/diet-charts/[id]` - Get diet chart
- `GET /api/dashboard` - Dashboard statistics

## Demo Data

When the app starts, it automatically seeds:
- **1 Doctor:** Dr. Aayush Verma (nutrition@aharasetu.in)
- **3 Patients:** Priya Mehta, Rajesh Kumar, Ananya Iyer
- **40 Food Items:** Comprehensive Ayurvedic food database
- **5 Recipes:** Sample Ayurvedic meal combinations

## Technology Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT (HTTP-only cookies)
- **UI:** React with Tailwind CSS & shadcn/ui
- **Database Client:** @neondatabase/serverless
- **Styling:** Custom theme with design tokens

## Security Notes

- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- Cookies are HTTP-only and secure
- All database queries use parameterized statements (SQL injection safe)
- JWT_SECRET should be at least 32 characters in production

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure your database migrations completed without errors
4. Check browser console for error messages

Enjoy using AharaSetu! 🌿
