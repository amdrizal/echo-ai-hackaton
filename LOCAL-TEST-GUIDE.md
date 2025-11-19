# Local Testing Guide - Echo-AI

**Goal:** Get backend + frontend running locally in 15 minutes

---

## Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# Check if PostgreSQL is installed
psql --version

# If not installed on macOS:
# brew install postgresql
```

---

## Step 1: Database Setup (5 minutes)

### Option A: Quick Local PostgreSQL

```bash
# Start PostgreSQL
brew services start postgresql

# Create database
createdb echoai_dev

# Initialize schema
psql echoai_dev < backend/scripts/init-db.sql

# Verify it worked
psql echoai_dev -c "SELECT COUNT(*) FROM users;"
# Should show: 1 (test user)
```

### Option B: Use SQLite for Quick Testing (Easiest)

If you want to skip PostgreSQL setup for now, I can modify the backend to use SQLite temporarily.

---

## Step 2: Configure Backend (2 minutes)

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with these MINIMAL settings for local testing:
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres@localhost:5432/echoai_dev
JWT_SECRET=test-secret-key-change-in-production-minimum-16-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
EOF
```

**Note:** Vapi and Pipedream can be skipped for initial testing - we'll test auth and goals first.

---

## Step 3: Start Backend (1 minute)

```bash
# From backend directory
npm run dev

# Should see:
# 🚀 Server running on port 3000
# 📡 API endpoint: http://localhost:3000/api/v1
# 🏥 Health check: http://localhost:3000/health
```

**Test it works:**
```bash
# In a new terminal
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"2025-11-19T..."}
```

---

## Step 4: Configure Frontend (2 minutes)

```bash
cd mobile

# Copy environment template
cp .env.example .env

# Edit .env with MINIMAL settings:
cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_APP_NAME=Echo-AI
EXPO_PUBLIC_APP_VERSION=1.0.0
EOF
```

**Note:** For local testing on iOS simulator, use `http://localhost:3000`
**For Android emulator, use:** `http://10.0.2.2:3000`
**For physical device, use:** Your computer's IP address (e.g., `http://192.168.1.100:3000`)

---

## Step 5: Start Frontend (1 minute)

```bash
# From mobile directory
npx expo start

# You'll see a QR code and options:
# › Press w │ open web
# › Press i │ open iOS simulator
# › Press a │ open Android emulator
```

**Choose your platform:**
- Press **w** for web browser (easiest for testing)
- Press **i** for iOS simulator (need Xcode installed)
- Press **a** for Android emulator (need Android Studio)

---

## Step 6: Test the Flow (5 minutes)

### Test 1: Registration
1. App should show Login screen
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Full Name: `Test User`
   - Email: `test@test.com`
   - Password: `password123`
   - Phone (optional): `+1234567890`
4. Click "Sign Up"
5. Should redirect to Goals screen

### Test 2: View Goals
1. Goals screen should show "No Goals Yet"
2. Pull down to refresh (should work)
3. Navigate to Profile tab
4. Should show your name and email

### Test 3: Manual Goal Creation (using API)

Since we haven't built a "Create Goal" UI button yet, test via API:

```bash
# First, get your auth token from the app
# Open browser console and type:
# localStorage.getItem('authToken')

# Then create a goal:
curl -X POST http://localhost:3000/api/v1/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Learn React Native",
    "description": "Build 3 mobile apps",
    "category": "education"
  }'
```

**OR** Add goal manually to database:
```bash
psql echoai_dev -c "
INSERT INTO goals (user_id, title, description, category, status, created_from_voice)
VALUES (
  (SELECT id FROM users WHERE email = 'test@test.com'),
  'Learn React Native',
  'Build 3 mobile apps',
  'education',
  'active',
  false
);
"
```

4. Pull to refresh on Goals screen
5. Should see new goal appear!

### Test 4: Logout/Login
1. Go to Profile tab
2. Click "Logout"
3. Should return to Login screen
4. Login with:
   - Email: `test@test.com`
   - Password: `password123`
5. Should see your goals again

---

## Verification Checklist

- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Frontend Expo server starts
- [ ] Can register new user
- [ ] Can login with created user
- [ ] Profile shows user info
- [ ] Can create goal via API
- [ ] Goals appear in list
- [ ] Pull-to-refresh works
- [ ] Category colors show correctly
- [ ] Can logout and login again

---

## Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in backend/.env
PORT=3001
```

**Error: "Database connection failed"**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql

# Verify database exists
psql -l | grep echoai_dev
```

### Frontend won't start

**Error: "Metro bundler error"**
```bash
cd mobile
npx expo start --clear
```

**Error: "Network request failed"**
- Check backend is running on http://localhost:3000
- For Android emulator, use `http://10.0.2.2:3000` in .env
- For physical device, use your computer's IP address

**Find your computer's IP:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Example output: inet 192.168.1.100
# Use: http://192.168.1.100:3000
```

### Registration/Login fails

**Check backend logs** for errors

**Test API directly:**
```bash
# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@test.com",
    "password": "password123",
    "fullName": "Test User 2"
  }'

# Should return user object and token
```

---

## Quick Commands Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd mobile && npx expo start

# View backend logs
cd backend && tail -f .backend.log

# Database shell
psql echoai_dev

# List all users
psql echoai_dev -c "SELECT id, email, full_name FROM users;"

# List all goals
psql echoai_dev -c "SELECT id, title, category, status FROM goals;"

# Clear database
psql echoai_dev -c "TRUNCATE users CASCADE;"
psql echoai_dev < backend/scripts/init-db.sql
```

---

## Next Steps After Basic Testing

Once everything works locally:

1. **Add Vapi Integration** - Get API keys and test voice
2. **Add Pipedream** - Get webhook URL and test WhatsApp
3. **Load Demo Data** - Run `seed-demo-data.sql`
4. **Practice Demo** - Use DEMO-SCRIPT.md

---

## Success! 🎉

If you've completed all tests above, your local setup is working perfectly!

**Both services running:**
- ✅ Backend API: http://localhost:3000
- ✅ Frontend App: http://localhost:8081 (web) or Expo app
- ✅ Database: echoai_dev with test data

Ready to add Vapi and Pipedream integration!
