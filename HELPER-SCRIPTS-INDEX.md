# Echo-AI Helper Scripts - Complete Index

## Quick Navigation

**First time?** Start here: `./setup-all.sh`

**Need help?** Read: `SETUP-QUICKSTART.md` (5 min read) or `SCRIPTS-README.md` (detailed)

**Check status?** Run: `./validate-setup.sh`

---

## All Helper Scripts

### Executable Scripts (in recommended usage order)

#### 1. setup-all.sh - Complete Automated Setup
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/setup-all.sh`
- **Size:** 10 KB (334 lines)
- **Executable:** Yes (chmod +x)
- **Time:** 5-10 minutes
- **Best for:** First-time complete setup

**What it does:**
```bash
./setup-all.sh
```
1. Validates Node.js, npm, PostgreSQL installed
2. Runs setup-env.sh for environment configuration
3. Installs npm dependencies (backend & mobile)
4. Sets up PostgreSQL database
5. Loads demo data (optional)
6. Starts backend and mobile services
7. Shows completion summary

**For Hackathon:** Gets entire project running in one command

---

#### 2. setup-env.sh - Environment Configuration
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/setup-env.sh`
- **Size:** 7.4 KB (290 lines)
- **Executable:** Yes (chmod +x)
- **Time:** 2-3 minutes
- **Best for:** Creating/updating .env files

**What it does:**
```bash
./setup-env.sh
```
1. Prompts for backend environment variables
2. Validates input (emails, ports, secrets)
3. Prompts for mobile environment variables
4. Creates/overwrites .env files
5. Supports partial setup (backend only, mobile only, or both)

**Environment Variables Configured:**

**Backend:**
- NODE_ENV, PORT, API_VERSION
- DATABASE_URL
- JWT_SECRET, JWT_EXPIRES_IN
- VAPI_API_KEY, VAPI_WEBHOOK_SECRET
- PIPEDREAM_WEBHOOK_URL
- CORS_ORIGIN, LOG_LEVEL

**Mobile:**
- EXPO_PUBLIC_API_URL
- EXPO_PUBLIC_VAPI_PUBLIC_KEY
- EXPO_PUBLIC_VAPI_ASSISTANT_ID
- EXPO_PUBLIC_APP_NAME
- EXPO_PUBLIC_APP_VERSION

---

#### 3. quick-start.sh - Service Management
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/quick-start.sh`
- **Size:** 10 KB (401 lines)
- **Executable:** Yes (chmod +x)
- **Time:** 1-2 minutes per command
- **Best for:** Starting, stopping, monitoring services

**Commands:**
```bash
./quick-start.sh                # Start all services (default)
./quick-start.sh start          # Explicitly start services
./quick-start.sh stop           # Stop all services
./quick-start.sh status         # Show running services
./quick-start.sh restart        # Stop and restart
./quick-start.sh logs-backend   # Stream backend logs
./quick-start.sh logs-mobile    # Stream mobile logs
./quick-start.sh help           # Show help message
```

**What it does:**
1. Checks prerequisites (Node.js, npm, .env files)
2. Installs dependencies if needed
3. Validates database connection
4. Starts backend (npm run dev) in background
5. Starts mobile (expo start) in background
6. Creates .backend.pid and .mobile.pid files
7. Logs output to .backend.log and .mobile.log
8. Shows status and service URLs

**Service URLs:**
- Backend API: `http://localhost:3000`
- Expo Dev: Check terminal output

---

#### 4. validate-setup.sh - Setup Validation
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/validate-setup.sh`
- **Size:** 12 KB (427 lines)
- **Executable:** Yes (chmod +x)
- **Time:** 1-2 minutes
- **Best for:** Verifying setup is complete and working

**What it does:**
```bash
./validate-setup.sh
```
1. Checks system requirements (Node.js, npm, PostgreSQL)
2. Verifies project structure exists
3. Confirms helper scripts present and executable
4. Validates .env files and variables
5. Checks npm dependencies installed
6. Verifies documentation present
7. Tests database connectivity
8. Confirms services running and responding
9. Verifies demo data loaded

**Output:**
- Color-coded pass/fail/warning report
- Count of checks passed/failed/warnings
- Recommendations for missing items
- Exit code for scripting/automation

---

### Data Files

#### seed-demo-data.sql - Demo Data Initialization
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/seed-demo-data.sql`
- **Size:** 8.8 KB (356 lines)
- **Type:** PostgreSQL SQL script
- **Time:** 30 seconds to load
- **Best for:** Demo presentations and testing

**Demo User:**
- Email: `demo@echoai.com`
- Password: `Demo123!`

**Sample Data Created:**
- 1 demo user account
- 5 sample goals (Career, Health, Finance, Personal Dev, Relationships)
- 4 milestones for progress tracking
- 3 voice session records with transcripts

**Usage:**
```bash
# Load demo data
source backend/.env
psql "$DATABASE_URL" -f seed-demo-data.sql

# Or direct connection
psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql

# Or in interactive psql
psql -d echoai_dev
\i seed-demo-data.sql
```

**Safe Features:**
- Can run multiple times (cleans up previous data first)
- Automatically disables foreign key checks during load
- Shows confirmation message with created data count

---

## Documentation Files

### SETUP-QUICKSTART.md - Quick Reference Guide
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/SETUP-QUICKSTART.md`
- **Size:** 5.4 KB
- **Read Time:** 5 minutes
- **Best for:** Getting started quickly

**Covers:**
- Option A: Automated setup
- Option B: Manual setup steps
- Verification steps
- Common issues & fixes
- Service URLs
- Commands reference
- File locations
- Success checklist

---

### SCRIPTS-README.md - Comprehensive Reference
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/SCRIPTS-README.md`
- **Size:** 15 KB
- **Read Time:** 15-20 minutes
- **Best for:** Detailed understanding and troubleshooting

**Covers:**
- Complete quick start
- Detailed script documentation
- All environment variables explained
- Prerequisites and validation
- Service endpoints and monitoring
- Log file management
- Troubleshooting guide
- Advanced usage patterns
- Database seeding details
- Performance tips
- Cleanup and reset procedures

---

### HELPER-SCRIPTS-SUMMARY.md - Technical Overview
- **Location:** `/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/HELPER-SCRIPTS-SUMMARY.md`
- **Size:** 11 KB
- **Read Time:** 10 minutes
- **Best for:** Overview and technical details

**Covers:**
- Overview and purpose of each script
- Features summary
- Technical details (validation, error handling)
- File modifications/creation list
- Getting started options
- Success metrics
- Hackathon benefits
- Support and maintenance

---

## File Organization

```
echo-ai-hackaton/
├── setup-all.sh              (Master setup script)
├── setup-env.sh              (Environment configuration)
├── quick-start.sh            (Service management)
├── validate-setup.sh         (Setup validation)
├── seed-demo-data.sql        (Demo data)
├── SETUP-QUICKSTART.md       (Quick start guide)
├── SCRIPTS-README.md         (Comprehensive reference)
├── HELPER-SCRIPTS-SUMMARY.md (Technical overview)
├── HELPER-SCRIPTS-INDEX.md   (This file)
├── backend/                  (Backend API)
│   ├── .env                  (Created by setup-env.sh)
│   ├── .env.example          (Template)
│   └── package.json
├── mobile/                   (Mobile app)
│   ├── .env                  (Created by setup-env.sh)
│   ├── .env.example          (Template)
│   └── package.json
└── docs/                     (Documentation)
```

---

## Usage Scenarios

### Scenario 1: First-Time Complete Setup
```bash
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton
./setup-all.sh
# Follow prompts, wait for services to start
# Done! Open mobile app in Expo
```
**Time:** 5-10 minutes

---

### Scenario 2: Manual Step-by-Step Setup
```bash
# Step 1: Configure environment
./setup-env.sh

# Step 2: Start services
./quick-start.sh

# Step 3: Load demo data (in another terminal)
psql -d echoai_dev -f seed-demo-data.sql

# Step 4: Verify everything
./validate-setup.sh
```
**Time:** 5-10 minutes

---

### Scenario 3: Just Start Services
```bash
./quick-start.sh
# Services start immediately
```
**Time:** 1-2 minutes (assumes env already configured)

---

### Scenario 4: Service Management
```bash
./quick-start.sh status        # Check what's running
./quick-start.sh logs-backend  # View backend logs
./quick-start.sh stop          # Stop services
./quick-start.sh restart       # Restart services
```

---

### Scenario 5: Verify Setup Works
```bash
./validate-setup.sh
# Shows detailed pass/fail report
```

---

## Command Quick Reference

### Setup & Configuration
```bash
./setup-all.sh              # Complete automated setup
./setup-env.sh              # Configure environment only
./validate-setup.sh         # Verify setup complete
```

### Service Management
```bash
./quick-start.sh start      # Start services
./quick-start.sh stop       # Stop services
./quick-start.sh status     # Check status
./quick-start.sh restart    # Restart services
./quick-start.sh help       # Show help
```

### Logging
```bash
./quick-start.sh logs-backend   # Stream backend logs
./quick-start.sh logs-mobile    # Stream mobile logs
tail -f .backend.log            # Manual log viewing
tail -f .mobile.log
```

### Database
```bash
# Load demo data
psql -d echoai_dev -f seed-demo-data.sql

# Connect to database
psql -d echoai_dev

# Query demo data
psql -d echoai_dev -c "SELECT COUNT(*) FROM goals;"
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Scripts not executable | `chmod +x *.sh` |
| Node.js not found | Install from nodejs.org |
| npm modules missing | `./setup-all.sh` will install |
| .env files missing | Run `./setup-env.sh` |
| Services won't start | Check logs with `./quick-start.sh logs-backend` |
| Database not accessible | Ensure PostgreSQL running, check credentials in .env |
| Port 3000 in use | Change PORT in backend/.env |
| Demo data won't load | Verify database exists and is accessible |

See SCRIPTS-README.md for detailed troubleshooting.

---

## Success Criteria

- [ ] Scripts are executable
- [ ] .env files configured
- [ ] Dependencies installed
- [ ] Backend running on http://localhost:3000
- [ ] Mobile/Expo dev server running
- [ ] Can login with demo@echoai.com
- [ ] Demo data visible in app
- [ ] Voice interaction working
- [ ] WhatsApp notifications received
- [ ] All services show "Running" in status

---

## For Hackathon Participants

These scripts accelerate development by:
- Reducing setup time from 30+ minutes to 5 minutes
- Automating dependency management
- Providing instant demo data
- Enabling rapid service restart during development
- Offering clear status visibility

**Recommended timeline:**
- 0-5 min: Run `./setup-all.sh`
- 5-10 min: Verify with `./validate-setup.sh`
- 10+ min: Begin feature development

This leaves nearly 6 hours for actual feature implementation.

---

## Additional Resources

| File | Purpose |
|------|---------|
| CLAUDE.md | Project architecture & specs |
| HACKATHON-QUICK-REF.md | Quick reference guide |
| IMPLEMENTATION-STATUS.md | Current implementation status |
| CREDENTIALS.md | API keys and credentials setup |

---

## Summary

**4 executable scripts + 1 data file + 4 documentation files = complete setup automation**

Start with: `./setup-all.sh`

For questions: See `SCRIPTS-README.md` or `SETUP-QUICKSTART.md`

All files are located in:
`/Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/`

Ready to build!
