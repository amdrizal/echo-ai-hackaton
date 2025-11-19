# Echo-AI Quick Start Guide

**Get up and running in 5 minutes. This is your launch pad.**

---

## Prerequisites Checklist

Before you start, verify you have:

- [ ] **Node.js v18+** installed (`node --version`)
- [ ] **Vapi Account** with Assistant ID (`asst_...`)
- [ ] **Pipedream Account** with webhook URL (`https://eo...pipedream.net`)
- [ ] **PostgreSQL Running** (local or remote connection string in .env)
- [ ] **Environment files** configured (`.env` in `/backend` and `/mobile`)

**Not ready?** See [CLAUDE.md](../../CLAUDE.md) for detailed setup instructions.

---

## 3-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Backend dependencies
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/backend
npm install

# Frontend dependencies
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile
npm install
```

**Expected output:** Both should complete without errors. If you see warnings about peer dependencies, that's OK.

### Step 2: Initialize Database (1 minute)

```bash
# Option A: If PostgreSQL running locally
psql -U postgres -d echoai_dev -f ../docs/hackathon/specs/database-init.sql

# Option B: If using external database (Render.com)
psql "postgresql://[user]:[password]@[host]/[database]" -f docs/hackathon/specs/database-init.sql

# Option C: Skip this - let backend auto-create tables on first run
# (The application will create tables if they don't exist)
```

**Verify database is ready:**
```bash
psql -U postgres -d echoai_dev -c "SELECT COUNT(*) FROM users;"
# Should return: count = 0 (empty, not an error)
```

### Step 3: Start Servers (1 minute)

**Terminal 1 - Backend API:**
```bash
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/backend
npm run dev
# Wait for: "Server running on http://localhost:3000"
```

**Terminal 2 - Frontend App:**
```bash
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile
npx expo start
# Select 'w' for web, or 'i' for iOS simulator, or 'a' for Android
```

**Expected state:** Both running without errors, app loads in browser/simulator.

---

## Common Issues & Fixes

### Issue: "npm install" fails with dependency errors

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Database connection refused

**Fix:**
```bash
# Check PostgreSQL is running
pg_isready

# If not running, start it:
brew services start postgresql  # macOS
# or: sudo service postgresql start  # Linux
```

**Alternative:** Update `.env` with correct connection string:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

### Issue: Vapi connection fails ("undefined assistant")

**Fix:**
1. Verify `VAPI_ASSISTANT_ID` is set in `mobile/.env`:
   ```bash
   grep VAPI_ASSISTANT_ID mobile/.env
   # Should return: EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_xxxxx
   ```
2. Verify assistant exists in Vapi dashboard: https://dashboard.vapi.ai/assistants
3. If missing, create new assistant in setup checklist above

### Issue: Frontend won't connect to backend

**Fix:**
1. Verify backend is running on port 3000:
   ```bash
   lsof -i :3000
   # Should show Node.js process
   ```
2. Check API base URL in `mobile/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:3000/api/v1';
   ```
3. If running on different host, update this URL

### Issue: "Module not found" errors

**Fix:**
```bash
# Make sure you're in the right directory
pwd  # Should show /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/backend or /mobile

# If wrong, navigate to correct location:
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/backend
npm install
```

---

## Quick Commands Reference

```bash
# Start everything
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/backend && npm run dev &
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile && npx expo start

# Test API
curl http://localhost:3000/api/v1/health

# Login (test credentials)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@echoai.com","password":"TestPass123!"}'

# Database debug
psql -U postgres -d echoai_dev
\dt                    # List tables
SELECT * FROM users;   # View users
\q                     # Exit
```

---

## Environment Variables - What You Need

**`backend/.env` must contain:**
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
VAPI_PUBLIC_KEY=pk_test_...
VAPI_PRIVATE_KEY=sk_test_...
PIPEDREAM_WEBHOOK_URL=https://eo...pipedream.net
NODE_ENV=development
PORT=3000
```

**`mobile/.env` must contain:**
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_VAPI_PUBLIC_KEY=pk_test_...
EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_...
```

**Missing variables?** They're already in the `.env` files. Just verify they're filled in.

---

## Next Steps

- **To test the full flow:** See [DEMO-SCRIPT.md](./DEMO-SCRIPT.md)
- **To deploy to production:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **For technical details:** See [technical-specification.md](./specs/technical-specification.md)
- **For pre-flight checklist:** See [setup-tonight.md](./specs/setup-tonight.md)

---

## Still Stuck?

Check these in order:

1. **Backend not starting?**
   - `npm install` complete? (if not, do step 1 again)
   - Port 3000 free? (`lsof -i :3000`)
   - .env file exists? (`ls backend/.env`)

2. **Frontend won't load?**
   - Backend running first? (start that in terminal 1)
   - Internet connected? (Expo needs initial download)
   - Correct directory? (`pwd` should end in `/mobile`)

3. **Database errors?**
   - PostgreSQL running? (`pg_isready`)
   - Connection string correct? (check `.env`)
   - Schema initialized? (run database-init.sql)

4. **Vapi not working?**
   - Assistant ID in `mobile/.env`? (not missing)
   - Public key correct? (starts with `pk_`)
   - Assistant exists in Vapi dashboard?

**Last resort:** Check the detailed docs:
- Architecture: [technical-specification.md](./specs/technical-specification.md)
- API docs: [technical-specification.md#backend-api-specification](./specs/technical-specification.md)
- Full setup: [setup-tonight.md](./specs/setup-tonight.md)

---

**You're ready! Hit Terminal 1, hit Terminal 2, and let's go.** 🚀
