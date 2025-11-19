# 🚀 Echo-AI Hackathon Quick Reference

**Keep this open during the hackathon!**

---

## ⚡ Quick Commands

```bash
# Start the workflow
/hackathon-voice-ai-mvp

# Start PostgreSQL
brew services start postgresql  # Mac
sudo systemctl start postgresql # Linux

# Start Backend (once created)
cd backend && npm run dev

# Start Frontend (once created)
cd mobile && npx expo start

# Database CLI
psql -U postgres -d echoai_dev
```

---

## 🔑 Test Credentials & API Keys

**Test User (Will be in database after init)**
```
Email: test@echoai.com
Password: TestPass123!
User ID: 1
Phone: +1234567890
```

**Database Connection (External - Render.com)**
```
postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8
```

**Vapi Keys (Already in .env files)**
```
Private API Key: 03baffac-91a5-4d19-b0f3-45e5be2eca3f
Public API Key:  20123b06-1118-478c-aadd-4ee130f93a35
Assistant ID:    [Fill in after creating assistant tonight]
```

**JWT Secret (Already in backend/.env)**
```
f8e7d6c5b4a3928170695847362514089fe7d6c5b4a39281706958473625
```

---

## 🌐 API Endpoints Reference

**Base URL:** `http://localhost:3000/api/v1`

### Auth
```
POST /auth/register  - Create account
POST /auth/login     - Get JWT token
GET  /auth/me        - Get current user
```

### Goals (Requires JWT)
```
POST   /goals       - Create goal
GET    /goals       - List goals
GET    /goals/:id   - Get goal
PUT    /goals/:id   - Update goal
DELETE /goals/:id   - Delete goal
```

### Webhooks
```
POST /webhooks/vapi/conversation-end - Vapi callback
```

---

## 📦 API Keys & URLs

**✅ Already configured in .env files:**

### Vapi
```
Private Key:  03baffac-91a5-4d19-b0f3-45e5be2eca3f ✅
Public Key:   20123b06-1118-478c-aadd-4ee130f93a35 ✅
Assistant ID: [Create tonight - see setup-tonight.md]
```

### Database
```
Connection: postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@... ✅
(External Render.com database)
```

### Pipedream
```
Webhook URL: [Create tonight - see setup-tonight.md]
```

### JWT
```
Secret: f8e7d6c5b4a3928170695847362514089fe7d6c5b4a39281706958473625 ✅
```

---

## 📁 File Locations

### Specs (Reference These During Build)
```
docs/hackathon/specs/technical-specification.md  - Complete API spec
docs/hackathon/specs/database-init.sql          - Database schema
docs/hackathon/specs/setup-tonight.md           - Setup instructions
```

### Workflow Files
```
.bmad/bmm/workflows/hackathon-voice-ai-mvp/
  ├── workflow.yaml      - Configuration
  ├── instructions.md    - Execution steps
  ├── checklist.md       - Validation (108 checks)
  └── README.md          - Documentation
```

### Environment Files (Create These)
```
backend/.env   - Backend config
mobile/.env    - Frontend config
```

---

## ⏱️ Timeline Checkpoints

### Hour 1 (9:00-10:00) - Foundation
- ✅ Backend scaffold (Express + PostgreSQL)
- ✅ Frontend scaffold (Expo + React Native)
- ✅ JWT auth working
- ✅ Login/register screens
- **Test:** Can register and login

### Hours 2-4 (10:00-1:00) - Parallel Features
**30-min checkpoints at 10:30, 11:00, 11:30, 12:00, 12:30**

- ✅ Backend: Goal CRUD + Vapi webhooks
- ✅ Frontend: Goal screens + Voice UI
- ✅ Vapi: Voice calls working
- ✅ WhatsApp: Pipedream integration
- **Test:** Voice call creates goals

### Hour 5 (1:00-2:00) - Integration
- ✅ End-to-end flow working
- ✅ Bug fixes
- **Test:** Complete user journey

### Hour 6 (2:00-3:00) - Demo Prep
- ✅ UI polish
- ✅ Demo script
- ✅ Test data
- ✅ Practice run
- **Test:** Can demo confidently

---

## 🎯 P0 Features (Must Work for Demo)

1. ✅ JWT authentication
2. ✅ User login/register
3. ✅ Vapi voice calls
4. ✅ Goals created from voice
5. ✅ Goals display in app

**If only these 5 work, you can demo!**

---

## 🔧 Troubleshooting Quick Fixes

### Database Won't Connect
```bash
# Check if running
pg_isready

# Restart
brew services restart postgresql

# Verify database exists
psql -U postgres -c "\l" | grep echoai_dev
```

### Vapi Call Won't Start
```bash
# Check API keys in mobile/.env
cat mobile/.env | grep VAPI

# Test in browser console
fetch('https://api.vapi.ai/assistant', {
  headers: { 'Authorization': 'Bearer YOUR_SECRET_KEY' }
})
```

### Backend Won't Start
```bash
# Check .env file exists
ls backend/.env

# Check database connection
psql -U postgres -d echoai_dev -c "SELECT 1;"

# Check port not in use
lsof -i :3000
```

### Expo Won't Start
```bash
# Clear cache
npx expo start -c

# Reinstall
cd mobile
rm -rf node_modules
npm install
```

---

## 🆘 Emergency Fallbacks

**If Vapi fails:**
- Use manual text input for goals
- Show pre-recorded demo video

**If WhatsApp fails:**
- Show summary in-app instead
- Use console.log to demonstrate flow

**If database fails:**
- Use in-memory array (temporary)
- Restart PostgreSQL

**If running out of time:**
- Focus ONLY on P0 features
- Drop P2, then P1 if needed
- Have screenshots as backup

---

## 📞 Essential Links

- **Vapi Dashboard:** https://dashboard.vapi.ai
- **Vapi Docs:** https://docs.vapi.ai
- **Pipedream Workflows:** https://pipedream.com/workflows
- **Expo Docs:** https://docs.expo.dev
- **Technical Spec:** `docs/hackathon/specs/technical-specification.md`

---

## 🎬 Demo Script Template

**5 Minutes Total**

1. **Intro (30s):** "Echo-AI is voice-first goal coaching..."
2. **Register (30s):** Quick sign-up
3. **Voice (2min):** Talk to AI, set goals (THE STAR)
4. **Goals (1min):** See goals created automatically
5. **WhatsApp (1min):** Show message received (THE WOW)
6. **Outro (30s):** Multi-platform showcase

**Practice this 2-3 times before presenting!**

---

## ✅ Pre-Demo Checklist

30 minutes before demo:

- [ ] Backend running (http://localhost:3000)
- [ ] Frontend running (Expo)
- [ ] Database has test data
- [ ] Test user can login
- [ ] Voice call works
- [ ] Goals appear after call
- [ ] WhatsApp sends (or fallback ready)
- [ ] Phone charged
- [ ] Demo script practiced
- [ ] Screenshots as backup

---

## 🎯 Success Metrics

**Minimum (Can Demo):**
- 5/5 P0 features work
- No crashes in happy path

**Great Demo:**
- All P0 + 2 P1 features
- WhatsApp integration live
- Polished UI

**Outstanding Demo:**
- All features working
- Multi-platform showcase
- "Wow" moments

---

**You got this! 🚀💪**

---

## 📋 Tonight's TODO

Run through `docs/hackathon/specs/setup-tonight.md`:

- [ ] Database initialized
- [ ] Vapi account + assistant
- [ ] Pipedream workflow
- [ ] .env files created
- [ ] All keys filled in
- [ ] Quick test of each service

**Sleep well, execute tomorrow!**
