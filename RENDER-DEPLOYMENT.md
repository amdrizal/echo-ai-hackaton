# Deploy Echo-AI to Render.com 🚀

This guide covers deploying your hackathon MVP to production.

## Architecture Overview

- **Backend API**: Node.js/Express → Render Web Service
- **Database**: PostgreSQL → Already on Render ✅
- **Frontend Web**: Expo Web → Render Static Site
- **Mobile Apps**: Expo → Expo EAS Build

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

Create a `render.yaml` file in the **backend** directory:

```yaml
services:
  - type: web
    name: echo-ai-backend
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: hackaton_dyw8
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: VAPI_API_KEY
        sync: false

databases:
  - name: hackaton_dyw8
    databaseName: hackaton_dyw8
    user: admin
    region: singapore
    plan: free
```

### Step 2: Update Backend package.json

Ensure your `backend/package.json` has proper start scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build needed for Node.js'",
    "init-db": "node init-db.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Step 3: Add Health Check Endpoint

Update `backend/src/server.ts` (or create if using .js):

```typescript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Existing routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/goals', goalRoutes);
// ... rest of your routes
```

### Step 4: Deploy Backend to Render

#### Option A: Via Render Dashboard (Recommended)

1. **Go to** https://dashboard.render.com
2. **Click** "New +" → "Web Service"
3. **Connect** your GitHub repository
4. **Configure**:
   - Name: `echo-ai-backend`
   - Region: `Singapore` (same as your DB)
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=(auto-filled from existing DB)
   JWT_SECRET=(generate new secret)
   VAPI_API_KEY=03baffac-91a5-4d19-b0f3-45e5be2eca3f
   PIPEDREAM_WEBHOOK_URL=(your Pipedream URL)
   ```

6. **Click** "Create Web Service"
7. **Wait** for deployment (5-10 minutes)

#### Option B: Via render.yaml (Automatic)

1. **Commit** the `render.yaml` file to your repo
2. **Push** to GitHub
3. **In Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will auto-detect the `render.yaml`
   - Click "Apply"

### Step 5: Link Existing Database

1. In Render dashboard, go to your new web service
2. Click "Environment"
3. For `DATABASE_URL`:
   - Click "Add from Database"
   - Select your existing database: `hackaton_dyw8`
   - Choose "Internal Connection String"
4. Save changes

### Step 6: Initialize Database on Render

Since your database tables might not exist on the production DB:

1. **Update init-db.js** to use Render's DATABASE_URL:
   ```javascript
   // Already configured! Your init-db.js uses process.env.DATABASE_URL
   ```

2. **Run database initialization**:
   - In Render dashboard, go to your web service
   - Click "Shell" (or use SSH)
   - Run: `node init-db.js`

Or create a migration script:
```bash
npm run init-db
```

### Step 7: Test Backend Deployment

Your backend will be available at: `https://echo-ai-backend.onrender.com`

Test it:
```bash
# Health check
curl https://echo-ai-backend.onrender.com/health

# Test registration
curl -X POST https://echo-ai-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

---

## Part 2: Deploy Frontend to Render (Web Version)

### Step 1: Build Expo for Web

In the `mobile` directory:

```bash
# Install dependencies
npm install

# Build for web production
npx expo export:web
```

This creates a `web-build` directory with static files.

### Step 2: Create Static Site on Render

1. **Go to** Render Dashboard
2. **Click** "New +" → "Static Site"
3. **Configure**:
   - Name: `echo-ai-web`
   - Repository: Your GitHub repo
   - Branch: `main`
   - Root Directory: `mobile`
   - Build Command: `npm install && npx expo export:web`
   - Publish Directory: `web-build`

4. **Environment Variables**:
   ```
   EXPO_PUBLIC_API_URL=https://echo-ai-backend.onrender.com/api/v1
   EXPO_PUBLIC_VAPI_PUBLIC_KEY=20123b06-1118-478c-aadd-4ee130f93a35
   EXPO_PUBLIC_VAPI_ASSISTANT_ID=86b1f3f9-0a8a-49d7-93e9-a11657bede91
   ```

5. **Click** "Create Static Site"

### Step 3: Configure SPA Routing

For React Router (if needed):

Create `mobile/public/_redirects`:
```
/*    /index.html   200
```

### Step 4: Test Frontend Deployment

Your frontend will be available at: `https://echo-ai-web.onrender.com`

---

## Part 3: Deploy Mobile Apps (Optional)

For iOS and Android native apps, use Expo EAS Build:

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Configure EAS

```bash
cd mobile
eas login
eas build:configure
```

### Step 3: Update app.json

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### Step 4: Build for Production

```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Step 5: Submit to App Stores

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

---

## Part 4: Configure Custom Domain (Optional)

### For Backend
1. In Render dashboard, go to your web service
2. Click "Settings" → "Custom Domain"
3. Add: `api.echoai.app`
4. Update DNS records as instructed

### For Frontend
1. In Render dashboard, go to your static site
2. Click "Settings" → "Custom Domain"
3. Add: `app.echoai.app`
4. Update DNS records

---

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://admin:PASSWORD@dpg-XXX.singapore-postgres.render.com/hackaton_dyw8
JWT_SECRET=your-super-secret-jwt-key-change-this
VAPI_API_KEY=03baffac-91a5-4d19-b0f3-45e5be2eca3f
PIPEDREAM_WEBHOOK_URL=https://your-pipedream-url
```

### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=https://echo-ai-backend.onrender.com/api/v1
EXPO_PUBLIC_VAPI_PUBLIC_KEY=20123b06-1118-478c-aadd-4ee130f93a35
EXPO_PUBLIC_VAPI_ASSISTANT_ID=86b1f3f9-0a8a-49d7-93e9-a11657bede91
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Backend code is production-ready
- [ ] Database schema is finalized
- [ ] All API endpoints tested
- [ ] Frontend builds successfully
- [ ] Environment variables documented
- [ ] Secrets are secure (not in code)

### Backend Deployment
- [ ] Render web service created
- [ ] DATABASE_URL linked
- [ ] Environment variables set
- [ ] Health check endpoint works
- [ ] Database initialized with schema
- [ ] Demo data loaded (optional)

### Frontend Deployment
- [ ] Static site created on Render
- [ ] Build succeeds
- [ ] Environment variables point to production backend
- [ ] Routing works (SPA redirects)
- [ ] Vapi integration works

### Post-Deployment
- [ ] Test registration/login
- [ ] Test voice calling
- [ ] Test emotion detection
- [ ] Check backend logs for errors
- [ ] Monitor database connections
- [ ] Set up error tracking (Sentry, optional)

---

## Monitoring & Logs

### View Backend Logs
1. Go to Render Dashboard
2. Select `echo-ai-backend`
3. Click "Logs" tab
4. Monitor real-time logs

### View Build Logs
1. Click "Events" tab
2. See deployment history
3. Debug build failures

### Database Logs
1. Go to your PostgreSQL database
2. Click "Logs"
3. Monitor queries and connections

---

## Troubleshooting

### Backend Deployment Fails

**Check:**
- Build command runs successfully locally
- All dependencies in package.json
- Node version matches (18+)
- Start command is correct

**Fix:**
```bash
# Test locally first
cd backend
npm install
npm start
```

### Frontend Build Fails

**Check:**
- Expo web build works locally
- All dependencies installed
- No TypeScript errors

**Fix:**
```bash
cd mobile
npm install
npx expo export:web
```

### Database Connection Errors

**Check:**
- DATABASE_URL is correct
- SSL is enabled for production
- Database is in same region as web service

**Fix:**
Update `backend/src/config/database.ts`:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
});
```

### CORS Errors

**Update** `backend/src/server.ts`:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:8081',
    'https://echo-ai-web.onrender.com'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Add response caching
- Implement rate limiting
- Use connection pooling

### Frontend
- Enable code splitting
- Optimize images
- Use lazy loading
- Cache API responses

### Database
- Add indexes on frequently queried columns
- Use connection pooling
- Implement query caching

---

## Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] Database password is secure
- [ ] API keys are not in code
- [ ] CORS is properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using parameterized queries)
- [ ] HTTPS enforced
- [ ] Environment variables properly set

---

## Next Steps After Deployment

1. **Custom Domain**: Add your own domain
2. **Monitoring**: Set up Sentry or LogRocket
3. **Analytics**: Add Google Analytics or Mixpanel
4. **CI/CD**: Set up automatic deployments on push
5. **Scaling**: Upgrade plans as user base grows

---

## Quick Commands Reference

```bash
# Backend deployment
cd backend
npm install
npm start

# Frontend deployment
cd mobile
npm install
npx expo export:web

# Database initialization
cd backend
node init-db.js

# EAS Build
cd mobile
eas build --platform android
eas build --platform ios
```

---

**Your app is now live! 🎉**

- Backend: `https://echo-ai-backend.onrender.com`
- Frontend: `https://echo-ai-web.onrender.com`
- Mobile: Available via Expo Go or native builds
