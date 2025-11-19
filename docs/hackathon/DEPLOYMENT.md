# Echo-AI Deployment Guide

**Deploy to production. End-to-end deployment for backend, frontend, and databases.**

---

## Deployment Architecture

```
┌─────────────────┐         ┌──────────────┐
│  Frontend       │         │  Backend     │
│  Vercel / Web   │◄────────┤  Railway     │
│                 │  HTTP   │              │
└─────────────────┘         └──────────────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │ PostgreSQL   │
                            │ Render.com   │
                            └──────────────┘
```

---

## Part 1: Backend Deployment to Railway

### Prerequisites

- Railway account (free tier available at https://railway.app)
- GitHub account with code pushed
- Vapi and Pipedream credentials ready

### Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your GitHub account
5. Select `echo-ai-hackaton` repository
6. Select `/backend` as the root directory
7. Click "Deploy"

Railway will auto-detect Node.js and create a deployment.

### Step 2: Configure Environment Variables

1. In Railway dashboard, go to your project
2. Click the "backend" service
3. Go to "Variables" tab
4. Add these environment variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET=generate-a-random-long-string-here
VAPI_PUBLIC_KEY=pk_test_...
VAPI_PRIVATE_KEY=sk_test_...
PIPEDREAM_WEBHOOK_URL=https://eo...pipedream.net
NODE_ENV=production
PORT=3000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Configure Database Connection

**Option A: Use existing Render.com database**

Copy `DATABASE_URL` from `backend/.env` and paste into Railway variables above.

**Option B: Create new PostgreSQL on Railway**

1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway auto-configures `DATABASE_URL`
4. Copy the `DATABASE_URL` from PostgreSQL service
5. Paste into backend service variables

### Step 4: Initialize Database Schema

After deployment, run migrations:

```bash
# Via Railway CLI
railway run npm run migrate
# or
railway run psql $DATABASE_URL -f docs/hackathon/specs/database-init.sql

# Via direct psql (if available)
psql $DATABASE_URL -f docs/hackathon/specs/database-init.sql
```

### Step 5: Verify Backend Deployment

1. Go to Railway project → backend service
2. Click "Deployments" tab
3. Wait for status to show "Success" (green checkmark)
4. Copy the service URL (e.g., `https://echo-ai-backend-prod.up.railway.app`)
5. Test the API:

```bash
curl https://[your-railway-url]/api/v1/health
# Should return: {"status":"ok"}
```

6. Save this URL for frontend configuration

**Logs:** If deployment fails, check Logs tab for errors

---

## Part 2: Frontend Deployment to Vercel

### Prerequisites

- Vercel account (free tier at https://vercel.com)
- GitHub account
- Backend URL from Part 1

### Step 1: Configure Environment for Deployment

**In `mobile/.env.production`** (create if not exists):

```bash
EXPO_PUBLIC_API_BASE_URL=https://[your-railway-url]/api/v1
EXPO_PUBLIC_VAPI_PUBLIC_KEY=pk_test_...
EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_...
EXPO_PUBLIC_ENV=production
```

### Step 2: Export Expo Web Build

```bash
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile

# Build for web
npx expo export --platform web

# This creates /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile/dist
# which is ready for deployment
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from mobile directory
cd /Users/rajasekargunasekaran/Documents/ACRIZAL/echo-ai-hackaton/mobile

vercel
```

During setup:
- Scope: Select your account
- Project name: `echo-ai`
- Framework: `Other` (since it's React Native exported)
- Output directory: `dist`
- Environment variables:
  ```
  EXPO_PUBLIC_API_BASE_URL=[your-railway-url]/api/v1
  EXPO_PUBLIC_VAPI_PUBLIC_KEY=pk_test_...
  EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_...
  ```

Vercel will deploy and provide a URL like `https://echo-ai.vercel.app`

### Step 4: Enable CORS in Backend

Update `backend/src/middleware/cors.ts`:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:19006',      // Expo development
    'http://localhost:3000',       // Local web
    'https://echo-ai.vercel.app',  // Vercel deployment
    'https://*.vercel.app'         // All Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

Deploy backend changes to Railway.

---

## Part 3: Detailed Configuration Walkthroughs

### Database Migration in Production

**If using Render.com PostgreSQL:**

```bash
# Export connection details
export DATABASE_URL="postgresql://user:password@host:port/database"

# Run SQL schema init
psql $DATABASE_URL -f docs/hackathon/specs/database-init.sql

# Verify tables created
psql $DATABASE_URL -c "\dt"
# Should show: users, goals, conversations (if enabled)
```

**If using Railway PostgreSQL:**

```bash
# Via Railway CLI
railway run psql -c "\dt"

# Or use Railway UI
# Service → PostgreSQL → Logs → Query Terminal
```

### Environment Variables - Full Reference

**Backend (Railway):**

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | Copy from Render/Railway |
| `JWT_SECRET` | Random 32-char string | Generate with: `openssl rand -hex 16` |
| `VAPI_PUBLIC_KEY` | `pk_test_...` | From Vapi dashboard |
| `VAPI_PRIVATE_KEY` | `sk_test_...` | From Vapi dashboard (backend only) |
| `PIPEDREAM_WEBHOOK_URL` | `https://eo...pipedream.net` | From Pipedream workflow |
| `NODE_ENV` | `production` | Required for Railway |
| `PORT` | `3000` | Railway will set automatically |

**Frontend (Vercel):**

| Variable | Value | Notes |
|----------|-------|-------|
| `EXPO_PUBLIC_API_BASE_URL` | `https://[railway-url]/api/v1` | Backend URL from Railway |
| `EXPO_PUBLIC_VAPI_PUBLIC_KEY` | `pk_test_...` | From Vapi dashboard (public only) |
| `EXPO_PUBLIC_VAPI_ASSISTANT_ID` | `asst_...` | From Vapi dashboard |
| `EXPO_PUBLIC_ENV` | `production` | For analytics/logging |

### Securing Vapi Webhooks (Optional)

In production, add webhook authentication:

**1. In `backend/src/routes/webhooks.ts`:**

```typescript
import crypto from 'crypto';

const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET;

export function verifyVapiSignature(req, res, next) {
  const signature = req.headers['x-vapi-signature'];
  const timestamp = req.headers['x-vapi-timestamp'];

  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const message = `${timestamp}.${JSON.stringify(req.body)}`;
  const expectedSig = crypto
    .createHmac('sha256', VAPI_WEBHOOK_SECRET)
    .update(message)
    .digest('hex');

  if (signature !== expectedSig) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}

// Use in webhook route:
router.post('/vapi/conversation-end', verifyVapiSignature, handleVapiWebhook);
```

**2. Add to Railway environment:**

```
VAPI_WEBHOOK_SECRET=[your-webhook-secret]
```

**3. Configure in Vapi dashboard:**
- Webhook settings → Add header: `x-vapi-signature`
- Vapi will automatically sign requests

---

## Part 4: Testing Deployments

### Test Backend (Railway)

```bash
# Health check
curl https://[railway-url]/api/v1/health

# Register new user
curl -X POST https://[railway-url]/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prod@test.com",
    "password": "TempPass123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST https://[railway-url]/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prod@test.com",
    "password": "TempPass123!"
  }'

# Create goal (use token from login)
curl -X POST https://[railway-url]/api/v1/goals \
  -H "Authorization: Bearer [token-from-login]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Launch production MVP",
    "description": "Complete end-to-end deployment",
    "category": "career",
    "targetDate": "2025-11-20"
  }'
```

### Test Frontend (Vercel)

1. Visit `https://echo-ai.vercel.app`
2. Register account
3. Login
4. Verify API calls work (check browser DevTools → Network)
5. Test voice integration (click "Talk to Coach")

### Test WhatsApp Integration

Send message to Pipedream workflow:

```bash
curl -X POST [your-pipedream-webhook-url] \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Deployed User",
    "phoneNumber": "+1234567890",
    "conversationSummary": "Discussed launching the Echo-AI product",
    "goalsCreated": [
      {"title": "Ship MVP", "category": "career"},
      {"title": "Get feedback", "category": "personal"}
    ]
  }'
```

Check Pipedream logs to verify workflow executed.

---

## Part 5: Monitoring & Troubleshooting

### View Logs

**Railway backend logs:**
```bash
railway logs -s backend
# or via dashboard: Project → backend → Logs
```

**Vercel frontend logs:**
```bash
vercel logs [url] --follow
# or via dashboard: Project → Deployments → Logs
```

**Pipedream logs:**
Visit https://pipedream.com/workflows/[id]/logs

### Common Production Issues

**Issue: "Cannot connect to database"**
```
Solution: Verify DATABASE_URL in Railway variables matches actual database
- Check Render.com database URL hasn't changed
- Restart Railway deployment to pick up new variables
```

**Issue: "CORS error in browser console"**
```
Solution: Update backend CORS config with Vercel domain
- Add https://echo-ai.vercel.app to cors.origin array
- Redeploy backend
```

**Issue: "Vapi calls not working in production"**
```
Solution: Verify Vapi public key is correct
- Check EXPO_PUBLIC_VAPI_PUBLIC_KEY in Vercel
- Verify EXPO_PUBLIC_VAPI_ASSISTANT_ID is set
- Test with curl to Vapi API directly
```

**Issue: "WhatsApp messages not sending"**
```
Solution: Check Pipedream workflow
1. Visit https://pipedream.com/workflows/[id]/logs
2. Verify webhook is receiving POST requests
3. Check step-by-step execution in logs
4. Test with sample payload from QUICK-START.md
```

---

## Part 6: Post-Deployment Checklist

Before demo:

- [ ] Backend health check passes: `curl https://[railway-url]/api/v1/health`
- [ ] Frontend loads without errors: `https://echo-ai.vercel.app`
- [ ] Can register new account
- [ ] Can login with test account
- [ ] Can create goal via API (use curl test above)
- [ ] Vapi voice calls connect
- [ ] WhatsApp integration works (check Pipedream logs)
- [ ] Database shows records: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"`

---

## Rollback Plan

If something breaks:

**Railway backend rollback:**
1. Railway dashboard → Deployments
2. Click previous "Success" deployment
3. Click "Redeploy"

**Vercel frontend rollback:**
1. Vercel dashboard → Deployments
2. Click previous deployment with checkmark
3. Click "Promote to Production"

---

## Cost Estimates (Free Tiers)

- **Railway:** 500 hours/month free = ~$5/month if exceeded
- **Vercel:** Unlimited free for small projects
- **Render.com PostgreSQL:** Free tier with limits (~1 GB)
- **Pipedream:** Free tier with 100 workflow executions/month

**Total estimated cost:** $0-10/month with free tiers

---

## Next Steps

- Production URL ready? Add to [DEMO-SCRIPT.md](./DEMO-SCRIPT.md)
- Need SSL certificates? (Railway and Vercel auto-provision)
- Need custom domain? (Both support domain mapping, $12+/year)
- Need scaling? Check Railway/Vercel documentation for paid plans

---

**Deployment complete! Your app is live.** 🚀
