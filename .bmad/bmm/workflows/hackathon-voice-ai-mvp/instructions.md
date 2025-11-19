# Hackathon Voice AI MVP - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmm/workflows/hackathon-voice-ai-mvp/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - Focus on deliverables and checkpoints, not hours/days predictions</critical>

<workflow>

<step n="0" goal="Load hackathon configuration from CLAUDE.md">
<action>Read the complete CLAUDE.md file from {project-root}/CLAUDE.md</action>
<action>Parse the "🚀 Hackathon Workflow Configuration" section</action>
<action>Extract and store these variables:
  - project_name
  - project_type
  - hackathon_duration
  - target_demo_platforms
  - Tech stack configuration (backend, frontend, integrations)
  - Feature priority tiers (p0_must_have, p1_nice_to_have, p2_if_time)
  - Execution strategy (approach, phases, checkpoints)
</action>

<action>Display configuration summary to {user_name}:

**Hackathon Configuration Loaded**

Project: {{project_name}}
Duration: {{hackathon_duration}}
Platforms: {{target_demo_platforms}}

**Tech Stack:**
- Backend: {{backend_runtime}} + {{backend_framework}} + {{backend_database}}
- Frontend: {{frontend_framework}} + {{frontend_toolkit}}
- Voice AI: {{voice_ai_provider}}
- Messaging: {{messaging_provider}}

**Feature Priorities:**
- P0 Must-Have: {{p0_count}} features
- P1 Nice-to-Have: {{p1_count}} features
- P2 If-Time: {{p2_count}} features

**Execution Approach:** {{approach}}

Ready to begin? This workflow will guide you through building your voice AI MVP with checkpoints every 30-60 minutes.
</action>

<ask>Confirm configuration is correct and you're ready to start? [yes/modify]</ask>

<check if="response == 'modify'">
  <ask>What would you like to change? (tech stack / features / duration / platforms)</ask>
  <action>Update configuration based on user input</action>
</check>

<action>Initialize status tracking file at {output_folder}/hackathon/status.md</action>
<action>Create artifact directories: specs/, demo/</action>
</step>

<step n="1" goal="Phase 1 - Foundation (Sequential, Hour 1)" critical="true">
<action>Launch Foundation Builder Agent with this mission:

**FOUNDATION BUILDER AGENT - Hour 1 Mission**

Your goal: Create a working authentication system and project scaffold.

**Context:**
- Project: {{project_name}}
- Stack: {{backend_stack}} + {{frontend_stack}}
- Must-Have (P0) Features for Foundation: JWT auth, user registration/login

**Deliverables:**
1. **Backend Setup:**
   - Initialize {{backend_framework}} project with {{backend_database}} database
   - Set up {{orm_choice}} for database models
   - Create User model (id, email, password_hash, created_at)
   - Implement JWT authentication middleware
   - Create auth endpoints: POST /api/v1/auth/register, POST /api/v1/auth/login
   - Environment configuration (.env with JWT_SECRET, DATABASE_URL)

2. **Frontend Setup:**
   - Initialize {{frontend_toolkit}} managed workflow
   - Set up React Navigation (Auth Stack + Main Stack)
   - Create LoginScreen and RegisterScreen
   - Implement authentication context (AuthContext)
   - Create API client with axios/fetch
   - Connect login/register forms to backend

3. **Database:**
   - Set up {{backend_database}} locally or use cloud instance
   - Run initial migration for User table
   - Test database connection

**Success Criteria (Test These):**
- [ ] User can register with email/password
- [ ] User receives JWT token on login
- [ ] Protected routes require valid JWT
- [ ] Frontend stores and sends JWT in headers
- [ ] Can log out and log back in

**Checkpoint (60 minutes):**
Test the complete auth flow:
1. Open mobile app (or web)
2. Register new user
3. Log in with credentials
4. Verify JWT token received
5. Access protected endpoint

**Fallback Plan:**
If JWT is too complex, use simple session-based auth with express-session for now.

**Technical Guidance:**
- Keep it simple - no password reset, no OAuth, no email verification yet
- Use bcrypt for password hashing (at least 10 rounds)
- JWT payload: { userId, email, iat, exp }
- Frontend: Store JWT in AsyncStorage (React Native) or localStorage (Web)
- CORS: Enable for development (localhost origins)

Execute this mission autonomously. Report back when foundation is complete or if blocked.
</action>

<action>Monitor agent progress - check status every 15 minutes</action>

<ask>**CHECKPOINT - Hour 1 Complete**

Foundation Builder Agent Status:

Please confirm:
1. Can you register a new user? [yes/no/partial]
2. Can you login and receive JWT? [yes/no/partial]
3. Does auth work on frontend? [yes/no/partial]

Any blockers or issues?</ask>

<check if="any answer is 'no' or 'blocked'">
  <action>Analyze the blocker</action>
  <ask>Choose response:
    1. Debug and fix the issue (spend 15 more minutes)
    2. Activate fallback (simpler auth approach)
    3. Skip auth for now, move forward with mock users
  </ask>
  <action if="choice == 3">Set flag: auth_deferred = true, use mock authentication</action>
</check>

<action>Update status.md with Phase 1 completion</action>
<action>Save foundation artifacts to {output_folder}/hackathon/specs/foundation-complete.md</action>
</step>

<step n="2" goal="Phase 2 - Parallel Feature Streams (Hours 2-4)" critical="true">
<action>Introduce parallel execution strategy:

{user_name}, we're now entering the parallel development phase. I'll launch **4 concurrent agent streams** working simultaneously:

- **Stream 1**: Backend API Agent (Goal CRUD + Vapi webhooks)
- **Stream 2**: Frontend App Agent (Goal screens + Voice UI)
- **Stream 3**: Vapi Integration Agent (Voice calls + transcription)
- **Stream 4**: WhatsApp Integration Agent (Pipedream + messaging)

Each stream has 30-minute checkpoints. This gives us **maximum velocity** while maintaining control.
</action>

<ask>Ready to launch parallel agents? [yes/wait]</ask>

<step n="2a" goal="Launch Stream 1 - Backend API Agent">
<action>Use the Task tool to launch this agent in PARALLEL:

**BACKEND API AGENT - Stream 1 Mission**

Build the backend APIs for goals and Vapi integration.

**Context:**
- Auth foundation is ready (User model + JWT exists)
- Database: {{backend_database}} with {{orm}}
- Framework: {{backend_framework}}

**Deliverables:**

**Part 1: Database Models (First 30 min)**
1. Goal model:
   ```
   - id (UUID/int primary key)
   - user_id (foreign key to User)
   - title (string, required)
   - description (text)
   - category (enum: career, health, financial, education, personal, creative)
   - status (enum: active, completed, abandoned)
   - created_from_voice (boolean, default true)
   - vapi_conversation_id (string, nullable)
   - created_at, updated_at (timestamps)
   ```

2. Conversation model (for Vapi history):
   ```
   - id (UUID/int primary key)
   - user_id (foreign key)
   - vapi_call_id (string, unique)
   - transcript (text)
   - goals_extracted (JSON array)
   - duration_seconds (int)
   - created_at (timestamp)
   ```

3. Run migrations, test models

**CHECKPOINT 1 (30 min):** Models created, migrations run, can insert test data

**Part 2: Goal CRUD Endpoints (Next 30 min)**
4. Implement REST API:
   ```
   POST   /api/v1/goals          - Create goal (requires auth)
   GET    /api/v1/goals          - List user's goals (requires auth)
   GET    /api/v1/goals/:id      - Get goal details (requires auth)
   PUT    /api/v1/goals/:id      - Update goal (requires auth)
   DELETE /api/v1/goals/:id      - Delete goal (requires auth)
   ```

5. Implement controllers with validation:
   - Title required (3-200 chars)
   - Description optional (max 1000 chars)
   - Category must be valid enum
   - User can only access own goals

6. Test all endpoints with curl or Postman

**CHECKPOINT 2 (60 min):** All CRUD endpoints working and tested

**Part 3: Vapi Webhook Endpoints (Final 30 min)**
7. Create webhook handlers:
   ```
   POST /api/v1/webhooks/vapi/conversation-start
   POST /api/v1/webhooks/vapi/conversation-end
   POST /api/v1/webhooks/vapi/message
   ```

8. conversation-end handler logic:
   - Receive Vapi payload (call_id, user_id, transcript, metadata)
   - Parse transcript for goals using simple NLP or regex
   - Extract goal titles and categories
   - Create Goal records in database
   - Save Conversation record
   - Return success response

9. Add webhook authentication (verify Vapi signature or use secret token)

**CHECKPOINT 3 (90 min):** Webhook receives test POST, creates goals in database

**Success Criteria:**
- [ ] Can create/read/update/delete goals via API
- [ ] Goals scoped to authenticated user
- [ ] Webhook receives Vapi payload and creates goals
- [ ] All endpoints return proper status codes and JSON

**Fallback Options:**
- If NLP goal extraction is complex, use simple regex: "I want to (.*)" or "My goal is (.*)"
- If Vapi webhooks blocking, create manual "create from text" endpoint instead

Execute autonomously. Report status at each 30-min checkpoint.
</action>
</step>

<step n="2b" goal="Launch Stream 2 - Frontend App Agent">
<action>Use the Task tool to launch this agent in PARALLEL:

**FRONTEND APP AGENT - Stream 2 Mission**

Build the mobile/web app screens and navigation.

**Context:**
- Foundation: Auth screens exist, navigation scaffold ready
- Framework: {{frontend_framework}} + {{frontend_toolkit}}
- Must integrate with backend APIs from Stream 1

**Deliverables:**

**Part 1: Navigation & Goal List (First 30 min)**
1. Set up Main Stack navigation (post-login):
   ```
   Bottom Tab Navigator:
   - HomeTab (Goal List)
   - VoiceTab (Vapi interaction)
   - ProfileTab (User profile)
   ```

2. Create HomeScreen (Goal List):
   - Fetch user's goals from GET /api/v1/goals
   - Display in FlatList or ScrollView
   - Each goal shows: title, category, created date
   - Empty state: "No goals yet. Talk to your AI coach to get started!"
   - Pull-to-refresh

3. Basic styling (use system colors for now, polish later)

**CHECKPOINT 1 (30 min):** Can navigate to HomeScreen, sees goal list (mock data OK for now)

**Part 2: Goal Detail & Create (Next 30 min)**
4. Create GoalDetailScreen:
   - Shows full goal info (title, description, category, date)
   - Edit button (navigate to edit form)
   - Delete button (with confirmation)

5. Create GoalFormScreen (create/edit):
   - Input fields: title, description, category picker
   - Save button calls POST /api/v1/goals
   - Handle loading states and errors
   - Navigate back on success

6. Wire up navigation: HomeScreen → GoalDetail → GoalForm

**CHECKPOINT 2 (60 min):** Can manually create a goal via form, see it in list

**Part 3: Voice Screen UI (Final 30 min)**
7. Create VoiceScreen (Vapi integration screen):
   - Large "Talk to Coach" button
   - Voice visualization placeholder (animated pulse/wave)
   - Status text ("Ready" / "Listening..." / "Processing...")
   - Conversation transcript display area

8. Add "useVapi" hook skeleton:
   ```typescript
   function useVapi() {
     const [status, setStatus] = useState('ready');
     const [transcript, setTranscript] = useState('');

     const startCall = () => { /* Stream 3 will implement */ };
     const endCall = () => { /* Stream 3 will implement */ };

     return { status, transcript, startCall, endCall };
   }
   ```

9. Wire up button to startCall (will be no-op until Stream 3 integrates)

**CHECKPOINT 3 (90 min):** VoiceScreen renders, button tap registered, UI updates

**Success Criteria:**
- [ ] Can view goal list from backend
- [ ] Can manually create goal via form
- [ ] Can navigate all screens
- [ ] Voice screen UI ready for Vapi integration
- [ ] Error states handled gracefully

**Styling Notes:**
- Keep it simple and clean
- Use consistent spacing and colors
- Focus on functionality over beauty (polish comes in Hour 6)
- Ensure text is readable, buttons are tappable

Execute autonomously. Report status at each 30-min checkpoint.
</action>
</step>

<step n="2c" goal="Launch Stream 3 - Vapi Integration Agent">
<action>Use the Task tool to launch this agent in PARALLEL:

**VAPI INTEGRATION AGENT - Stream 3 Mission**

Integrate Vapi voice AI for goal setting conversations.

**Context:**
- Vapi account and API key needed
- Frontend: React Native/Expo app with Voice screen ready (Stream 2)
- Backend: Webhooks ready to receive conversation data (Stream 1)

**Deliverables:**

**Part 1: Vapi Setup & Configuration (First 30 min)**
1. Sign up for Vapi account if not done: vapi.ai
2. Create Vapi Assistant:
   - Name: "Goal Coach"
   - System prompt: "You are an AI goal-setting coach. Have natural conversations with users about their goals and aspirations. Ask probing questions to help them clarify what they want to achieve. Extract specific, actionable goals from the conversation. Be supportive and encouraging."
   - Voice: Select pleasant, coaching voice
   - Model: GPT-4 or Claude for best quality

3. Configure Vapi webhooks:
   - Endpoint: {{backend_url}}/api/v1/webhooks/vapi/conversation-end
   - Events: conversation.ended, message.sent
   - Add webhook secret for authentication

4. Get Vapi API credentials:
   - Public key (for frontend)
   - Private key (for backend)

**CHECKPOINT 1 (30 min):** Vapi assistant created, webhook configured, credentials obtained

**Part 2: Frontend SDK Integration (Next 30 min)**
5. Install Vapi SDK:
   ```bash
   # For React Native
   npm install @vapi-ai/react-native
   # OR for Web
   npm install @vapi-ai/web
   ```

6. Implement useVapi hook:
   ```typescript
   import { useVapi } from '@vapi-ai/react-native'; // or /web

   function useVapiIntegration() {
     const { start, stop, messages, status } = useVapi();

     const startCoachingCall = async () => {
       await start({
         assistantId: 'YOUR_ASSISTANT_ID',
         metadata: {
           userId: currentUser.id,
           timestamp: new Date().toISOString()
         }
       });
     };

     const endCall = () => stop();

     return { startCoachingCall, endCall, messages, status };
   }
   ```

7. Wire up VoiceScreen to use this hook:
   - Button tap → startCoachingCall()
   - Display status updates
   - Show transcript as it arrives
   - End call button → endCall()

**CHECKPOINT 2 (60 min):** Can initiate Vapi call from app, hear voice, conversation works

**Part 3: Goal Extraction & Backend Flow (Final 30 min)**
8. Configure Vapi to send data to backend on call end:
   - Include full transcript
   - Include any structured data extracted
   - Include call duration and metadata

9. Test backend webhook reception:
   - Make test voice call: "I want to exercise 3 times a week"
   - Verify backend receives webhook
   - Verify Goal created in database
   - Verify frontend goal list updates

10. Handle edge cases:
    - No goals mentioned → friendly message
    - Multiple goals in one call → create all
    - Unclear goals → save as draft for manual editing

**CHECKPOINT 3 (90 min):** Complete flow works: Voice call → Backend receives data → Goal appears in app

**Success Criteria:**
- [ ] Can start voice call from mobile app
- [ ] Can have conversation with AI coach
- [ ] Transcript displays in real-time
- [ ] Goals extracted and saved to database
- [ ] Frontend shows newly created goals

**Fallback Options:**
- If Vapi integration complex, use simpler voice recording + transcription service
- If webhook fails, poll backend for new goals after call
- If real-time transcript hard, show after call ends

**Vapi Resources:**
- Docs: docs.vapi.ai
- SDK Examples: github.com/VapiAI
- Dashboard: dashboard.vapi.ai

Execute autonomously. Report status at each 30-min checkpoint.
</action>
</step>

<step n="2d" goal="Launch Stream 4 - WhatsApp Integration Agent">
<action>Use the Task tool to launch this agent in PARALLEL:

**WHATSAPP INTEGRATION AGENT - Stream 4 Mission**

Set up WhatsApp messaging via Pipedream for conversation summaries.

**Context:**
- Integration: Vapi → Pipedream → WhatsApp via Online Live Support
- Trigger: Vapi conversation ends
- Goal: Send WhatsApp message with conversation summary and goals

**Deliverables:**

**Part 1: Pipedream Account & WhatsApp Setup (First 30 min)**
1. Create Pipedream account: pipedream.com
2. Set up WhatsApp Business account or use Online Live Support integration
3. Get WhatsApp API credentials:
   - Session ID from Online Live Support portal
   - Phone number to send from
   - Test phone number to send to

4. Create new Pipedream workflow:
   - Name: "Vapi to WhatsApp - Goal Summary"
   - Trigger: Webhook (HTTP)
   - Get webhook URL

**CHECKPOINT 1 (30 min):** Pipedream workflow created, webhook URL obtained

**Part 2: Vapi → Pipedream Connection (Next 30 min)**
5. Configure Vapi to send to Pipedream:
   - Add Pipedream webhook URL to Vapi dashboard
   - Event: conversation.ended
   - Test payload structure

6. Pipedream workflow steps:
   - Step 1: Receive webhook from Vapi
   - Step 2: Parse conversation data (transcript, goals, user info)
   - Step 3: Format WhatsApp message template

7. Message template:
   ```
   🎯 Goal Coaching Session Complete!

   Hey {{user_name}}! Here's what we discussed:

   {{transcript_summary}}

   Goals Created:
   {{#each goals}}
   ✓ {{this.title}}
   {{/each}}

   Keep crushing it! 💪
   ```

**CHECKPOINT 2 (60 min):** Pipedream receives Vapi webhook, formats message

**Part 3: WhatsApp Message Sending (Final 30 min)**
8. Add WhatsApp action to Pipedream workflow:
   - Use "Online Live Support" or "WhatsApp Business API" integration
   - Configure with session ID and phone numbers
   - Map formatted message to WhatsApp message body

9. Test the complete flow:
   - Make test Vapi call (or trigger webhook manually)
   - Verify Pipedream receives event
   - Verify WhatsApp message sent
   - Check phone receives message

10. Add error handling:
    - If WhatsApp send fails, log to Pipedream
    - Retry logic for transient failures
    - Alert user in app if delivery failed (optional)

**CHECKPOINT 3 (90 min):** Complete flow: Voice call → Vapi → Pipedream → WhatsApp received on phone

**Success Criteria:**
- [ ] Pipedream workflow receives Vapi webhooks
- [ ] Message formatted with conversation summary
- [ ] WhatsApp message successfully delivered
- [ ] Received message on test phone

**Fallback Options:**
- If WhatsApp integration blocked, use SMS (Twilio) instead
- If Pipedream complex, implement direct backend → WhatsApp
- If real-time fails, create manual "send summary" button in app

**Resources:**
- Pipedream Vapi integration: pipedream.com/apps/vapi
- WhatsApp Business API: business.whatsapp.com
- Online Live Support: Check integration docs

Execute autonomously. Report status at each 30-min checkpoint.
</action>
</step>

<action>Monitor all 4 parallel streams concurrently</action>
<action>Track checkpoint progress in status.md file</action>

<ask>**CHECKPOINT - 30 Minutes Into Parallel Phase**

All Streams Status Check:

Stream 1 (Backend): [status]
Stream 2 (Frontend): [status]
Stream 3 (Vapi): [status]
Stream 4 (WhatsApp): [status]

Any stream blocked or behind? Any pivots needed?</ask>

<check if="any stream blocked">
  <action>Assess blocker criticality</action>
  <ask>For blocked stream, choose:
    1. Reallocate resources (pause another stream to help)
    2. Activate fallback (simpler implementation)
    3. Defer to P1/P2 (if not P0 feature)
  </ask>
</check>

<ask>**CHECKPOINT - 60 Minutes Into Parallel Phase**

Mid-Phase Status:

Stream 1 (Backend): Goals CRUD working? [yes/no/partial]
Stream 2 (Frontend): Screens displaying? [yes/no/partial]
Stream 3 (Vapi): Voice calls connecting? [yes/no/partial]
Stream 4 (WhatsApp): Messages sending? [yes/no/partial]

Overall progress: On track / Slightly behind / Significantly behind?
</ask>

<check if="significantly behind">
  <action>Trigger scope reduction protocol</action>
  <ask>To get back on track, select features to defer:
    - [ ] WhatsApp integration (Stream 4) → Defer to P2
    - [ ] Goal editing (Frontend) → Manual DB edit OK for demo
    - [ ] Voice conversation history → Skip for MVP
    - [ ] Other: [specify]
  </ask>
  <action>Update feature priorities and notify relevant agents</action>
</check>

<ask>**CHECKPOINT - 90 Minutes Into Parallel Phase**

Final Parallel Phase Checkpoint:

All P0 features complete? [yes/no]
Integration ready? [yes/no]
Any major issues remaining?

Summary of deliverables:
- Backend APIs: [status]
- Frontend Screens: [status]
- Vapi Integration: [status]
- WhatsApp Integration: [status]
</ask>

<action>Collect artifacts from all streams</action>
<action>Save parallel phase summary to {output_folder}/hackathon/specs/parallel-phase-complete.md</action>
<action>Update status.md with Phase 2 completion</action>
</step>

<step n="3" goal="Phase 3 - Integration & Demo (Hours 5-6)" critical="true">
<action>Transition to integration phase:

{user_name}, parallel development complete! Now we integrate everything into a seamless end-to-end experience and prepare for demo.

**Integration Phase Goals:**
- Connect all components (Backend ↔ Frontend ↔ Vapi ↔ WhatsApp)
- Test complete user journey
- Fix integration bugs
- Polish UI for demo impact
- Create demo script and test data
</action>

<step n="3a" goal="End-to-End Integration (Hour 5)">
<action>Launch Integration Agent:

**INTEGRATION AGENT - Hour 5 Mission**

Wire all components together and ensure seamless operation.

**Context:**
All individual streams complete. Now integrate them into cohesive system.

**Deliverables:**

**Part 1: Backend-Frontend Integration (First 20 min)**
1. Verify API connectivity:
   - Frontend can hit all backend endpoints
   - JWT auth works across all requests
   - CORS properly configured
   - Error responses handled gracefully

2. Test Goal CRUD flow:
   - Create goal manually via form → appears in database
   - Edit goal → updates persist
   - Delete goal → removes from list
   - List refreshes after changes

3. Fix any integration bugs

**CHECKPOINT 1:** Manual goal CRUD works end-to-end

**Part 2: Vapi-Backend Integration (Next 20 min)**
4. Test voice → goal flow:
   - Start voice call from app
   - Say: "I want to read 10 books this year"
   - Verify backend webhook receives data
   - Verify Goal created in database
   - Verify goal appears in app goal list

5. Test edge cases:
   - Multiple goals in one call
   - Ambiguous goals
   - No goals mentioned
   - Call interrupted mid-conversation

6. Tune goal extraction logic if needed

**CHECKPOINT 2:** Voice call creates goals successfully

**Part 3: WhatsApp Integration Testing (Final 20 min)**
7. Test complete flow:
   - Make voice call with goals
   - Wait for conversation to end
   - Check phone for WhatsApp message
   - Verify message contains summary and goals

8. If WhatsApp not working:
   - Check Pipedream logs
   - Verify webhook fired
   - Check WhatsApp API credentials
   - Test with manual trigger

9. Fallback: If WhatsApp blocked, show summary in-app instead

**CHECKPOINT 3:** WhatsApp message received after voice call

**Part 4: Complete User Journey Test (Final 20 min)**
10. Test full demo flow start to finish:
    - Open app → Register → Login
    - Navigate to Voice tab
    - Start voice call
    - Have conversation about goals
    - End call
    - See goals in Home tab
    - Receive WhatsApp message
    - Edit a goal
    - Delete a goal

11. Document any rough edges or bugs

12. Prioritize critical fixes vs. nice-to-haves

**Success Criteria:**
- [ ] Complete flow works without manual intervention
- [ ] No crashes or errors in happy path
- [ ] Performance acceptable (no long delays)
- [ ] Works on target demo platform (iOS/Android/Web)

Execute integration testing. Report results and any blockers.
</action>

<ask>**CHECKPOINT - Hour 5 Complete**

Integration Status:

1. End-to-end flow works? [yes/mostly/no]
2. Critical bugs found: [list]
3. Remaining issues: [list]

Ready to proceed to demo prep? [yes/need-more-time]
</ask>

<check if="need-more-time">
  <ask>What's blocking? Choose priority:
    1. Fix critical bug (specify which)
    2. Simplify flow (drop problematic feature)
    3. Move to demo prep, note bug as "known issue"
  </ask>
</check>

<action>Save integration test results to {output_folder}/hackathon/specs/integration-complete.md</action>
</step>

<step n="3b" goal="Demo Preparation (Hour 6)">
<action>Launch Demo Preparation Agent:

**DEMO PREPARATION AGENT - Hour 6 Mission**

Polish the product and create an impressive demo.

**Context:**
Integration complete. Now make it shine for demo time.

**Deliverables:**

**Part 1: UI Polish (First 20 min)**
1. Visual improvements:
   - Consistent color scheme (use 2-3 brand colors)
   - Proper spacing and padding
   - Loading indicators for async operations
   - Success/error feedback (toasts, alerts)
   - Icons for tabs and actions

2. Voice screen polish:
   - Animated pulse/wave during voice call
   - Smooth transition between states
   - Clear status messages

3. Goal list polish:
   - Card-based layout with shadows
   - Category badges with colors
   - Empty state illustration or message
   - Smooth animations (fade in, slide)

4. Platform-specific tweaks:
   - Test on actual iOS device/simulator
   - Test on Android device/emulator
   - Test on web browser
   - Fix any platform-specific issues

**CHECKPOINT 1:** App looks professional and polished

**Part 2: Demo Script & Test Data (Next 20 min)**
5. Create demo script:
   ```markdown
   # Echo-AI Demo Script (5 minutes)

   ## Setup (Pre-demo)
   - [ ] App running on phone + web browser
   - [ ] Clean database (or demo account ready)
   - [ ] WhatsApp ready to receive
   - [ ] Backup: Screenshots/video if live demo fails

   ## Demo Flow

   **Intro (30 sec):**
   "Echo-AI is a voice-first goal coaching app. Instead of typing, you have natural conversations with an AI coach, and it automatically creates and tracks your goals."

   **Act 1 - Registration (30 sec):**
   - Open app → Quick registration
   - "See how fast onboarding is"

   **Act 2 - Voice Interaction (2 min) - THE STAR:**
   - Navigate to Voice tab
   - Tap "Talk to Coach"
   - Have conversation: "Hey coach, I want to learn Spanish fluently by practicing 30 minutes daily. I also want to launch my side project within 3 months."
   - Show real-time transcript
   - End call

   **Act 3 - Goal Display (1 min):**
   - Navigate to Home tab
   - Show goals automatically created
   - Click into goal detail
   - Edit one goal

   **Act 4 - WhatsApp Integration (1 min) - THE WOW:**
   - Check phone
   - Show WhatsApp message received
   - "You get a summary of every coaching session, right to your phone"

   **Outro (30 sec):**
   - Show multi-platform: "Same app, iOS, Android, and Web"
   - Show quick goal stats
   - Thank you

   ## Backup Plan
   - If Vapi fails: Use pre-recorded video of voice interaction
   - If WhatsApp fails: Show in-app summary instead
   - If app crashes: Have screenshots ready
   ```

6. Seed test data:
   - Create demo user account
   - Pre-populate 2-3 example goals (in case voice demo fails)
   - Clear conversation history

7. Practice demo run:
   - Time yourself (should be 4-5 minutes)
   - Identify any stumbles
   - Prepare for Q&A

**CHECKPOINT 2:** Demo script ready, practiced at least once

**Part 3: Final Testing & Backup Plans (Final 20 min)**
8. Create backup assets:
   - Screenshots of each key screen
   - Screen recording of full flow (in case live demo fails)
   - Slide deck with architecture diagram (optional)

9. Test on actual demo device:
   - Install app on phone you'll use for demo
   - Verify voice works (microphone permissions)
   - Verify network connectivity
   - Test WhatsApp on actual phone (not just simulator)

10. Prepare for technical questions:
    - Architecture: "React Native + Node.js + PostgreSQL"
    - Voice AI: "Powered by Vapi with GPT-4"
    - WhatsApp: "Serverless integration via Pipedream"
    - Hosting: [specify where backend is deployed]

11. Known issues list:
    - Document any rough edges
    - Prepare explanations ("This is MVP, we'll add X in v2")

**CHECKPOINT 3:** Demo ready, confident, backups prepared

**Success Criteria:**
- [ ] UI looks professional
- [ ] Demo script practiced and timed
- [ ] Backup plan ready
- [ ] Test data seeded
- [ ] Works on demo device
- [ ] Confident and ready to present

Execute demo prep. Make it shine!
</action>

<ask>**CHECKPOINT - Hour 6 Complete / DEMO READY**

Demo Prep Status:

1. UI polished? [yes/good-enough/needs-work]
2. Demo practiced? [yes/once/not-yet]
3. Backup plan ready? [yes/no]
4. Confidence level: [1-10]

Any last-minute concerns or issues?
</ask>

<check if="confidence < 7">
  <ask>What would increase confidence?
    - More practice?
    - Better backup plan?
    - Specific fix needed?
  </ask>
  <action>Address concern if time permits (max 10 more minutes)</action>
</check>

<action>Save demo script to {output_folder}/hackathon/demo/demo-script.md</action>
<action>Save backup assets to {output_folder}/hackathon/demo/backups/</action>
</step>

<action>Final status update to {output_folder}/hackathon/status.md</action>
</step>

<step n="4" goal="Final Validation & Readiness Check">
<action>Run validation checklist from {installed_path}/checklist.md</action>

<ask>**FINAL VALIDATION - All P0 Features**

Please confirm each P0 feature works:

1. ✅ JWT Authentication: Users can register and login [yes/no]
2. ✅ User Registration/Login: Forms work, tokens issued [yes/no]
3. ✅ Vapi Voice Integration: Can make voice calls [yes/no]
4. ✅ Goal Creation from Voice: Goals extracted and saved [yes/no]
5. ✅ Basic Goal Display: Goals shown in app [yes/no]

P1 Features (nice-to-have):
6. ⭐ WhatsApp Conversation Summary: Messages delivered [yes/no/skipped]
7. ⭐ Goal Progress Tracking: Can edit goals [yes/no/skipped]

P2 Features (if-time):
8. 💎 Goal Reminders via WhatsApp [yes/no/skipped]
9. 💎 Achievement Celebrations [yes/no/skipped]

All P0 features working? [yes/mostly/no]
</ask>

<check if="not all P0 working">
  <action>List non-working P0 features</action>
  <ask>CRITICAL: P0 features must work for MVP. Choose:
    1. Spend 15 more minutes fixing (which feature?)
    2. Activate fallback for this feature
    3. Adjust demo to avoid this feature
  </ask>
</check>

<action>Generate final summary report:

**Hackathon Voice AI MVP - Completion Report**

**Project:** {{project_name}}
**Duration:** {{hackathon_duration}}
**Date:** {{date}}

**Execution Summary:**
- Approach: {{approach}}
- Total Agents Launched: {{agent_count}}
- Checkpoints Hit: {{checkpoints_completed}}/{{total_checkpoints}}

**Features Delivered:**

P0 (Must-Have): {{p0_completed}}/{{p0_total}}
{{#each p0_features}}
- {{status}} {{name}}
{{/each}}

P1 (Nice-to-Have): {{p1_completed}}/{{p1_total}}
{{#each p1_features}}
- {{status}} {{name}}
{{/each}}

P2 (If-Time): {{p2_completed}}/{{p2_total}}
{{#each p2_features}}
- {{status}} {{name}}
{{/each}}

**Tech Stack Delivered:**
- Backend: {{backend_stack}}
- Frontend: {{frontend_stack}}
- Database: {{database}}
- Voice AI: {{voice_ai_provider}}
- Messaging: {{messaging_provider}}

**Demo Readiness:** {{demo_readiness_score}}/10

**Known Issues:**
{{#each known_issues}}
- {{issue}}
{{/each}}

**Artifacts Created:**
- Code: backend/, mobile/
- Specs: {output_folder}/hackathon/specs/
- Demo: {output_folder}/hackathon/demo/
- Status: {output_folder}/hackathon/status.md

**Next Steps (Post-Hackathon):**
1. Deploy backend to production (Heroku, Railway, or AWS)
2. Submit app to Expo for mobile deployment
3. Address known issues
4. Implement deferred P1/P2 features

---

**Congratulations, {user_name}! You've built a working voice AI MVP!** 🎉

The workflow is complete. You're ready to demo.
</action>

<action>Save completion report to {output_folder}/hackathon/completion-report.md</action>

<ask>Would you like me to:
1. Generate a quick pitch deck for your demo?
2. Create a README for the repository?
3. Nothing - you're ready to go!

Choose option [1/2/3]:</ask>

<action if="option == 1">Generate simple pitch deck with architecture diagram and key screenshots</action>
<action if="option == 2">Create comprehensive README.md with setup instructions, architecture, and demo guide</action>
</step>

</workflow>
