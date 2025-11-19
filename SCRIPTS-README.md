# Echo-AI Helper Scripts Documentation

This directory contains automation scripts to streamline the setup and execution of the Echo-AI hackathon project. These scripts handle environment configuration, service startup, and demo data initialization.

## Quick Start

```bash
# 1. Configure environment variables
./setup-env.sh

# 2. Start backend and frontend services
./quick-start.sh

# 3. (Optional) Seed demo data into the database
psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql
```

---

## Script Details

### 1. setup-env.sh - Environment Configuration

**Purpose**: Interactive script that guides users through creating and configuring `.env` files for both backend and mobile applications.

**Features**:
- Validates environment variable formats
- Interactive prompts with default values
- Supports partial setup (backend only, mobile only, or both)
- Input validation for:
  - Email addresses
  - Port numbers (1-65535)
  - JWT secrets (minimum 16 characters)
  - API URLs (must start with http/https)
- Color-coded output for clarity

**Usage**:
```bash
./setup-env.sh
```

**Interactive Options**:
```
Select option (1-3) [1]:
1) Both (Backend + Mobile)      # Configure everything
2) Backend only                  # Configure backend .env only
3) Mobile only                   # Configure mobile .env only
```

**Environment Variables Configured**:

**Backend (.env)**:
- `NODE_ENV` - Development/production mode
- `PORT` - API server port (default: 3000)
- `API_VERSION` - API version prefix (default: v1)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing (min 16 chars)
- `JWT_EXPIRES_IN` - Token expiration duration (default: 7d)
- `VAPI_API_KEY` - Vapi voice AI integration key
- `VAPI_WEBHOOK_SECRET` - Webhook authentication secret
- `PIPEDREAM_WEBHOOK_URL` - WhatsApp integration webhook
- `CORS_ORIGIN` - Allowed frontend origins for CORS
- `LOG_LEVEL` - Logging verbosity (debug/info/warn/error)

**Mobile (.env)**:
- `EXPO_PUBLIC_API_URL` - Backend API endpoint
- `EXPO_PUBLIC_VAPI_PUBLIC_KEY` - Vapi public key for frontend
- `EXPO_PUBLIC_VAPI_ASSISTANT_ID` - Vapi assistant configuration
- `EXPO_PUBLIC_APP_NAME` - Application display name
- `EXPO_PUBLIC_APP_VERSION` - App version for display

**Example Database URL**:
```
postgresql://postgres:password@localhost:5432/echoai_dev
```

**Example JWT Secret**:
```
your-super-secret-jwt-key-min-16-chars
```

---

### 2. quick-start.sh - Service Startup

**Purpose**: Automated startup script that validates prerequisites, installs dependencies if needed, and starts both backend and frontend services with monitoring.

**Features**:
- Prerequisite validation (Node.js, npm, .env files)
- Automatic dependency installation if needed
- PostgreSQL connection check
- Launches backend API server on port 3000
- Launches Expo development server for mobile app
- Real-time service status monitoring
- Graceful shutdown with signal handling
- Separate log files for debugging

**Usage**:
```bash
./quick-start.sh [COMMAND]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `start` (default) | Start both backend and mobile services |
| `stop` | Stop all running services |
| `status` | Show current status of services |
| `restart` | Stop and restart all services |
| `logs-backend` | Stream backend service logs in real-time |
| `logs-mobile` | Stream mobile service logs in real-time |
| `help` | Display help message |

**Examples**:
```bash
# Start services (default)
./quick-start.sh

# Check service status
./quick-start.sh status

# View backend logs live
./quick-start.sh logs-backend

# Restart services
./quick-start.sh restart

# Stop all services
./quick-start.sh stop
```

**Prerequisites Checked**:
- Node.js runtime installed
- npm package manager installed
- Backend .env file exists
- Mobile .env file exists
- node_modules installed in both directories
- PostgreSQL database is accessible (optional warning if unavailable)

**Service Endpoints**:
- **Backend API**: `http://localhost:3000`
- **Expo Metro Bundler**: Check terminal output for tunneling URL
- **Mobile App**: Available through Expo on iOS/Android/Web

**Log Files Generated**:
- `.backend.log` - Backend service output
- `.mobile.log` - Mobile service output
- `.backend.pid` - Backend process ID
- `.mobile.pid` - Mobile process ID

**How to View Logs**:
```bash
# Stream backend logs
tail -f .backend.log

# Stream mobile logs
tail -f .mobile.log

# View specific number of lines
tail -n 50 .backend.log
```

**Monitoring**:
The script shows real-time status after startup:
- Process ID and running status
- Service URLs
- Log file locations
- Instructions for stopping services

---

### 3. seed-demo-data.sql - Demo Data

**Purpose**: SQL script that initializes a demo user account and sample goals across multiple categories for testing and demonstration purposes.

**Features**:
- Creates complete demo user with credentials
- Creates 5 sample goals across different categories
- Adds milestone tracking for goals
- Includes voice session records (transcripts)
- Safe to run multiple times (cleans up previous demo data)
- Color-formatted confirmation output

**Demo User Credentials**:
```
Email:    demo@echoai.com
Password: Demo123!
```

**Sample Data Created**:

**Users** (1 record):
- Demo User Account with credentials above
- Created with timestamps for realistic demo

**Goals** (5 records across categories):
1. **Career**: "Complete Advanced TypeScript Course"
   - Status: In Progress
   - Created via voice: Yes
   - Priority: High

2. **Health**: "Run a 5K Race"
   - Status: In Progress
   - Created via voice: Yes
   - Priority: High

3. **Finance**: "Save $5,000 for Emergency Fund"
   - Status: Pending
   - Created via voice: No (manual)
   - Priority: High

4. **Personal Development**: "Read 12 Books This Year"
   - Status: In Progress
   - Created via voice: Yes
   - Priority: Medium

5. **Relationships**: "Weekly Dinner with Family"
   - Status: Pending
   - Created via voice: No (manual)
   - Priority: Medium

**Milestones** (4 records):
- TypeScript Module 1 (Completed)
- TypeScript Module 2 (Planned)
- 5K Week 1 Training (Pending)
- Q1 Reading Target (Completed)

**Voice Sessions** (3 records):
- Detailed transcripts showing natural voice interactions
- Varying durations (189-312 seconds)
- Associated with their respective goals

**Usage**:

**Option 1: Direct execution** (recommended)
```bash
psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql
```

**Option 2: Using database URL from .env**
```bash
source backend/.env
psql "$DATABASE_URL" -f seed-demo-data.sql
```

**Option 3: Interactive psql**
```bash
psql -U postgres -d echoai_dev
\i seed-demo-data.sql
```

**Prerequisites**:
- PostgreSQL installed and running
- Database `echoai_dev` created
- Tables created (schema must exist)
- User has appropriate permissions

**Important Notes**:
- The password hash in the script is a placeholder - in production, passwords should be hashed via bcrypt in the application during user registration
- Script uses foreign key disabling to safely clear demo data without conflicts
- Safe to run multiple times - will clean up previous demo data first
- All data includes realistic timestamps (relative to NOW())

**Verification**:
After running the script, verify the data was created:

```sql
-- Check demo user
SELECT id, email, first_name, last_name FROM users WHERE email = 'demo@echoai.com';

-- Check sample goals
SELECT id, title, category, status FROM goals WHERE user_id = 'demo-user-001';

-- Check voice sessions
SELECT id, transcript FROM voice_sessions WHERE user_id = 'demo-user-001';

-- Count milestones
SELECT COUNT(*) as milestone_count FROM milestones WHERE goal_id LIKE 'goal-%';
```

**Expected Output**:
```
║                    DEMO DATA CREATED                       ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Demo User:                                               ║
║    Email:    demo@echoai.com                              ║
║    Password: Demo123!                                     ║
║                                                            ║
║  Sample Data:                                             ║
║    - 1 Demo User Account                                  ║
║    - 5 Sample Goals (Career, Health, Finance, etc.)      ║
║    - 4 Milestones for tracking progress                  ║
║    - 3 Voice Session Records                             ║
║                                                            ║
║  Ready for Demo Presentation                             ║
║                                                            ║
```

---

## Complete Setup Workflow

### Step 1: Configure Environment
```bash
./setup-env.sh

# Follow the interactive prompts:
# - Select option 1 for both backend and mobile
# - Enter database credentials (matching your PostgreSQL setup)
# - Enter Vapi and Pipedream API keys
# - Use defaults for other values if unsure
```

### Step 2: Start Services
```bash
./quick-start.sh

# You should see:
# ✓ Backend started (PID: xxxxx)
# ✓ Mobile/Frontend started (PID: xxxxx)
#
# URLs:
# - Backend API: http://localhost:3000
# - Expo Dev: [check terminal for URL]
```

### Step 3: Seed Demo Data (Optional)
```bash
# Make sure backend is running and database is accessible
psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql

# Or using environment variables
source backend/.env
psql "$DATABASE_URL" -f seed-demo-data.sql
```

### Step 4: Test Everything Works
```bash
# In a new terminal, check backend API
curl http://localhost:3000/api/v1/health

# View running services
./quick-start.sh status

# View logs if needed
./quick-start.sh logs-backend
./quick-start.sh logs-mobile
```

### Step 5: Start Demo Flow
- Open mobile app in Expo
- Login with: demo@echoai.com / Demo123!
- View pre-seeded goals
- Test voice interaction with Vapi
- Check goal creation and tracking

---

## Troubleshooting

### setup-env.sh Issues

**Issue**: Invalid input validation keeps rejecting my entries
- **Solution**: JWT secret must be at least 16 characters. Port must be between 1-65535. Email must be in valid format.

**Issue**: "*.env.example not found"
- **Solution**: Ensure you're running the script from the project root directory

### quick-start.sh Issues

**Issue**: "Node.js is not installed"
- **Solution**: Install Node.js from https://nodejs.org (LTS version recommended)

**Issue**: "Failed to start backend" or "Failed to start mobile"
- **Solution**: Check logs with `./quick-start.sh logs-backend` or `.logs-mobile`

**Issue**: "Cannot connect to PostgreSQL database"
- **Solution**:
  - Ensure PostgreSQL is running: `brew services list` on macOS
  - Verify credentials in backend/.env
  - Create database: `createdb echoai_dev`

**Issue**: "Port 3000 already in use"
- **Solution**: Either stop the other service or change PORT in backend/.env

**Issue**: npm dependencies take too long to install
- **Solution**: This is normal on first run. Consider running `npm install` separately while working on other setup

### seed-demo-data.sql Issues

**Issue**: "FATAL: database 'echoai_dev' does not exist"
- **Solution**: Create the database first: `createdb echoai_dev`

**Issue**: "permission denied for schema public"
- **Solution**: Ensure your PostgreSQL user has proper permissions

**Issue**: "relation 'users' does not exist"
- **Solution**: Database schema must be created first (run migrations)

**Issue**: Foreign key constraint violation
- **Solution**: Script handles this automatically with `SET session_replication_role = 'replica'`

---

## Advanced Usage

### Running Services in Separate Windows

If you prefer to run services separately for better monitoring:

```bash
# Terminal 1: Start backend only
cd backend && npm run dev

# Terminal 2: Start mobile only
cd mobile && npm start

# Terminal 3: Monitor logs
tail -f .backend.log
tail -f .mobile.log
```

### Custom Database Seeding

To add more sample data beyond the demo script:

```sql
-- Create custom goals
INSERT INTO goals (id, user_id, title, description, category, status, created_at, updated_at)
VALUES ('custom-goal-001', 'demo-user-001', 'Your Goal', 'Description', 'Category', 'pending', NOW(), NOW());
```

### Environment Variable Files

You can create and manage multiple environment configurations:

```bash
# Create alternate configuration
cp backend/.env backend/.env.staging
cp mobile/.env mobile/.env.staging

# Edit as needed for different environments
# Switch by updating quick-start.sh to source the appropriate file
```

---

## Performance Tips

- **First run**: Initial npm install can take 3-5 minutes. This is normal.
- **Database queries**: If responses are slow, ensure PostgreSQL indexes are created
- **Expo bundling**: Metro bundler caching can take a minute on first run
- **Memory usage**: Both services typically use < 200MB each

---

## Cleanup

To remove generated files and reset:

```bash
# Stop services
./quick-start.sh stop

# Remove generated files
rm -f .backend.log .mobile.log .backend.pid .mobile.pid

# Remove .env files (to reconfigure)
rm backend/.env mobile/.env

# Optionally, clean up demo data from database
psql -d echoai_dev -c "DELETE FROM users WHERE email = 'demo@echoai.com';"
```

---

## Support and Debugging

**Enable Debug Logging**:
```bash
# In backend/.env
LOG_LEVEL=debug

# Restart backend
./quick-start.sh restart
```

**Check System Requirements**:
```bash
node --version    # Should be v16+
npm --version     # Should be v7+
psql --version    # Should be v12+
```

**View Full Error Messages**:
```bash
# Without piping to log file (may be verbose)
cd backend && npm run dev

# Or check full logs
cat .backend.log | grep -i error
```

---

## File Locations Reference

| File | Purpose | Location |
|------|---------|----------|
| setup-env.sh | Environment configuration | `/project-root/setup-env.sh` |
| quick-start.sh | Service startup | `/project-root/quick-start.sh` |
| seed-demo-data.sql | Demo data initialization | `/project-root/seed-demo-data.sql` |
| Backend .env | Backend config | `/backend/.env` |
| Mobile .env | Mobile config | `/mobile/.env` |
| Backend logs | Service output | `/project-root/.backend.log` |
| Mobile logs | Service output | `/project-root/.mobile.log` |

---

## Summary

These scripts automate the most time-consuming parts of project setup:

1. **setup-env.sh** eliminates manual .env configuration with validation
2. **quick-start.sh** handles dependency checking, service startup, and monitoring
3. **seed-demo-data.sql** creates realistic demo data for immediate testing

Together, they reduce setup time from 30+ minutes to under 5 minutes and provide a solid foundation for hackathon development and demo presentation.

For detailed project information, see `CLAUDE.md` and `IMPLEMENTATION-STATUS.md`.
