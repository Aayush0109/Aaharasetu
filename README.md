# AharaSetu 🌿

**Bridge of Nutrition** - An Ayurvedic Diet Management System for Healthcare Practitioners

AharaSetu is a comprehensive Next.js application designed to help Ayurvedic practitioners and nutrition specialists manage personalized diet plans for their patients. It combines traditional Ayurvedic principles with modern nutritional science.

## Features

✨ **Complete Patient Management**
- Create and manage multiple patient profiles
- Track health conditions, dietary habits, and digestive patterns
- Comprehensive health assessment for each patient

📚 **Extensive Food Database**
- 40+ Ayurvedic foods with detailed nutritional data
- Classified by Rasa (taste), Virya (potency), and Digestibility
- Nutritional values (calories, protein, carbs, fats)
- Vegetarian/non-vegetarian options

🍽️ **Intelligent Diet Chart Builder**
- Drag-and-drop meal composition
- Meal-by-meal planning (breakfast, lunch, dinner, snacks)
- Real-time nutritional calculations
- Quantity management in grams
- Personalized notes and recommendations

🥘 **Recipe Management**
- Pre-built Ayurvedic recipe combinations
- Ingredient composition tracking
- Category-based organization
- Easily integrate recipes into diet charts

📄 **PDF Export**
- Professional diet chart printing
- Patient-friendly format
- Shareable and printable documents

🔐 **Secure Authentication**
- JWT-based authentication
- HTTP-only secure cookies
- 7-day session persistence
- Bcryptjs password hashing

## Tech Stack

- **Framework:** Next.js 16 with Turbo
- **Database:** PostgreSQL (via Neon serverless)
- **Authentication:** JWT with cookies
- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Data Fetching:** SWR for client-side caching
- **Database Client:** @neondatabase/serverless
- **Password Hashing:** bcryptjs

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- Neon database (free at neon.tech)

### Setup (5 minutes)

1. **Extract and install:**
   ```bash
   cd aharasetu-app
   pnpm install
   ```

2. **Configure environment** (create `.env.local`):
   ```env
   DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
   JWT_SECRET=your-secret-key-32-chars-min
   ```

3. **Initialize database:**
   ```bash
   psql "$DATABASE_URL" -f scripts/001-create-tables.sql
   psql "$DATABASE_URL" -f scripts/002-seed-data.sql
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Login:**
   - Email: `nutrition@aharasetu.in`
   - Password: `NutritionAyur@2024!`

See `QUICKSTART.md` for 5-minute setup or `SETUP.md` for detailed instructions.

## Project Structure

```
aharasetu-app/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── patients/       # Patient management API
│   │   ├── food-items/     # Food database API
│   │   ├── recipes/        # Recipe API
│   │   ├── diet-charts/    # Diet chart management
│   │   ├── dashboard/      # Dashboard stats
│   │   └── seed/           # Database seeding
│   ├── dashboard/
│   │   ├── patients/       # Patient list & details
│   │   ├── food-database/  # Food browser
│   │   ├── recipes/        # Recipe viewer
│   │   ├── diet-charts/    # Diet chart management
│   │   └── page.tsx        # Dashboard home
│   ├── page.tsx            # Login page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── patient-form.tsx    # Patient creation form
├── lib/
│   ├── db.ts              # Database client
│   ├── auth.ts            # JWT & session handling
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── scripts/
│   ├── 001-create-tables.sql
│   ├── 002-seed-data.sql
│   └── 003-reset-demo-account.sql
├── public/                # Static assets
├── QUICKSTART.md          # 5-minute setup guide
├── SETUP.md               # Detailed setup instructions
├── TROUBLESHOOTING.md     # Common issues & fixes
└── package.json           # Dependencies

```

## Demo Data

The app auto-seeds with:
- **1 Doctor:** Dr. Aayush Verma (nutrition@aharasetu.in)
- **3 Sample Patients:** Priya Mehta, Rajesh Kumar, Ananya Iyer
- **40 Ayurvedic Foods:** Complete with nutritional and Ayurvedic properties
- **5 Sample Recipes:** Traditional meal combinations

## API Routes

### Authentication
- `POST /api/auth/login` - Doctor login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session
- `POST /api/seed` - Seed demo data

### Patient Management
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Patient details
- `PUT /api/patients/[id]` - Update patient

### Food Database
- `GET /api/food-items` - List foods (with filters)
- `GET /api/food-items?category=X&rasa=Y` - Filter foods

### Recipes
- `GET /api/recipes` - List recipes

### Diet Charts
- `GET /api/diet-charts` - List charts
- `POST /api/diet-charts` - Create chart
- `GET /api/diet-charts/[id]` - Chart details
- `PUT /api/diet-charts/[id]` - Update chart

### Dashboard
- `GET /api/dashboard` - Dashboard statistics

## Security

✓ **Password Security:** bcryptjs hashing (10 rounds)  
✓ **Session Management:** JWT tokens (7-day expiry)  
✓ **Cookie Security:** HTTP-only, secure, sameSite=lax  
✓ **SQL Injection:** Parameterized queries throughout  
✓ **Input Validation:** Form validation on client & server  

## Database Schema

### Tables
- **doctors** - Practitioner accounts
- **patients** - Patient profiles with health info
- **food_items** - Ayurvedic food database
- **recipes** - Pre-built recipe combinations
- **recipe_ingredients** - Recipe composition
- **diet_charts** - Personalized diet plans
- **diet_chart_items** - Meal items in diet charts

All tables include timestamps and proper relationships.

## Development

### Build
```bash
pnpm build
```

### Production Start
```bash
pnpm start
```

### Linting
```bash
pnpm lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✓ |
| `JWT_SECRET` | Secret for JWT signing (32+ chars) | ✓ |

## Troubleshooting

- **Login fails:** See `TROUBLESHOOTING.md`
- **Database connection errors:** Check DATABASE_URL format
- **Port 3000 in use:** `pnpm dev -- -p 3001`
- **Module not found:** `pnpm install`

See `TROUBLESHOOTING.md` for comprehensive debugging guide.

## Documentation

- `QUICKSTART.md` - 5-minute setup guide
- `SETUP.md` - Complete setup with all details
- `TROUBLESHOOTING.md` - Issues and solutions
- `PRE_DOWNLOAD_CHECKLIST.md` - Pre-setup checklist

## Features Roadmap

Future enhancements:
- [ ] Email PDF delivery
- [ ] Bulk patient import/export
- [ ] Nutritional recommendation engine
- [ ] Patient dietary adherence tracking
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Real-time collaboration

## License

This project is proprietary software designed for Ayurvedic practitioners and healthcare facilities.

## Support & Issues

For setup issues, refer to `TROUBLESHOOTING.md` first. The guides include solutions for 95% of common problems.

## Credits

Built with Next.js, PostgreSQL, and love for Ayurvedic nutritional science. 🌿

---

**Get started now:** Read `QUICKSTART.md` and follow the 5-step setup!
