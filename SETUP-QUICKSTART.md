# Echo-AI Setup - Quick Start Guide

Get Echo-AI running in minutes with these simple commands.

## Option A: Automated Setup (Recommended)

Run the all-in-one setup script:

```bash
./setup-all.sh
```

This will:
- Check prerequisites
- Configure environment variables
- Install dependencies
- Setup database
- Load demo data
- Start services

**Time:** 5-10 minutes (depending on npm install speed)

---

## Option B: Manual Setup (Step by Step)

### Step 1: Configure Environment
```bash
./setup-env.sh
```
Follow the interactive prompts to set up `.env` files.

**What to enter:**
- Backend: Database credentials, JWT secret, API keys
- Mobile: Backend URL, Vapi keys

**Default values work fine** if you don't have API keys yet.

### Step 2: Start Services
```bash
./quick-start.sh
```

You should see:
```
✓ Backend started (PID: xxxxx)
✓ Mobile/Frontend started (PID: xxxxx)
```

### Step 3: Load Demo Data (Optional)
```bash
psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql
```

Demo login:
- Email: `demo@echoai.com`
- Password: `Demo123!`

---

## Verify Setup Works

### Check Backend API
```bash
curl http://localhost:3000/api/v1/health
```

Should return: `{"status":"ok"}`

### Check Services Running
```bash
./quick-start.sh status
```

Should show both services as "Running"

### View Logs
```bash
./quick-start.sh logs-backend
./quick-start.sh logs-mobile
```

---

## Common Issues & Fixes

### PostgreSQL Not Found
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb echoai_dev
```

### Node.js Not Installed
- Download from: https://nodejs.org (v16+ recommended)
- Verify: `node --version`

### Port 3000 Already in Use
```bash
# Option 1: Change port in backend/.env
PORT=3001

# Option 2: Find and stop process using port 3000
lsof -i :3000
kill -9 <PID>
```

### npm Install Very Slow
This is normal on first run (2-5 minutes). Subsequent runs are faster.

### Services Won't Start
Check logs:
```bash
tail -f .backend.log
tail -f .mobile.log
```

Most common issues:
- Missing `.env` files
- Database not running
- Node.js/npm not installed

---

## File Locations

| File | Purpose | Run From |
|------|---------|----------|
| `setup-all.sh` | Complete automated setup | Project root |
| `setup-env.sh` | Configure .env files only | Project root |
| `quick-start.sh` | Start/stop services | Project root |
| `seed-demo-data.sql` | Load demo data | Anywhere (with psql) |
| `SCRIPTS-README.md` | Detailed documentation | Reference |

---

## Service URLs

Once started:

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | `http://localhost:3000` | REST API |
| Expo Dev | Check terminal | Mobile app testing |

---

## Next Steps

1. **Login** to the app with demo credentials
2. **Create a goal** via voice or manual entry
3. **Check WhatsApp** for goal notifications
4. **View milestones** and track progress

---

## Commands Reference

```bash
# Setup & Configuration
./setup-all.sh              # Complete setup (recommended)
./setup-env.sh              # Configure environment only
./quick-start.sh            # Start services

# Service Management
./quick-start.sh start      # Start all services
./quick-start.sh stop       # Stop all services
./quick-start.sh status     # Check service status
./quick-start.sh restart    # Restart services

# Logs & Debugging
./quick-start.sh logs-backend   # View backend logs
./quick-start.sh logs-mobile    # View mobile logs

# Database
psql -d echoai_dev -f seed-demo-data.sql   # Load demo data
psql -d echoai_dev                         # Connect to database
```

---

## Troubleshooting Steps

If something doesn't work:

1. **Check prerequisites:**
   ```bash
   node --version
   npm --version
   psql --version
   ```

2. **Check .env files exist:**
   ```bash
   ls -l backend/.env mobile/.env
   ```

3. **View error logs:**
   ```bash
   ./quick-start.sh logs-backend
   ./quick-start.sh logs-mobile
   ```

4. **Check service status:**
   ```bash
   ./quick-start.sh status
   ```

5. **Try stopping and restarting:**
   ```bash
   ./quick-start.sh stop
   sleep 2
   ./quick-start.sh start
   ```

6. **Check database connection:**
   ```bash
   psql "postgresql://postgres:password@localhost:5432/echoai_dev"
   ```

---

## Demo Walkthrough

Once everything is running:

```
1. Open mobile app (Expo terminal shows link)
2. Tap "Login"
3. Enter: demo@echoai.com / Demo123!
4. See pre-loaded goals
5. Tap "Voice Coach" to talk to Vapi
6. Speak about your goals
7. Watch goal appear in list
8. Check phone for WhatsApp notification
```

---

## Getting Help

- See `SCRIPTS-README.md` for detailed docs
- See `CLAUDE.md` for project architecture
- Check `.backend.log` and `.mobile.log` for errors
- Run: `./quick-start.sh help`

---

## Time Estimates

| Task | Time |
|------|------|
| First time setup | 5-10 min |
| Reconfiguring env | 2 min |
| Starting services | 1 min |
| Loading demo data | 30 sec |
| Full verification | 3 min |

---

## Success Checklist

- [ ] Node.js installed (`node --version` shows v16+)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL installed and running
- [ ] `.env` files configured
- [ ] `node_modules` installed (backend & mobile)
- [ ] Backend running on http://localhost:3000
- [ ] Expo dev server running
- [ ] Demo data loaded (optional)
- [ ] Can login with demo@echoai.com

---

**Ready to go!** Start with: `./setup-all.sh`
