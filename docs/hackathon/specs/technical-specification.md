# Echo-AI Technical Specification
**Version:** 1.0.0
**Date:** 2025-11-18
**For:** 6-Hour Hackathon MVP

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Backend API Specification](#backend-api-specification)
4. [Frontend Application Structure](#frontend-application-structure)
5. [Vapi Integration](#vapi-integration)
6. [WhatsApp/Pipedream Integration](#whatsapp-pipedream-integration)
7. [Environment Configuration](#environment-configuration)
8. [Deployment Guide](#deployment-guide)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                     │
│  ┌─────────────┬──────────────┬────────────────────┐   │
│  │ Auth Stack  │  Main Stack  │  Voice Integration │   │
│  │  - Login    │  - Home      │  - Vapi SDK        │   │
│  │  - Register │  - Voice     │  - Call Manager    │   │
│  │             │  - Profile   │  - Transcript      │   │
│  └─────────────┴──────────────┴────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST + JWT
                        │ ws:// (for real-time updates)
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)               │
│  ┌──────────────────┬─────────────────┬──────────────┐ │
│  │ Auth Middleware  │ Goal Controller │ Webhooks     │ │
│  │ - JWT Verify     │ - CRUD Ops      │ - Vapi       │ │
│  │ - User Context   │ - Validation    │ - Pipedream  │ │
│  └──────────────────┴─────────────────┴──────────────┘ │
│  ┌──────────────────┬─────────────────┬──────────────┐ │
│  │ User Service     │ Goal Service    │ AI Service   │ │
│  │ - Auth Logic     │ - Business      │ - Goal       │ │
│  │ - Password Hash  │ - Ownership     │   Extraction │ │
│  └──────────────────┴─────────────────┴──────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  ┌──────────┬─────────────┬──────────────────────────┐ │
│  │  users   │   goals     │  conversations           │ │
│  │          │             │  (optional)              │ │
│  └──────────┴─────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐     ┌──────────────────┐
│  Vapi        │────►│  Pipedream       │
│  Voice AI    │     │  (WhatsApp)      │
└──────────────┘     └──────────────────┘
       │                      │
       └──────────┬───────────┘
                  ▼
          Webhook to Backend
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Goals Table

```sql
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'personal',
    status VARCHAR(20) DEFAULT 'active',
    created_from_voice BOOLEAN DEFAULT true,
    vapi_conversation_id VARCHAR(255),
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_category CHECK (category IN ('career', 'health', 'financial', 'education', 'relationships', 'personal', 'creative')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'completed', 'abandoned', 'on_hold'))
);

-- Indexes
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_created_at ON goals(created_at);
CREATE INDEX idx_goals_vapi_conversation_id ON goals(vapi_conversation_id);
```

### Conversations Table (Optional but Recommended)

```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vapi_call_id VARCHAR(255) UNIQUE NOT NULL,
    transcript TEXT,
    summary TEXT,
    goals_extracted JSONB,
    duration_seconds INTEGER,
    call_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_call_status CHECK (call_status IN ('completed', 'failed', 'abandoned'))
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_vapi_call_id ON conversations(vapi_call_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
```

### Database Initialization Script

```sql
-- Drop tables if exist (for fresh start)
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables (in order due to foreign keys)
-- [Insert CREATE TABLE statements from above]

-- Insert test data for development
INSERT INTO users (email, password_hash, full_name, phone_number) VALUES
('test@echoai.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Test User', '+1234567890');

-- Get the test user ID and create sample goals
INSERT INTO goals (user_id, title, description, category, status, created_from_voice) VALUES
(1, 'Learn Spanish fluently', 'Practice 30 minutes daily using Duolingo and conversation practice', 'education', 'active', true),
(1, 'Launch side project', 'Build and ship MVP within 3 months', 'career', 'active', true),
(1, 'Exercise regularly', 'Go to gym 3 times per week', 'health', 'active', false);
```

---

## Backend API Specification

### Base URL
- **Development:** `http://localhost:3000/api/v1`
- **Production:** `https://your-backend.railway.app/api/v1` (or your deployment URL)

### Authentication

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### 1. Authentication Endpoints

**POST /auth/register**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890" // optional
}

Response (201 Created):
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-11-18T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Errors:
400 - Email already exists
400 - Invalid email format
400 - Password too weak (min 8 chars)
500 - Server error
```

**POST /auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Errors:
401 - Invalid credentials
400 - Missing email or password
500 - Server error
```

**GET /auth/me** (Authenticated)
```json
Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "createdAt": "2025-11-18T10:00:00Z"
  }
}

Errors:
401 - Invalid or missing token
500 - Server error
```

#### 2. Goals Endpoints (All require authentication)

**POST /goals**
```json
Request:
{
  "title": "Read 10 books this year",
  "description": "Focus on non-fiction and personal development",
  "category": "education",
  "targetDate": "2025-12-31", // optional
  "createdFromVoice": false
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 5,
    "userId": 1,
    "title": "Read 10 books this year",
    "description": "Focus on non-fiction and personal development",
    "category": "education",
    "status": "active",
    "createdFromVoice": false,
    "targetDate": "2025-12-31",
    "createdAt": "2025-11-18T11:00:00Z",
    "updatedAt": "2025-11-18T11:00:00Z"
  }
}

Errors:
400 - Title required
400 - Invalid category
401 - Unauthorized
500 - Server error
```

**GET /goals**
```json
Query Parameters:
?status=active          // Filter by status
?category=health        // Filter by category
?limit=10              // Limit results
?offset=0              // Pagination offset

Response (200 OK):
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": 1,
        "title": "Learn Spanish fluently",
        "description": "Practice 30 minutes daily",
        "category": "education",
        "status": "active",
        "createdFromVoice": true,
        "vapiConversationId": "call_abc123",
        "targetDate": "2026-06-01",
        "createdAt": "2025-11-18T09:00:00Z",
        "updatedAt": "2025-11-18T09:00:00Z"
      }
    ],
    "total": 5,
    "limit": 10,
    "offset": 0
  }
}

Errors:
401 - Unauthorized
500 - Server error
```

**GET /goals/:id**
```json
Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Learn Spanish fluently",
    "description": "Practice 30 minutes daily",
    "category": "education",
    "status": "active",
    "createdFromVoice": true,
    "vapiConversationId": "call_abc123",
    "createdAt": "2025-11-18T09:00:00Z",
    "updatedAt": "2025-11-18T09:00:00Z"
  }
}

Errors:
404 - Goal not found
403 - Not your goal (unauthorized)
401 - Unauthorized
500 - Server error
```

**PUT /goals/:id**
```json
Request:
{
  "title": "Learn Spanish fluently in 6 months",
  "description": "Updated: Practice 45 minutes daily",
  "status": "active",
  "category": "education"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learn Spanish fluently in 6 months",
    "description": "Updated: Practice 45 minutes daily",
    "status": "active",
    "category": "education",
    "updatedAt": "2025-11-18T12:00:00Z"
  }
}

Errors:
404 - Goal not found
403 - Not your goal
401 - Unauthorized
400 - Invalid data
500 - Server error
```

**DELETE /goals/:id**
```json
Response (200 OK):
{
  "success": true,
  "message": "Goal deleted successfully"
}

Errors:
404 - Goal not found
403 - Not your goal
401 - Unauthorized
500 - Server error
```

#### 3. Webhook Endpoints

**POST /webhooks/vapi/conversation-end**
```json
Request (from Vapi):
{
  "call": {
    "id": "call_abc123def456",
    "status": "completed",
    "startedAt": "2025-11-18T10:00:00Z",
    "endedAt": "2025-11-18T10:05:30Z",
    "durationSeconds": 330
  },
  "transcript": "User: Hey coach, I want to learn Spanish fluently by practicing 30 minutes daily. I also want to launch my side project within 3 months.\n\nAssistant: Those are excellent goals! Let me help you clarify them...",
  "summary": "User set two goals: learning Spanish with daily practice and launching a side project in 3 months.",
  "metadata": {
    "userId": 1,
    "userName": "John Doe"
  },
  "messages": [
    {
      "role": "user",
      "content": "I want to learn Spanish fluently..."
    },
    {
      "role": "assistant",
      "content": "Those are excellent goals..."
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "data": {
    "goalsCreated": [
      {
        "id": 10,
        "title": "Learn Spanish fluently",
        "category": "education"
      },
      {
        "id": 11,
        "title": "Launch side project",
        "category": "career"
      }
    ],
    "conversationSaved": true,
    "whatsappTriggered": true
  }
}

Errors:
400 - Invalid payload
401 - Invalid webhook signature
500 - Server error
```

**POST /webhooks/pipedream/trigger**
```json
Request (from backend to Pipedream):
{
  "userId": 1,
  "userName": "John Doe",
  "phoneNumber": "+1234567890",
  "conversationSummary": "User set two goals: learning Spanish and launching side project",
  "goalsCreated": [
    {
      "title": "Learn Spanish fluently",
      "category": "education"
    },
    {
      "title": "Launch side project",
      "category": "career"
    }
  ],
  "timestamp": "2025-11-18T10:05:30Z"
}
```

---

## Frontend Application Structure

### Directory Structure

```
mobile/
├── App.tsx                      # Root component
├── app.json                     # Expo configuration
├── package.json
├── tsconfig.json
├── .env                         # Environment variables
│
├── src/
│   ├── navigation/
│   │   ├── index.tsx           # Root navigator
│   │   ├── AuthNavigator.tsx   # Auth stack
│   │   └── MainNavigator.tsx   # Main tab navigator
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── goals/
│   │   │   ├── GoalListScreen.tsx
│   │   │   ├── GoalDetailScreen.tsx
│   │   │   └── GoalFormScreen.tsx
│   │   ├── voice/
│   │   │   └── VoiceScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── components/
│   │   ├── GoalCard.tsx
│   │   ├── VoiceVisualizer.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── GoalContext.tsx
│   │   └── VapiContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGoals.ts
│   │   └── useVapi.ts
│   │
│   ├── services/
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts
│   │   ├── goalService.ts
│   │   └── vapiService.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── goal.ts
│   │   └── vapi.ts
│   │
│   ├── utils/
│   │   ├── storage.ts          # AsyncStorage helper
│   │   ├── validation.ts
│   │   └── formatters.ts
│   │
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
```

### TypeScript Interfaces

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

// src/types/goal.ts
export type GoalCategory =
  | 'career'
  | 'health'
  | 'financial'
  | 'education'
  | 'relationships'
  | 'personal'
  | 'creative';

export type GoalStatus =
  | 'active'
  | 'completed'
  | 'abandoned'
  | 'on_hold';

export interface Goal {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  createdFromVoice: boolean;
  vapiConversationId?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  createdFromVoice?: boolean;
}

// src/types/vapi.ts
export type VapiCallStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';

export interface VapiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VapiCallConfig {
  assistantId: string;
  metadata: {
    userId: number;
    userName: string;
  };
}
```

---

## Vapi Integration

### Assistant Configuration

**Dashboard:** https://dashboard.vapi.ai

**Assistant Settings:**

```yaml
Name: Goal Coach

System Prompt: |
  You are an enthusiastic and supportive AI goal-setting coach. Your role is to help users clarify and define their goals through natural conversation.

  Guidelines:
  - Be warm, encouraging, and positive
  - Ask probing questions to help users clarify vague goals
  - Help them make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
  - Listen for goal statements like "I want to...", "My goal is...", "I need to..."
  - Extract clear goal titles and appropriate categories
  - Suggest realistic timeframes
  - End conversations by summarizing the goals discussed

  Categories to classify goals into:
  - career: Work, business, professional development
  - health: Fitness, wellness, medical goals
  - financial: Money, savings, investments
  - education: Learning, courses, skills
  - relationships: Family, friends, romantic
  - personal: Self-improvement, habits, lifestyle
  - creative: Art, music, writing, hobbies

  Example conversation:
  User: "I want to get better at Spanish"
  You: "That's great! How fluent would you like to become, and by when?"
  User: "Conversational level in 6 months"
  You: "Perfect! Do you have a specific practice routine in mind?"
  User: "Maybe 30 minutes daily"
  You: "Excellent plan! So your goal is: Learn conversational Spanish by practicing 30 minutes daily for 6 months. I'll save that for you!"

Voice: Select a friendly, encouraging voice (e.g., "en-US-JennyNeural")

Model: GPT-4 Turbo (for best performance)

First Message: |
  Hey! I'm your goal coach. Tell me about something you'd like to achieve - a goal, a dream, or something you want to work on. I'm here to help you make it happen!

End Call Phrases:
  - "Thanks coach"
  - "That's all for now"
  - "Goodbye"
  - "I'm done"

Background Sound: None (clear conversation)
```

### Webhook Configuration

```yaml
Webhook URL: https://your-backend.railway.app/api/v1/webhooks/vapi/conversation-end

Events to Subscribe:
  - call.ended
  - message.sent (optional, for real-time transcript)

Webhook Headers:
  X-Vapi-Secret: <YOUR_WEBHOOK_SECRET>
  Content-Type: application/json

Payload Format: Full (includes transcript, messages, metadata)
```

### Frontend SDK Implementation

```typescript
// src/services/vapiService.ts
import Vapi from '@vapi-ai/web'; // or @vapi-ai/react-native

export const vapiClient = new Vapi(process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY!);

export const startVapiCall = async (userId: number, userName: string) => {
  await vapiClient.start({
    assistantId: process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID!,
    metadata: {
      userId: userId.toString(),
      userName,
    },
  });
};

export const stopVapiCall = () => {
  vapiClient.stop();
};

// src/hooks/useVapi.ts
import { useState, useEffect } from 'react';
import { vapiClient, startVapiCall, stopVapiCall } from '../services/vapiService';
import { useAuth } from './useAuth';

export const useVapi = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<VapiCallStatus>('idle');
  const [messages, setMessages] = useState<VapiMessage[]>([]);

  useEffect(() => {
    vapiClient.on('call-start', () => setStatus('connected'));
    vapiClient.on('call-end', () => {
      setStatus('disconnected');
      setMessages([]);
    });
    vapiClient.on('message', (message) => {
      setMessages(prev => [...prev, {
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString()
      }]);
    });
    vapiClient.on('error', (error) => {
      console.error('Vapi error:', error);
      setStatus('disconnected');
    });

    return () => {
      vapiClient.removeAllListeners();
    };
  }, []);

  const start = async () => {
    if (!user) return;
    setStatus('connecting');
    try {
      await startVapiCall(user.id, user.fullName);
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('disconnected');
    }
  };

  const stop = () => {
    stopVapiCall();
    setStatus('disconnecting');
  };

  return { status, messages, start, stop };
};
```

---

## WhatsApp/Pipedream Integration

### Pipedream Workflow Configuration

**Dashboard:** https://pipedream.com

**Workflow Name:** Vapi to WhatsApp - Goal Summary

**Steps:**

```yaml
Step 1: HTTP Webhook Trigger
  Name: receive-vapi-webhook
  URL: <Auto-generated, e.g., https://eo123abc.m.pipedream.net>
  Method: POST
  Authentication: None (or add secret header validation)

Step 2: Code - Parse and Format
  Language: Node.js
  Code: |
    export default defineComponent({
      async run({ steps, $ }) {
        const { userId, userName, phoneNumber, conversationSummary, goalsCreated } = steps.trigger.event.body;

        // Format WhatsApp message
        const goalsList = goalsCreated
          .map(g => `✓ ${g.title} (${g.category})`)
          .join('\n');

        const message = `🎯 *Goal Coaching Session Complete!*

Hey ${userName}! Here's what we discussed:

${conversationSummary}

*Goals Created:*
${goalsList}

Keep crushing it! 💪

_Reply HELP for support or STOP to unsubscribe_`;

        return {
          phoneNumber,
          message,
          userName
        };
      }
    });

Step 3: WhatsApp by Online Live Support - Send Message
  Session ID: <YOUR_SESSION_ID>
  Phone Number: {{ steps.parse_format.$return_value.phoneNumber }}
  Message: {{ steps.parse_format.$return_value.message }}

  OR use Twilio/other provider:

Step 3 Alternative: Twilio - Send SMS
  Account SID: <YOUR_TWILIO_SID>
  Auth Token: <YOUR_TWILIO_TOKEN>
  From: <YOUR_TWILIO_NUMBER>
  To: {{ steps.parse_format.$return_value.phoneNumber }}
  Body: {{ steps.parse_format.$return_value.message }}
```

### Backend Trigger Code

```typescript
// src/services/pipedreamService.ts
import axios from 'axios';

const PIPEDREAM_WEBHOOK_URL = process.env.PIPEDREAM_WEBHOOK_URL!;

export const triggerWhatsAppSummary = async (data: {
  userId: number;
  userName: string;
  phoneNumber: string;
  conversationSummary: string;
  goalsCreated: Array<{ title: string; category: string }>;
}) => {
  try {
    await axios.post(PIPEDREAM_WEBHOOK_URL, data);
    console.log('WhatsApp summary triggered for user:', data.userId);
  } catch (error) {
    console.error('Failed to trigger WhatsApp:', error);
    // Don't throw - non-critical feature
  }
};
```

---

## Environment Configuration

### Backend .env

```bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/echoai_dev
# Or for production:
# DATABASE_URL=postgresql://user:pass@host:5432/echoai_prod

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Vapi
VAPI_API_KEY=sk_test_abc123...
VAPI_WEBHOOK_SECRET=whsec_xyz789...

# Pipedream
PIPEDREAM_WEBHOOK_URL=https://eo123abc.m.pipedream.net

# CORS
CORS_ORIGIN=http://localhost:19006,http://localhost:8081
# For production, add your frontend URLs

# Optional: Logging
LOG_LEVEL=debug
```

### Frontend .env

```bash
# API
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
# For production: https://your-backend.railway.app/api/v1

# Vapi
EXPO_PUBLIC_VAPI_PUBLIC_KEY=pk_test_abc123...
EXPO_PUBLIC_VAPI_ASSISTANT_ID=asst_abc123def456...

# App Config
EXPO_PUBLIC_APP_NAME=Echo-AI
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Template Files to Create Tonight

**backend/.env.example**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/echoai_dev
JWT_SECRET=CHANGE_THIS_SECRET_KEY
JWT_EXPIRES_IN=7d
VAPI_API_KEY=YOUR_VAPI_API_KEY_HERE
VAPI_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
PIPEDREAM_WEBHOOK_URL=YOUR_PIPEDREAM_WEBHOOK_URL_HERE
CORS_ORIGIN=http://localhost:19006
```

**mobile/.env.example**
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_VAPI_PUBLIC_KEY=YOUR_VAPI_PUBLIC_KEY_HERE
EXPO_PUBLIC_VAPI_ASSISTANT_ID=YOUR_ASSISTANT_ID_HERE
EXPO_PUBLIC_APP_NAME=Echo-AI
```

---

## Deployment Guide

### Quick Deploy (For Hackathon)

**Backend - Railway.app (Recommended)**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Deploy
railway up

# 6. Get deployment URL
railway domain
```

**Frontend - Expo**

```bash
# For development/demo
npx expo start

# For production (after hackathon)
eas build --platform all
```

---

## Integration Keys Checklist

**Create these tonight:**

- [ ] Vapi account → Get public key and assistant ID
- [ ] Pipedream account → Create workflow, get webhook URL
- [ ] WhatsApp/Twilio → Get credentials (or use test mode)
- [ ] Create `.env` files from templates above
- [ ] Test database connection

**Fill in tomorrow morning:**
- [ ] Replace placeholder keys in `.env` files
- [ ] Test Vapi connection
- [ ] Test Pipedream webhook
- [ ] Verify database accessible

---

**This spec is complete and ready for agent execution tomorrow!** 🚀
