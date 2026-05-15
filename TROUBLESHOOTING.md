# AharaSetu - Troubleshooting Guide

## Login Issues

### ❌ "Invalid credentials" Error

**Problem:** Login fails even with correct credentials.

**Cause:** Demo doctor account hasn't been created yet.

**Solutions:**

#### Solution 1: Auto-Seed (Easiest)
The page automatically seeds on first load. Just wait 2-3 seconds and try logging in again.

#### Solution 2: Manual Seed via API
Open your browser console and run:
```javascript
fetch('/api/seed', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log('Seeded:', data))
```

Then try logging in.

#### Solution 3: Verify Database Connection
Check if your `.env.local` file exists and has correct DATABASE_URL:
```bash
cat .env.local
```

Should show something like:
```
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
JWT_SECRET=YourSecret...
```

#### Solution 4: Recreate Demo Account Manually
If the account got deleted, run this in your Neon SQL Editor:

```sql
DELETE FROM doctors WHERE email = 'nutrition@aharasetu.in';

INSERT INTO doctors (name, email, password_hash, specialization) 
VALUES (
  'Dr. Aayush Verma',
  'nutrition@aharasetu.in',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'Ayurvedic Nutrition Specialist'
);
```

To get the bcrypt hash, run this Node.js script locally:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('NutritionAyur@2024!', 10).then(hash => console.log(hash));
```

---

## Database Issues

### ❌ "Can't connect to database"

**Problem:** Database connection fails at startup.

**Checklist:**
1. DATABASE_URL in `.env.local` is correct
2. Connection string includes `?sslmode=require`
3. Neon project is active (check neon.tech dashboard)
4. Password doesn't contain special characters (or is URL-encoded)

**Fix:**
```bash
# Verify connection locally
psql "$DATABASE_URL" -c "SELECT version();"
```

If this works, the connection is fine.

---

### ❌ "Relation 'doctors' does not exist"

**Problem:** Tables weren't created.

**Fix:**
Run the migration scripts:
```bash
psql "$DATABASE_URL" -f scripts/001-create-tables.sql
psql "$DATABASE_URL" -f scripts/002-seed-data.sql
```

Or manually in Neon SQL Editor:
1. Copy contents of `scripts/001-create-tables.sql`
2. Run in SQL Editor
3. Repeat for `scripts/002-seed-data.sql`

---

### ❌ "Authentication failed for user"

**Problem:** Your Neon credentials are wrong.

**Fix:**
1. Go to [neon.tech](https://neon.tech)
2. Click your project
3. Click "Connection string"
4. Copy the full string
5. Paste into `.env.local` as DATABASE_URL
6. Make sure there are no extra spaces or line breaks

---

## Setup Issues

### ❌ "Module not found" Error

**Problem:** Dependencies not installed.

**Fix:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### ❌ "Port 3000 already in use"

**Problem:** Another process is running on port 3000.

**Solutions:**

Option 1: Kill the process
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell)
Get-Process | Where-Object {$_.Port -eq 3000} | Stop-Process
```

Option 2: Use a different port
```bash
pnpm dev -- -p 3001
```

---

### ❌ "NEXT_RUNTIME is not defined"

**Problem:** Environment setup issue.

**Fix:**
```bash
rm -rf .next
pnpm dev
```

---

## Runtime Issues

### ❌ Page keeps loading after login

**Problem:** Session verification stuck.

**Cause:** `/api/auth/session` endpoint failing.

**Fix:**
1. Open browser DevTools (F12)
2. Check Network tab
3. Look for failed `/api/auth/session` requests
4. Check the error response

If database error, verify tables exist:
```bash
psql "$DATABASE_URL" -c "\dt"
```

---

### ❌ Can't create patients/diet charts

**Problem:** Data creation fails.

**Likely Cause:** Missing doctor_id or invalid patient reference.

**Check:**
1. Verify you're logged in (check browser cookies)
2. Check browser console for error messages
3. Verify patients exist before creating diet charts

**Debug:**
Open browser console and check localStorage:
```javascript
// Should see auth-token cookie (check Application tab)
document.cookie
```

---

## Environment Variable Issues

### ❌ "JWT_SECRET is undefined"

**Problem:** JWT_SECRET not set in `.env.local`.

**Fix:**
```bash
echo "JWT_SECRET=YourSecureKey123!@#$%^&*()" >> .env.local
```

Then restart:
```bash
pnpm dev
```

---

### ❌ "DATABASE_URL is undefined"

**Problem:** DATABASE_URL not set in `.env.local`.

**Fix:**
1. Get connection string from neon.tech
2. Create `.env.local`:
```bash
cat > .env.local << 'EOF'
DATABASE_URL=your-connection-string-here
JWT_SECRET=your-secret-here
EOF
```

3. Restart server

---

## Password/Auth Issues

### ❌ "Password not matching"

**Credentials:**
- Email: `nutrition@aharasetu.in`
- Password: `NutritionAyur@2024!`

**Important:** Password is case-sensitive and includes the `!` at the end.

**If changed:** Reset via database:
```bash
psql "$DATABASE_URL" << EOF
DELETE FROM doctors WHERE email = 'nutrition@aharasetu.in';
EOF
```

Then refresh page to auto-seed new account.

---

## Getting Help

If these solutions don't work:

1. **Check console logs:**
   - Open DevTools (F12)
   - Check Network tab for failed requests
   - Check Console for error messages

2. **Verify setup:**
   ```bash
   # Check environment
   echo "DATABASE_URL=$DATABASE_URL"
   echo "JWT_SECRET=$JWT_SECRET"
   
   # Check tables
   psql "$DATABASE_URL" -c "\dt"
   ```

3. **Check database directly:**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM doctors;"
   ```

   Should return 1 (the demo doctor).

---

## Common Scenarios

### Scenario 1: Fresh Install - Can't Login
1. Did you create `.env.local`? ✓
2. Did you run SQL migrations? ✓
3. Wait 3 seconds for auto-seed
4. Try login

### Scenario 2: Lost Demo Account
```bash
# Reset database
psql "$DATABASE_URL" -f scripts/003-reset-demo-account.sql
```

### Scenario 3: Multiple Login Attempts Failed
1. Check database connection
2. Verify SQL tables exist
3. Check browser cookies (DevTools → Application)
4. Clear browser cache and cookies, refresh

---

## Still Stuck?

1. Verify all steps in `SETUP.md`
2. Re-run SQL migrations
3. Delete `.next` folder: `rm -rf .next`
4. Reinstall dependencies: `pnpm install`
5. Restart server: `pnpm dev`

Good luck! 🌿
