# Setup Tonight - Pre-Hackathon Checklist

Complete these tasks tonight so tomorrow is pure execution.

---

## 1. Database Setup (5 minutes)

### Initialize External PostgreSQL Database (Render.com)

**✅ Database already created and configured!**

Connection string already in `backend/.env`:
```
DATABASE_URL=postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8
```

### Initialize Database Schema

```bash
# Option A: Using psql directly with external database
psql "postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8" -f docs/hackathon/specs/database-init.sql

# Option B: If psql not installed, you'll initialize via backend code tomorrow
# The workflow agents will create tables using Prisma/TypeORM migrations
```

### Verify Database Connection

```bash
# Test connection
psql "postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a.singapore-postgres.render.com/hackaton_dyw8" -c "SELECT 1;"

# If psql not installed, that's OK - agents will handle it tomorrow
```

✅ **Checkpoint:** Database connection string configured in .env

---

## 2. Vapi Account Setup (10 minutes)

### Create Account
1. Go to https://vapi.ai
2. Sign up (free tier available)
3. Verify email

### Create Assistant
1. Dashboard → Assistants → Create New
2. Fill in details:

```yaml
Name: Goal Coach

System Prompt: (Copy from docs/hackathon/specs/technical-specification.md)
# The complete prompt is in the spec under "Vapi Integration > Assistant Configuration"

Voice: en-US-JennyNeural (or similar friendly voice)

Model: GPT-4 Turbo

First Message: "Hey! I'm your goal coach. Tell me about something you'd like to achieve..."

End Call Phrases:
  - Thanks coach
  - That's all
  - Goodbye
  - I'm done
```

3. Save assistant
4. **Copy these values:**
   - Public Key: `pk_test_...` (from Settings → API Keys)
   - Assistant ID: `asst_...` (from assistant page URL)

### Configure Webhook

1. Dashboard → Webhooks → Add Webhook
2. URL: `http://localhost:3000/api/v1/webhooks/vapi/conversation-end` (for local testing)
3. Events: Select "call.ended"
4. Headers: Leave empty for now (add security later)
5. Save

✅ **Checkpoint:** Assistant created, API keys copied, webhook configured

---

## 3. Pipedream Account Setup (10 minutes)

### Create Account
1. Go to https://pipedream.com
2. Sign up (free tier available)
3. Verify email

### Create Workflow
1. Dashboard → Workflows → New
2. Name: "Vapi to WhatsApp - Goal Summary"

### Add Steps

**Step 1: HTTP Webhook Trigger**
- Type: HTTP / Webhook
- Method: POST
- Save and **copy webhook URL** (e.g., `https://eo123abc.m.pipedream.net`)

**Step 2: Code - Parse Data**
- Click "+ Add Step" → Code
- Language: Node.js (v18)
- Paste this code:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const { userName, phoneNumber, conversationSummary, goalsCreated } = steps.trigger.event.body;

    // Format goals list
    const goalsList = goalsCreated
      .map(g => `✓ ${g.title} (${g.category})`)
      .join('\n');

    // Create message
    const message = `🎯 *Goal Coaching Session Complete!*

Hey ${userName}! Here's what we discussed:

${conversationSummary}

*Goals Created:*
${goalsList}

Keep crushing it! 💪`;

    return {
      phoneNumber,
      message,
      userName
    };
  }
});
```

**Step 3: Send WhatsApp Message**
- Click "+ Add Step" → Search "WhatsApp"
- Select "Online Live Support" or "Twilio"
- **For now, use logging instead:**
  - Select "Node.js" instead
  - Code:
  ```javascript
  export default defineComponent({
    async run({ steps, $ }) {
      console.log('Would send WhatsApp to:', steps.parse_data.$return_value.phoneNumber);
      console.log('Message:', steps.parse_data.$return_value.message);
      return { sent: true };
    }
  });
  ```

### Test Workflow
1. Click "Test" in Step 1
2. Paste this test payload:
```json
{
  "userName": "Test User",
  "phoneNumber": "+1234567890",
  "conversationSummary": "User wants to learn Spanish and launch a side project",
  "goalsCreated": [
    { "title": "Learn Spanish", "category": "education" },
    { "title": "Launch side project", "category": "career" }
  ]
}
```
3. Click "Send Test Event"
4. Verify all steps execute successfully

✅ **Checkpoint:** Workflow created, webhook URL copied, test passes

---

## 4. Environment Files Setup (2 minutes)

### ✅ .env Files Already Created!

**Files already exist with most credentials filled in:**
- `backend/.env` - Database, Vapi private key, JWT secret configured
- `mobile/.env` - Vapi public key configured

### Update These After Creating Vapi Assistant (Step 2)

**In `mobile/.env`, add:**
```bash
EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_YOUR_ASSISTANT_ID_HERE
```

### Update After Creating Pipedream Workflow (Step 3)

**In `backend/.env`, add:**
```bash
PIPEDREAM_WEBHOOK_URL=https://eo123abc.m.pipedream.net
```

**That's it! Everything else is already configured.**

✅ **Checkpoint:** .env files exist, only need Assistant ID and Pipedream URL

---

## 5. Verify Environment (5 minutes)

### Check Node.js

```bash
node --version
# Should be v18.x or v20.x
```

### Check PostgreSQL

```bash
psql -U postgres -d echoai_dev -c "SELECT COUNT(*) FROM users;"
# Should return: count = 1
```

### Check Expo

```bash
npx expo --version
# Should install and show version if not already installed
```

### Test Vapi API Key

```bash
curl -H "Authorization: Bearer YOUR_VAPI_SECRET_KEY" \
  https://api.vapi.ai/assistant
# Should return list of assistants (or empty array)
```

✅ **Checkpoint:** All tools installed and working

---

## 6. Create Quick Reference Card (2 minutes)

Create `HACKATHON-QUICK-REF.md` in project root:

```markdown
# Echo-AI Hackathon Quick Reference

## Test Login
Email: test@echoai.com
Password: TestPass123!

## API Keys (From .env files)
Vapi Public Key: pk_test_...
Vapi Assistant ID: asst_...
Pipedream Webhook: https://eo...pipedream.net

## Database
Connection: postgresql://postgres:password@localhost:5432/echoai_dev
Test User ID: 1

## Ports
Backend: http://localhost:3000
Frontend (Expo): http://localhost:19006

## Commands
Start Backend: cd backend && npm run dev
Start Frontend: cd mobile && npx expo start
Database CLI: psql -U postgres -d echoai_dev

## Emergency Contacts
Vapi Docs: https://docs.vapi.ai
Pipedream Logs: https://pipedream.com/workflows
Expo Docs: https://docs.expo.dev
```

---

## Final Checklist - Tonight

Before bed, verify:

**✅ Already Done:**
- [x] Database credentials configured (external Render.com)
- [x] Vapi private API key in backend/.env
- [x] Vapi public API key in mobile/.env
- [x] JWT secret generated and configured
- [x] .env files created

**📝 TODO Tonight:**
- [ ] Database initialized (run SQL script or skip - agents handle tomorrow)
- [ ] Vapi account created
- [ ] Vapi assistant configured
- [ ] Vapi Assistant ID added to mobile/.env
- [ ] Pipedream account created
- [ ] Pipedream workflow created
- [ ] Pipedream webhook URL added to backend/.env
- [ ] Node.js v18+ installed
- [ ] Expo CLI available (will auto-install)

**If all checked:** You're ready for tomorrow! 🚀

**Minimum required for tomorrow:**
- [ ] Vapi Assistant ID
- [ ] Pipedream webhook URL
- [ ] Node.js installed

Everything else can be handled by the workflow agents!

---

## Tomorrow Morning Checklist (5 minutes)

Before starting workflow:

```bash
# 1. Start PostgreSQL
brew services start postgresql  # or your OS equivalent

# 2. Verify database
psql -U postgres -d echoai_dev -c "SELECT * FROM users;"

# 3. Verify .env files exist
ls backend/.env mobile/.env

# 4. Run the workflow
/hackathon-voice-ai-mvp
```

**Then follow the checkpoints!**

---

## Troubleshooting

**Database won't connect:**
```bash
# Check PostgreSQL is running
pg_isready

# Restart if needed
brew services restart postgresql
```

**Vapi keys not working:**
```bash
# Verify in dashboard: https://dashboard.vapi.ai/settings/api-keys
# Make sure you copied the PUBLIC key for frontend
# And SECRET key for backend
```

**Pipedream webhook not triggering:**
```bash
# Check logs: https://pipedream.com/workflows/[your-workflow-id]/logs
# Verify webhook URL in backend .env matches Pipedream URL
```

---

**You're all set! Sleep well and crush it tomorrow!** 💪🎯🚀
