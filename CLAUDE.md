# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚀 Hackathon Workflow Configuration

**CRITICAL: This section is read by the `hackathon-voice-ai-mvp` workflow for automated execution.**

### Project Configuration
```yaml
project_name: echo-ai
project_type: voice-ai-mvp
hackathon_duration: 6 hours
target_demo_platforms: [iOS, Android, Web]
```

### Tech Stack Configuration
```yaml
backend:
  runtime: Node.js
  framework: Express
  database: PostgreSQL
  auth: JWT

frontend:
  framework: React Native
  toolkit: Expo
  platforms: [iOS, Android, Web]
  state_management: React Context + Hooks

integrations:
  voice_ai:
    provider: Vapi
    features: [voice_calls, conversation_context, goal_extraction]
  messaging:
    provider: WhatsApp
    integration: Pipedream
    features: [conversation_summary, goal_reminders, achievement_notifications]
```

### Feature Priority Tiers
```yaml
p0_must_have:
  - jwt_authentication
  - user_registration_login
  - vapi_voice_integration
  - goal_creation_from_voice
  - basic_goal_display

p1_nice_to_have:
  - whatsapp_conversation_summary
  - goal_progress_tracking
  - voice_conversation_history

p2_if_time:
  - goal_reminders_via_whatsapp
  - achievement_celebrations
  - multi-goal_management
```

### Execution Strategy
```yaml
approach: adaptive-hybrid
phases:
  - name: Foundation
    duration: 1 hour
    agents: 1
    deliverable: "Auth working + project scaffold"

  - name: Parallel Features
    duration: 3 hours
    agents: 4
    checkpoints: [30min, 60min, 90min]
    deliverable: "Backend APIs + Frontend screens + Vapi + WhatsApp integrated"

  - name: Integration & Demo
    duration: 2 hours
    agents: 1
    deliverable: "End-to-end flow working + demo script"

checkpoint_validation: true
fallback_options: enabled
```

### Technical Specifications
**CRITICAL: Complete technical specs are pre-written for agent execution**

All agents should reference: `docs/hackathon/specs/technical-specification.md`

This includes:
- Database schema with SQL migrations
- Complete API endpoint specifications
- Frontend structure and TypeScript interfaces
- Vapi integration configuration
- WhatsApp/Pipedream setup
- Environment variable templates
- Deployment guides

**Pre-execution checklist:**
- [ ] Fill in API keys in `.env` files (see spec for templates)
- [ ] Create Vapi assistant (configuration in spec)
- [ ] Create Pipedream workflow (steps in spec)
- [ ] Initialize database (SQL in spec)

### How to Run Hackathon Workflow
```bash
# From any BMAD-enabled environment:
/hackathon-voice-ai-mvp

# Or invoke the analyst agent and select the workflow:
/bmad:bmm:agents:analyst
# Then select: "Execute hackathon workflow"
```

---

## Project Overview

This is a hackathon MVP project for building **Echo-AI** - a voice-powered AI coaching application that helps users set and achieve goals through natural conversation. The app uses voice AI (Vapi) for interaction and WhatsApp for summaries and reminders.

### Key Product Features
- **Voice-First Interaction**: Natural conversation with Vapi AI for goal setting and coaching
- **SMART Goal Framework**: Goals extracted from voice conversations with AI coaching
- **WhatsApp Integration**: Conversation summaries, goal reminders, and achievement notifications
- **Cross-Platform**: Single codebase running on iOS, Android, and Web via React Native/Expo
- **Secure Authentication**: JWT-based auth with encrypted user data
- **Progress Tracking**: Visual goal progress with milestone celebrations

### Development Approach

This project uses an **adaptive hybrid AI agent methodology** optimized for hackathon velocity:
- **Phase 1 - Foundation** (1 hour): Single agent for project scaffold, database, and auth
- **Phase 2 - Parallel Features** (3 hours): 4 concurrent agent streams (backend, frontend, Vapi, WhatsApp)
- **Phase 3 - Integration** (2 hours): Single agent connects everything and prepares demo

**Key Principles:**
- MVP-by-MVP delivery with 30-60 minute checkpoints
- Feature tiers (P0/P1/P2) enable scope flexibility
- Fallback options at each integration point
- Requirement change adaptability built-in

Run the workflow: `/hackathon-voice-ai-mvp`

## Architecture Guidelines

### Technology Stack

**Backend (Node.js + Express):**
- **Runtime**: Node.js (LTS version)
- **Framework**: Express.js with async/await patterns
- **Database**: PostgreSQL with Prisma ORM or TypeORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Design**: RESTful endpoints with JSON responses
- **Validation**: express-validator or Joi schemas
- **Testing**: Jest + Supertest for API tests

**Frontend (React Native + Expo):**
- **Framework**: React Native with Expo managed workflow
- **TypeScript**: Strict mode enabled for type safety
- **Navigation**: React Navigation (Stack + Tab navigators)
- **State Management**: React Context API + useReducer for global state
- **Forms**: React Hook Form with validation
- **Styling**: StyleSheet API or styled-components/native
- **Platform Support**: iOS, Android, Web (via Expo Web)

**Voice AI Integration (Vapi):**
- **Provider**: Vapi.ai voice automation platform
- **SDK**: @vapi-ai/react-native or @vapi-ai/web
- **Features**:
  - Voice call initiation and handling
  - Real-time conversation transcription
  - Goal extraction from natural language
  - Context retention across sessions
- **Webhooks**: Backend endpoints for Vapi event callbacks

**Messaging Integration (WhatsApp via Pipedream):**
- **Platform**: Pipedream serverless workflows
- **Trigger**: Vapi "conversation ended" event
- **Action**: WhatsApp message via Online Live Support API
- **Use Cases**:
  - Conversation summaries after voice calls
  - Goal reminder notifications
  - Achievement celebration messages
- **Authentication**: API keys for both Vapi and WhatsApp services

### System Design Principles

**Vertical Slice Architecture:**
Organize features by capability rather than technical layer. Each feature should contain its own:
- Backend: Entity → Repository → Service → Controller
- Frontend: Components → API hooks → Forms → State management
- Tests at each layer

**Data Model Structure:**
- User profiles with values assessment and preferences
- Goals with SMART criteria (specific, measurable, achievable, relevant, time-bound)
- Hierarchical goal relationships (parent-child)
- Categories: Career, Health, Financial, Education, Relationships, Personal Development, Creative
- Milestones and progress checkpoints
- Decision journal with outcome tracking
- AI coaching session history with context

**Security Architecture:**
- End-to-end encryption for sensitive user data
- JWT-based authentication
- RBAC for premium/pro tier features
- CORS configuration for frontend-backend communication
- Input validation and sanitization at all entry points

## Development Workflow

### Testing Strategy
- **Backend**: Jest + Supertest for API testing
  - Unit tests for services and utilities
  - Integration tests for API endpoints
  - Test command: `npm test` or `npm run test:coverage`
  - Target coverage: 70%+ for hackathon MVP
- **Frontend**: Jest + React Native Testing Library
  - Component tests for screens and UI elements
  - Test command: `npm test` in the mobile app directory
  - Focus on critical user flows
- **E2E Tests**: Critical path only (login → voice call → goal display)

### Code Quality
- **Backend**: ESLint + Prettier for code formatting
  - Run: `npm run lint` and `npm run format`
- **Frontend**: ESLint + Prettier with React Native rules
  - Run: `npm run lint` in mobile directory
- **TypeScript**: Strict type checking enabled
  - Run: `npm run type-check`

### Build Commands

**Backend:**
```bash
npm install          # Install dependencies
npm run dev          # Development server with hot reload
npm start            # Production server
npm test             # Run tests
```

**Frontend (React Native/Expo):**
```bash
npm install          # Install dependencies
npx expo start       # Start Expo dev server
npx expo start --web # Run on web browser
npx expo start --ios # Run on iOS simulator
npx expo start --android # Run on Android emulator
npm run build        # Create production build
```

## Key Implementation Patterns

### Backend Patterns (Node.js/Express)
- **Route → Controller → Service → Repository** layered architecture
- **Async/await** for all database and API operations
- **Middleware chain**: authentication → validation → rate limiting → business logic
- **Error handling**: Centralized error middleware with proper HTTP status codes
- **Database**: Prisma schema with migrations or TypeORM entities
- **Environment config**: dotenv for secrets and configuration
- **API structure**:
  ```javascript
  // Example: /api/v1/goals
  POST   /api/v1/goals          # Create goal
  GET    /api/v1/goals          # List user's goals
  GET    /api/v1/goals/:id      # Get goal details
  PUT    /api/v1/goals/:id      # Update goal
  DELETE /api/v1/goals/:id      # Delete goal

  // Vapi webhooks
  POST   /api/v1/webhooks/vapi/conversation-end
  POST   /api/v1/webhooks/vapi/message
  ```

### Frontend Patterns (React Native/Expo)
- **TypeScript interfaces** for all data models and API responses
- **Custom hooks** for API operations:
  - `useAuth()` - Authentication state and methods
  - `useGoals()` - Goal CRUD operations
  - `useVapi()` - Voice call management
- **Context providers** for global state:
  - `AuthContext` - User authentication
  - `GoalContext` - Goal management
  - `VapiContext` - Voice AI state
- **Navigation structure**:
  ```
  Auth Stack (not logged in)
    - LoginScreen
    - RegisterScreen

  Main Stack (logged in)
    - Tab Navigator
      - HomeScreen (goals list)
      - VoiceScreen (Vapi integration)
      - ProfileScreen
  ```
- **Error boundaries** for graceful error handling
- **Loading states** with activity indicators
- **Platform-specific code** using `Platform.select()` when needed

### Voice AI Integration Patterns (Vapi)
- **Conversation flow**:
  1. User taps "Talk to Coach" button
  2. Frontend initiates Vapi call via SDK
  3. User speaks about their goals
  4. Vapi transcribes and sends to backend webhook
  5. Backend extracts goals and saves to database
  6. Frontend refreshes goal list
- **Context retention**: Pass user ID and previous goals to Vapi assistant
- **Webhook handling**: Backend endpoint receives conversation data
- **Graceful degradation**: If Vapi unavailable, show text input fallback

### WhatsApp Integration Patterns (Pipedream)
- **Trigger**: Vapi conversation end event via webhook
- **Workflow**: Pipedream receives event → formats summary → sends WhatsApp
- **Message templates**:
  - Conversation summary with goals discussed
  - Goal reminder ("Don't forget: Finish project proposal by Friday!")
  - Achievement notification ("Congrats! You completed your goal!")

## Privacy & Compliance

**Critical Requirements:**
- GDPR compliance: user consent, right to deletion, data portability
- Minimal data collection principle
- All sensitive data (goals, decisions, coaching history) must be encrypted at rest
- Support data export in CSV/JSON/PDF formats
- Account deletion must remove all user data completely
- No sharing of user data with third parties without explicit consent

## Performance Targets

- App launch time: < 2 seconds
- Local operations: < 200ms response time
- AI coaching responses: < 3 seconds
- API response times: Sub-100ms for CRUD operations
- 99.9% uptime for cloud services
- Offline capability for viewing existing goals and progress

## Integration Ecosystem

When implementing integrations, follow these patterns:
- OAuth 2.0 for calendar and productivity tool integrations
- Webhook subscriptions for real-time updates
- Rate limiting on all external API calls
- Graceful handling of integration failures
- User control over which integrations are active

**Priority Integrations (Phase 1):**
- Google Calendar / Apple Calendar
- Basic health tracking (manual entry)

**Future Integrations (Phase 2+):**
- Notion, Todoist, Trello
- Apple Health, Google Fit
- Financial apps (Mint, YNAB)

## File Organization

```
/backend                    # Node.js + Express API
  /src
    /config                 # Configuration (database, auth, env)
    /controllers            # Request handlers
    /services               # Business logic layer
    /models                 # Database models (Prisma/TypeORM)
    /middleware             # Auth, validation, error handling
    /routes                 # API route definitions
    /utils                  # Helper functions
    /webhooks               # Vapi/Pipedream webhook handlers
  /tests                    # Jest tests
  /prisma                   # Prisma schema and migrations
  package.json
  .env.example

/mobile                     # React Native + Expo app
  /src
    /screens                # Screen components
      /auth                 # Login, Register screens
      /goals                # Goal list, detail, create
      /voice                # Vapi voice interaction
      /profile              # User profile
    /components             # Reusable UI components
    /navigation             # React Navigation setup
    /contexts               # React Context providers
    /hooks                  # Custom hooks (useAuth, useGoals, useVapi)
    /services               # API client and service layer
    /types                  # TypeScript type definitions
    /utils                  # Utility functions
    /theme                  # Colors, fonts, spacing
  /assets                   # Images, fonts, icons
  App.tsx                   # Root component
  app.json                  # Expo configuration
  package.json

/docs                       # Documentation and specs
  /hackathon                # Hackathon-specific docs
  /api                      # API documentation

/pipedream                  # Pipedream workflow configs
  vapi-to-whatsapp.yaml     # WhatsApp integration workflow
```

## Development Phases

### Hackathon Phase (6 Hours) - Current Focus

**Hour 1 - Foundation:**
- Project scaffolding (Expo + Node.js)
- PostgreSQL database setup with Prisma
- User model and JWT authentication
- Basic login/register screens

**Hours 2-4 - Parallel Feature Development:**
- **Stream 1 (Backend)**: Goal CRUD APIs, Vapi webhooks
- **Stream 2 (Frontend)**: Goal screens, navigation, voice UI
- **Stream 3 (Vapi)**: Voice call integration, conversation handling
- **Stream 4 (WhatsApp)**: Pipedream workflow, message templates

**Hours 5-6 - Integration & Demo:**
- Connect all components end-to-end
- Test critical user flow
- Create demo script and test data
- Polish UI for demo impact

### Post-Hackathon Enhancements

**Phase 2 - Goal Management:**
- Goal progress tracking and analytics
- Sub-goals and task breakdown
- Reminders and notifications
- Goal templates and categories

**Phase 3 - Advanced AI:**
- Personalized coaching strategies
- Decision support system
- Progress predictions
- Achievement celebrations

**Phase 4 - Scale & Monetization:**
- Premium tier features
- Team/shared goals
- Integration ecosystem (calendars, productivity tools)
- Advanced analytics dashboard

## Notes for Implementation

### Hackathon Best Practices
- **Demo-first mindset**: Focus on features that look impressive in a 5-minute demo
- **Voice interaction is the star**: Ensure Vapi integration works flawlessly
- **WhatsApp wow factor**: Live demo of receiving goal summary on phone
- **Fallback plans**: Have backup for each integration (manual input if Vapi fails)
- **Visual polish**: Spend last 30 minutes on UI aesthetics

### Critical Path
1. ✅ Auth must work perfectly (P0)
2. ✅ Voice call must connect and record (P0)
3. ✅ Goals must save from voice conversation (P0)
4. ⭐ WhatsApp summary is the "wow moment" (P1)
5. 🎨 UI polish comes last (P2)

### Common Pitfalls to Avoid
- Don't spend too much time on database schema perfection
- Don't over-engineer the backend - simple CRUD is fine
- Don't get stuck on Vapi integration - have text input fallback
- Don't try to implement all P2 features - focus on P0/P1
- Don't skip the demo script - practice the flow before presenting

### Quick Wins for Demo Impact
- **Voice visualization**: Show waveform or pulse animation during Vapi call
- **Real-time goal creation**: Animate goal card appearing after voice conversation
- **WhatsApp notification**: Have judge's phone number ready to demo live
- **Multi-platform**: Show same app on phone + web browser side-by-side
- **Celebration micro-interactions**: Confetti or animation when goal is created
