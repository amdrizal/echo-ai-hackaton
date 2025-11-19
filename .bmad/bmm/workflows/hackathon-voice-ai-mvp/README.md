# Hackathon Voice AI MVP Workflow

**Execute adaptive parallel workflow to build voice AI applications in 6 hours with checkpoint-driven delivery.**

## Overview

This workflow orchestrates the rapid development of a voice AI application using an adaptive hybrid approach that balances speed with quality. Perfect for hackathons, MVPs, and proof-of-concepts.

### What It Does

- **Reads configuration from CLAUDE.md** - Project-specific settings and tech stack
- **Deploys 8-12 parallel agents** across 3 phases (Foundation → Features → Integration)
- **30-60 minute checkpoints** for validation and course correction
- **Feature tiers (P0/P1/P2)** enable scope flexibility when requirements change
- **Fallback options** at each integration point for risk mitigation
- **Demo preparation** included with script, test data, and backup plans

### Tech Stack Supported

**Backend:**
- Node.js + Express
- PostgreSQL with Prisma/TypeORM
- JWT authentication

**Frontend:**
- React Native + Expo (iOS, Android, Web)
- React Navigation
- Context API for state management

**Integrations:**
- **Vapi** - Voice AI for natural conversations
- **WhatsApp via Pipedream** - Messaging and notifications

## Quick Start

### Prerequisites

1. **BMAD Method installed** in your project
2. **CLAUDE.md configured** with hackathon settings (see Configuration section)
3. **Development environment ready:**
   - Node.js (LTS version)
   - PostgreSQL running
   - Expo CLI installed
   - Vapi account created
   - Pipedream account created (for WhatsApp)

### Running the Workflow

**Option 1: Direct invocation**
```bash
/hackathon-voice-ai-mvp
```

**Option 2: Via analyst agent**
```bash
/bmad:bmm:agents:analyst
# Then select workflow from menu
```

**Option 3: From IDE command palette**
```
Search for: "hackathon-voice-ai-mvp"
```

## Configuration

### CLAUDE.md Setup

Add this section to your `CLAUDE.md` file (see template in main CLAUDE.md):

```yaml
## 🚀 Hackathon Workflow Configuration

### Project Configuration
project_name: your-project-name
project_type: voice-ai-mvp
hackathon_duration: 6 hours
target_demo_platforms: [iOS, Android, Web]

### Tech Stack Configuration
backend:
  runtime: Node.js
  framework: Express
  database: PostgreSQL
  auth: JWT

frontend:
  framework: React Native
  toolkit: Expo
  platforms: [iOS, Android, Web]

integrations:
  voice_ai:
    provider: Vapi
  messaging:
    provider: WhatsApp
    integration: Pipedream

### Feature Priority Tiers
p0_must_have:
  - jwt_authentication
  - user_registration_login
  - vapi_voice_integration
  - goal_creation_from_voice
  - basic_goal_display

p1_nice_to_have:
  - whatsapp_conversation_summary
  - goal_progress_tracking

p2_if_time:
  - goal_reminders_via_whatsapp
  - achievement_celebrations
```

## Workflow Phases

### Phase 1: Foundation (1 hour)
**Sequential execution with 1 agent**

**Deliverable:** Working authentication and project scaffold

- Backend setup (Express + PostgreSQL + JWT)
- Frontend setup (Expo + React Navigation)
- User model and auth endpoints
- Login/register screens
- **Checkpoint:** User can register, login, and receive JWT token

### Phase 2: Parallel Features (3 hours)
**4 concurrent agent streams**

**Stream 1 - Backend API:**
- Goal CRUD endpoints
- Database models (Goal, Conversation)
- Vapi webhook handlers
- **Checkpoints at 30, 60, 90 min**

**Stream 2 - Frontend App:**
- Goal screens (list, detail, create)
- Navigation structure
- Voice screen UI
- **Checkpoints at 30, 60, 90 min**

**Stream 3 - Vapi Integration:**
- Vapi SDK setup
- Voice call functionality
- Goal extraction from conversation
- **Checkpoints at 30, 60, 90 min**

**Stream 4 - WhatsApp Integration:**
- Pipedream workflow
- Vapi → Pipedream → WhatsApp pipeline
- Message templates
- **Checkpoints at 30, 60, 90 min**

**Deliverable:** All features integrated but not yet connected end-to-end

### Phase 3: Integration & Demo (2 hours)

**Hour 5 - Integration:**
- Connect all components
- End-to-end testing
- Bug fixes
- **Checkpoint:** Complete user flow works

**Hour 6 - Demo Prep:**
- UI polish
- Demo script creation
- Test data seeding
- Backup plan preparation
- **Checkpoint:** Demo-ready and confident

## Adaptive Features

### Checkpoint Validation

At each checkpoint, the workflow asks:
- Is this milestone complete?
- Any blockers or challenges?
- Should we pivot or continue?
- Are we on schedule?

### Scope Adjustment

If behind schedule, automatically suggests:
- Drop P2 features
- Simplify P1 features
- Activate fallback implementations
- Reallocate agent resources

### Requirement Changes

New requirements are:
- Classified as P0/P1/P2
- Queued or implemented based on priority
- Tracked in status file
- Evaluated for impact on timeline

### Fallback Options

Built-in fallbacks for common blockers:
- **JWT complex?** → Session-based auth
- **Vapi integration hard?** → Voice recording + transcription service
- **WhatsApp blocked?** → In-app summary instead
- **Database issues?** → Mock data for demo

## Output Artifacts

The workflow generates:

```
/docs/hackathon/
  /specs/
    foundation-complete.md
    parallel-phase-complete.md
    integration-complete.md
  /demo/
    demo-script.md
    /backups/
      screenshots/
      screen-recording.mp4
  status.md
  completion-report.md

/backend/              # Generated Node.js backend
/mobile/               # Generated React Native app
/pipedream/            # Pipedream workflow configs
```

## Validation

Use the comprehensive checklist in `checklist.md`:

- **P0 Features** (35 checks) - Must complete > 30 for demo-ready
- **P1 Features** (12 checks) - Nice-to-have
- **P2 Features** (6 checks) - Bonus
- **UI/UX Quality** (15 checks) - Must complete > 10
- **Security** (10 checks) - Must complete > 7
- **Demo Readiness** (15 checks) - Must complete > 12

**Total:** 108 validation points

## Best Practices

### Before Starting

1. ✅ Configure CLAUDE.md completely
2. ✅ Have Vapi account ready
3. ✅ Have Pipedream account ready
4. ✅ Ensure PostgreSQL running
5. ✅ Clear your schedule for 6 hours
6. ✅ Have test phone number for WhatsApp

### During Execution

1. 🎯 **Trust the checkpoints** - Don't skip validation
2. 🔄 **Adapt when needed** - Don't stubbornly stick to broken approaches
3. ⏱️ **Watch the clock** - Time-box debugging sessions
4. 📦 **Scope ruthlessly** - P0 features only if behind
5. 🎨 **Polish at the end** - Functionality first, beauty last

### Demo Day

1. 🎤 Practice demo script 2-3 times
2. 📱 Test on actual demo device
3. 🔋 Charge all devices fully
4. 📸 Have screenshots as backup
5. 🎬 Record screen flow as insurance
6. 😌 Breathe and be confident!

## Troubleshooting

### Workflow won't start
- Verify CLAUDE.md has hackathon configuration section
- Check BMAD Method is installed correctly
- Ensure you're in project root directory

### Agent gets stuck
- Check for error messages in console
- Verify API credentials (Vapi, Pipedream)
- Activate fallback option
- Skip to next checkpoint if blocked > 15 min

### Behind schedule
- Run scope reduction protocol
- Focus on P0 features only
- Defer P1/P2 to post-hackathon
- Simplify implementations (MVP = Minimum Viable!)

### Integration issues
- Check CORS configuration
- Verify API endpoints accessible
- Test with curl/Postman directly
- Check network connectivity
- Review backend logs

## Post-Hackathon

After the demo, to productionize:

1. **Deploy backend:**
   - Use Railway, Heroku, or AWS
   - Configure production environment variables
   - Set up CI/CD pipeline

2. **Deploy frontend:**
   - Submit to Expo for OTA updates
   - Build standalone apps for App Store / Play Store
   - Deploy web version to Vercel or Netlify

3. **Address known issues:**
   - Review checklist items marked incomplete
   - Implement deferred P1/P2 features
   - Add proper error handling and logging

4. **Scale up:**
   - Add analytics and monitoring
   - Implement proper testing suite
   - Set up staging environment
   - Add admin dashboard

## Architecture

```
┌─────────────────┐
│  Mobile App     │
│  (React Native/ │
│   Expo)         │
└────────┬────────┘
         │ JWT Auth
         │ REST API
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend        │      │  Vapi        │
│  (Node.js/      │◄────►│  Voice AI    │
│   Express)      │      └──────────────┘
└────────┬────────┘
         │                ┌──────────────┐
         │  Webhook       │  Pipedream   │
         └───────────────►│  (WhatsApp)  │
         │                └──────────────┘
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  Database       │
└─────────────────┘
```

## Success Metrics

### Minimum for Demo
- ✅ 5/5 critical path items complete
- ✅ No crashes in happy path
- ✅ Voice interaction works
- ✅ Can demo in < 5 minutes

### Great Demo
- ✅ All P0 features working
- ✅ 2+ P1 features working
- ✅ WhatsApp integration live
- ✅ Polished UI
- ✅ Confident presentation

### Outstanding Demo
- ✅ All P0 + P1 features
- ✅ 1+ P2 features
- ✅ Multi-platform showcase
- ✅ Live WhatsApp demo
- ✅ "Wow" moments and animations

## Support

### Questions?
- Check workflow instructions: `instructions.md`
- Review validation checklist: `checklist.md`
- Consult CLAUDE.md for project-specific guidance
- Ask the analyst agent for help

### Found a bug?
- Note it in status.md
- Add to known issues list
- Prepare explanation for demo Q&A
- Fix post-hackathon if time permits

## License

This workflow is part of the BMAD Method framework.

---

**Good luck with your hackathon! You've got this!** 🚀🎤🎯

---

## Workflow Metadata

- **Name:** hackathon-voice-ai-mvp
- **Version:** 1.0.0
- **Author:** BMad
- **Module:** bmm (BMad Method)
- **Type:** Meta-workflow + Action
- **Standalone:** Yes (directly invokable)
- **Files:**
  - `workflow.yaml` - Configuration
  - `instructions.md` - Execution steps
  - `checklist.md` - Validation criteria
  - `README.md` - This documentation
