# Hackathon Voice AI MVP - Validation Checklist

Use this checklist to validate MVP completion and demo readiness.

## 🎯 P0 Features (Must-Have) - CRITICAL

### Authentication & User Management
- [ ] Users can register with email and password
- [ ] Password is hashed securely (bcrypt with 10+ rounds)
- [ ] Users can login and receive JWT token
- [ ] JWT token contains userId, email, iat, and exp fields
- [ ] Protected API endpoints require valid JWT in Authorization header
- [ ] Frontend stores JWT securely (AsyncStorage or localStorage)
- [ ] Frontend sends JWT with all authenticated requests
- [ ] Invalid/expired tokens return 401 Unauthorized
- [ ] Users can logout (token cleared from storage)

### Database & Models
- [ ] PostgreSQL database is running and accessible
- [ ] User model/table exists with required fields (id, email, password_hash, created_at)
- [ ] Goal model/table exists with required fields (id, user_id, title, description, category, status, created_at)
- [ ] Conversation model/table exists (optional but recommended)
- [ ] Database migrations run successfully
- [ ] Foreign key relationships properly configured (Goal.user_id → User.id)
- [ ] Can insert and query data without errors

### Backend API - Goal CRUD
- [ ] POST /api/v1/goals creates new goal and returns 201 Created
- [ ] GET /api/v1/goals returns authenticated user's goals only
- [ ] GET /api/v1/goals/:id returns goal details if owned by user
- [ ] PUT /api/v1/goals/:id updates goal if owned by user
- [ ] DELETE /api/v1/goals/:id deletes goal if owned by user
- [ ] All endpoints require authentication (return 401 if no token)
- [ ] Validation errors return 400 Bad Request with error details
- [ ] CORS configured to allow frontend origin
- [ ] Error responses follow consistent JSON format

### Backend API - Vapi Webhooks
- [ ] POST /api/v1/webhooks/vapi/conversation-end endpoint exists
- [ ] Webhook receives Vapi payload correctly
- [ ] Webhook extracts goals from conversation transcript
- [ ] Webhook creates Goal records in database
- [ ] Webhook saves Conversation record (optional)
- [ ] Webhook returns 200 OK on success
- [ ] Webhook authenticated (signature verification or secret token)

### Frontend - Navigation & Screens
- [ ] App initializes without errors
- [ ] Auth Stack shows LoginScreen and RegisterScreen when not logged in
- [ ] Main Stack shows after successful login
- [ ] Bottom tab navigator has HomeTab, VoiceTab, ProfileTab (or similar)
- [ ] Can navigate between all screens without crashes
- [ ] Back navigation works correctly
- [ ] Deep linking handled (optional for MVP)

### Frontend - Auth Screens
- [ ] LoginScreen has email and password inputs
- [ ] RegisterScreen has email, password, and confirm password inputs
- [ ] Login button calls backend auth endpoint
- [ ] Successful login stores JWT and navigates to Main Stack
- [ ] Failed login shows error message
- [ ] Registration creates user and logs them in
- [ ] Loading states shown during API calls
- [ ] Form validation (email format, password length)

### Frontend - Goal Screens
- [ ] HomeScreen fetches and displays user's goals from backend
- [ ] Each goal shows title, category, and date
- [ ] Empty state shown when no goals exist ("No goals yet" message)
- [ ] Pull-to-refresh works to reload goals
- [ ] Tapping goal navigates to GoalDetailScreen
- [ ] GoalDetailScreen shows full goal information
- [ ] Can edit goal via form (title, description, category)
- [ ] Can delete goal with confirmation dialog
- [ ] Goal list updates after create/edit/delete

### Frontend - Voice Screen
- [ ] VoiceScreen renders without errors
- [ ] "Talk to Coach" button is visible and tappable
- [ ] Button tap initiates Vapi voice call
- [ ] Voice call connection status displayed ("Connecting...", "Connected", "Ended")
- [ ] Can hear AI coach voice
- [ ] Conversation transcript displays (real-time or after call)
- [ ] Can end call manually with button
- [ ] Loading/status indicators during call setup

### Vapi Integration
- [ ] Vapi account created and assistant configured
- [ ] Vapi assistant has appropriate system prompt for goal coaching
- [ ] Vapi API credentials (public key, private key) obtained
- [ ] Vapi SDK installed in frontend (@vapi-ai/react-native or /web)
- [ ] Can initiate voice call from mobile app
- [ ] Can have conversation with AI coach (voice works both ways)
- [ ] Conversation is natural and context-aware
- [ ] Call ends properly when user hangs up
- [ ] Vapi sends webhook to backend on conversation end
- [ ] Goals mentioned in conversation are extracted and created in database

### Goal Creation from Voice
- [ ] After voice call ends, goals are created in backend
- [ ] Frontend goal list refreshes and shows new goals
- [ ] Goal titles are clear and accurately reflect conversation
- [ ] Goal categories assigned appropriately
- [ ] Multiple goals from one call are all created
- [ ] Edge case handled: No goals mentioned (no error, friendly message)
- [ ] Edge case handled: Ambiguous goals (saved as-is or skipped gracefully)

---

## ⭐ P1 Features (Nice-to-Have)

### WhatsApp Integration
- [ ] Pipedream account created
- [ ] Pipedream workflow created and configured
- [ ] Vapi sends conversation-end event to Pipedream webhook
- [ ] Pipedream receives Vapi webhook successfully
- [ ] Pipedream formats WhatsApp message with summary and goals
- [ ] WhatsApp API credentials configured (session ID, phone numbers)
- [ ] WhatsApp message sends successfully
- [ ] Message received on test phone
- [ ] Message contains conversation summary
- [ ] Message lists goals created
- [ ] Error handling: Failed sends are logged
- [ ] (Optional) Retry logic for transient failures

### Goal Progress Tracking
- [ ] Can manually mark goals as in-progress, completed, or abandoned
- [ ] Goal status updates persist in database
- [ ] Goal list shows status visually (colors, icons)
- [ ] Completed goals have celebration UI (animation, confetti)

### Voice Conversation History
- [ ] Conversation records saved to database
- [ ] Can view past conversation transcripts
- [ ] Can see which goals came from which conversation

---

## 💎 P2 Features (If-Time)

### Goal Reminders via WhatsApp
- [ ] Can schedule WhatsApp reminders for goals
- [ ] Reminders sent at specified times
- [ ] Reminder message includes goal title and deadline

### Achievement Celebrations
- [ ] Animations or confetti when goal is completed
- [ ] Achievement badges or milestones
- [ ] Share achievement to social media (optional)

### Multi-Goal Management
- [ ] Can organize goals into categories
- [ ] Can set goal priorities
- [ ] Can create sub-goals (goal hierarchy)

---

## 🎨 UI/UX Quality

### Visual Polish
- [ ] Consistent color scheme throughout app (2-3 brand colors)
- [ ] Proper spacing and padding (not cramped or too loose)
- [ ] Text is readable (good contrast, appropriate font sizes)
- [ ] Buttons are easily tappable (minimum 44x44 touch target)
- [ ] Loading indicators shown for async operations
- [ ] Success/error feedback (toasts, alerts, or inline messages)
- [ ] Icons used appropriately (tabs, actions, categories)
- [ ] Smooth animations (fade in, slide, transitions)
- [ ] Empty states have helpful messages or illustrations
- [ ] Error states handled gracefully (no ugly crashes)

### Voice Screen Polish
- [ ] Voice visualization (pulse, wave, or animated circle) during call
- [ ] Clear status messages ("Listening...", "Processing...", "Call ended")
- [ ] Smooth transitions between call states
- [ ] Transcript easy to read (scrollable, proper formatting)

### Goal List Polish
- [ ] Card-based layout with shadows or borders
- [ ] Category badges with distinct colors
- [ ] Consistent goal card design
- [ ] Smooth animations when adding/removing goals

---

## 📱 Platform-Specific

### iOS
- [ ] App runs on iOS simulator or device without crashes
- [ ] Microphone permissions requested and granted
- [ ] Voice call audio works properly
- [ ] Navigation feels native (swipe back gestures)
- [ ] Status bar style appropriate
- [ ] Safe area insets respected (no content under notch)

### Android
- [ ] App runs on Android emulator or device without crashes
- [ ] Microphone permissions requested and granted
- [ ] Voice call audio works properly
- [ ] Back button navigation works correctly
- [ ] Status bar styling appropriate

### Web
- [ ] App runs in web browser (Chrome, Safari)
- [ ] Microphone permissions requested and granted
- [ ] Voice call works in browser
- [ ] Responsive layout (looks good on desktop and mobile web)
- [ ] No console errors or warnings

---

## 🔒 Security & Data

### Authentication Security
- [ ] Passwords never stored in plain text
- [ ] JWT secret is strong and kept in environment variable
- [ ] JWT expiration time set (e.g., 7 days)
- [ ] HTTPS used in production (HTTP OK for local dev)
- [ ] No sensitive data in JWT payload (passwords, secrets)

### API Security
- [ ] All sensitive endpoints require authentication
- [ ] Users can only access their own data (goal ownership verified)
- [ ] SQL injection prevented (using parameterized queries or ORM)
- [ ] Input validation on all endpoints (prevent XSS, injection)
- [ ] Rate limiting configured (optional for MVP)

### Data Privacy
- [ ] User data isolated (users can't see each other's goals)
- [ ] Conversation transcripts stored securely
- [ ] WhatsApp messages don't leak sensitive info to wrong number
- [ ] API keys and secrets in .env file (not committed to Git)

---

## 🚀 Demo Readiness

### Demo Script
- [ ] Demo script written and practiced
- [ ] Demo flows smoothly (4-5 minutes total)
- [ ] Each key feature showcased (auth, voice, goals, WhatsApp)
- [ ] Timing practiced (no awkward pauses or rushing)
- [ ] Prepared for Q&A (know architecture, tech choices)

### Demo Environment
- [ ] Demo user account created (or clean registration)
- [ ] Test data seeded (2-3 example goals as backup)
- [ ] Backend deployed and accessible (or running locally with stable connection)
- [ ] Frontend installed on demo device (phone or simulator)
- [ ] Network connectivity verified (Wi-Fi strong, mobile data as backup)
- [ ] Vapi account active and not rate-limited
- [ ] WhatsApp test number ready to receive
- [ ] Battery charged on demo devices

### Backup Plans
- [ ] Screenshots of each key screen
- [ ] Screen recording of full flow (in case live demo fails)
- [ ] Prepared explanation if voice demo fails ("Let me show you a recording...")
- [ ] In-app summary feature if WhatsApp fails
- [ ] Alternative demo flow if critical bug appears
- [ ] Slide deck or architecture diagram (optional)

### Known Issues
- [ ] All known issues documented
- [ ] Prepared explanations for rough edges
- [ ] Clear on what's "MVP" vs "future enhancement"
- [ ] Can articulate next steps post-hackathon

---

## ✅ Final Validation

### Functional Completeness
- [ ] All P0 features work end-to-end
- [ ] Can demonstrate complete user journey: Register → Login → Voice Call → Goal Created → WhatsApp Received
- [ ] No crashes in happy path
- [ ] Error states handled (don't break the app)
- [ ] Performance acceptable (no > 5 second waits)

### Code Quality (Optional for Hackathon)
- [ ] Code is reasonably organized (not spaghetti)
- [ ] No obvious security vulnerabilities
- [ ] Environment variables used for secrets
- [ ] Basic error handling in place
- [ ] Comments on complex logic (optional)

### Documentation
- [ ] README.md exists with setup instructions
- [ ] Environment variables documented (.env.example)
- [ ] API endpoints documented (Postman collection or OpenAPI)
- [ ] Demo script saved and accessible

---

## 📊 Completion Scoring

**P0 Features:** ___/35 (must be > 30 for demo-ready)
**P1 Features:** ___/12 (nice-to-have)
**P2 Features:** ___/6 (bonus points)
**UI/UX Quality:** ___/15 (must be > 10 for good impression)
**Platform-Specific:** ___/15 (test on at least 1 platform)
**Security:** ___/10 (must be > 7 to avoid embarrassment)
**Demo Readiness:** ___/15 (must be > 12 for confident demo)

**Total Score:** ___/108

**Demo Ready:** Yes / No / Almost

---

## 🎯 Critical Path (Absolute Minimum for Demo)

If time is running out, these are NON-NEGOTIABLE:

1. ✅ Users can login (even if registration is manual DB insert)
2. ✅ Voice call connects and works
3. ✅ At least ONE goal is created from voice conversation
4. ✅ Goal appears in the app
5. ✅ App doesn't crash during demo

Everything else is bonus. If you have these 5 things, you can demo.

---

**Good luck, and crush that demo!** 🚀🎤🎯
