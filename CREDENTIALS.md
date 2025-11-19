# 🔐 Echo-AI Credentials & Configuration

**Store this securely - contains all access credentials**

---

## Database (External - Render.com)

**Connection String:**
```
postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8
```

**Parsed Details:**
- **Host:** dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com
- **Database:** hackaton_dyw8
- **Username:** admin
- **Password:** bImNAvwK5yQz0gCGoY73faW0MOonw8VD
- **Port:** 5432 (default)
- **Location:** Singapore

**Usage:**
- Already configured in `backend/.env`
- No local PostgreSQL installation needed
- Accessible from anywhere (external cloud database)

---

## Vapi Voice AI

**Private API Key (Backend):**
```
03baffac-91a5-4d19-b0f3-45e5be2eca3f
```
- Already in `backend/.env` as `VAPI_API_KEY`
- Used for server-side Vapi API calls
- Used for webhook signature verification

**Public API Key (Frontend):**
```
20123b06-1118-478c-aadd-4ee130f93a35
```
- Already in `mobile/.env` as `EXPO_PUBLIC_VAPI_PUBLIC_KEY`
- Used for client-side voice calls
- Safe to expose in mobile app

**Assistant ID:**
```
86b1f3f9-0a8a-49d7-93e9-a11657bede91
```
- Already in `mobile/.env` as `EXPO_PUBLIC_VAPI_ASSISTANT_ID` ✅

**Dashboard:**
https://dashboard.vapi.ai

---

## JWT Authentication

**Secret Key:**
```
f8e7d6c5b4a3928170695847362514089fe7d6c5b4a39281706958473625
```
- Already in `backend/.env` as `JWT_SECRET`
- Used for signing and verifying JWT tokens
- Keep this secret - don't commit to git

**Expiration:**
- 7 days (configured as `7d`)

---

## Pipedream (WhatsApp Integration)

**Webhook URL:**
```
[Create tonight - update backend/.env after setup]
```
- Format: `https://eo123abc.m.pipedream.net`
- Get from Pipedream workflow trigger
- Add to `backend/.env` as `PIPEDREAM_WEBHOOK_URL`

**Dashboard:**
https://pipedream.com/workflows

---

## Test User (After Database Init)

**Credentials:**
```
Email:    test@echoai.com
Password: TestPass123!
```

**User Details:**
- ID: 1
- Full Name: Test User
- Phone: +1234567890

**Password Hash (in database):**
```
$2b$10$N9qo8uLOickgx2ZMRZo7ee.CnpMJdZr2l0JzGYKUl/eM6SsNJL6fu
```
(bcrypt hash of "TestPass123!" with 10 rounds)

---

## API Endpoints

**Backend (Local):**
```
http://localhost:3000/api/v1
```

**Backend (Production - After Deploy):**
```
[Update after Railway/Render deployment]
```

---

## Environment Files Status

### ✅ backend/.env
```bash
DATABASE_URL=postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@...  ✅
JWT_SECRET=f8e7d6c5b4a3928170695847362514089fe7d6c5b4a39281706958473625  ✅
VAPI_API_KEY=03baffac-91a5-4d19-b0f3-45e5be2eca3f                     ✅
PIPEDREAM_WEBHOOK_URL=                                                 ⏳
```

### ✅ mobile/.env
```bash
EXPO_PUBLIC_VAPI_PUBLIC_KEY=20123b06-1118-478c-aadd-4ee130f93a35      ✅
EXPO_PUBLIC_VAPI_ASSISTANT_ID=86b1f3f9-0a8a-49d7-93e9-a11657bede91    ✅
```

**Legend:**
- ✅ Already configured
- ⏳ Add tonight after setup

---

## Security Notes

**✅ Safe to expose (public):**
- Vapi Public API Key (frontend)
- Backend API URL
- Database host (has authentication)

**🔒 Keep secret (never commit):**
- Vapi Private API Key
- Database password
- JWT secret
- Pipedream webhook URLs (optional security)

**Git Protection:**
- `.env` files are already in `.gitignore`
- Never commit credentials to repository
- Use `.env.example` templates for sharing structure

---

## Quick Access Commands

**Test Database Connection:**
```bash
psql "postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8" -c "SELECT 1;"
```

**Test Vapi API Key:**
```bash
curl -H "Authorization: Bearer 03baffac-91a5-4d19-b0f3-45e5be2eca3f" \
  https://api.vapi.ai/assistant
```

**View .env Files:**
```bash
cat backend/.env
cat mobile/.env
```

---

## Backup & Recovery

**If .env files get deleted:**
1. Copy credentials from this file
2. Recreate using templates in `docs/hackathon/specs/technical-specification.md`
3. All values documented here

**If database needs reset:**
```bash
psql "postgresql://admin:..." -f docs/hackathon/specs/database-init.sql
```

---

## Next Steps

**Tonight:**
1. ✅ Database connection - Ready
2. ✅ Vapi keys - Ready
3. ✅ Vapi assistant created - Assistant ID added
4. ⏳ Create Pipedream workflow - Get webhook URL
5. ⏳ Update backend/.env with Pipedream URL

**Tomorrow:**
1. Run workflow: `/hackathon-voice-ai-mvp`
2. Agents use these credentials automatically
3. Build MVP in 6 hours!

---

**All credentials stored and ready!** 🔐✅
