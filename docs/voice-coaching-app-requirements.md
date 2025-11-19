# Voice Coaching App - Product Requirements Document

## Executive Summary

An AI-powered voice coach that analyzes vocal tone/energy and responds with emotionally-intelligent micro-coaching in real-time. The app delivers personalized coaching responses and scheduled voice reminders via WhatsApp.

---

## Core Concept

**Product Name**: Echo Coach (or similar)

**Value Proposition**: Your personal AI coach that listens not just to your words, but to your emotional state - responding with the exact type of coaching you need in the moment.

**Key Differentiators**:
- Real-time tone and energy analysis
- Adaptive coaching responses (push/calm/reframe)
- 10-second micro-coaching format
- WhatsApp voice note integration
- Scheduled daily voice reminders

---

## Functional Requirements

### Mode A: Interactive Voice Check (Real-time Coaching)

#### User Flow
1. User opens app and taps "Voice Check" button
2. Records voice message (15-60 seconds typical)
3. AI analyzes:
   - **Speech content** (what they're saying)
   - **Vocal tone** (stressed, calm, excited, defeated)
   - **Energy level** (high, medium, low)
   - **Emotional state** (anxious, confident, overwhelmed, motivated)
4. App responds with 10-second voice coaching tailored to detected state:
   - **Push** (when energy is low, tone is defeated)
   - **Calm** (when tone is anxious, energy is frantic)
   - **Reframe** (when content is negative/limiting beliefs)

#### Key Features
- Voice recording with waveform visualization
- Real-time tone/energy analysis
- Immediate AI voice response (< 5 seconds)
- Conversation history with playback
- Visual indicator of detected emotional state
- Replay both user recording and AI response
- Session timestamp and emotional tag

#### Acceptance Criteria
- Recording captures clear audio (minimum 16kHz sample rate)
- Tone analysis completes within 2 seconds
- AI response generates within 3 seconds
- Total interaction time: < 10 seconds from recording end to response playback
- User can replay any past session

---

### Mode B: Daily Voice Reminders (Scheduled Coaching)

#### User Flow
1. User configures reminder schedule (e.g., 7am, 12pm, 7pm)
2. User sets coaching intention per time slot:
   - Morning: "Energize me"
   - Midday: "Keep me focused"
   - Evening: "Help me reflect"
3. At scheduled time, app sends voice reminder via WhatsApp
4. Voice note contains personalized coaching based on:
   - Time of day
   - User's recent emotional patterns
   - Preset coaching style preference
   - Optional: specific goal or intention user set

#### Key Features
- Multiple daily reminder slots (up to 5)
- Per-reminder coaching style customization
- WhatsApp voice note delivery
- Adaptive messaging based on user patterns
- Reminder history and analytics
- Enable/disable individual reminders
- Timezone-aware scheduling
- Preview reminder before saving

#### Acceptance Criteria
- Reminders fire within 1 minute of scheduled time
- WhatsApp voice notes deliver successfully 99% of the time
- User can edit/delete reminders
- Reminders pause when user disables them
- System handles timezone changes correctly

---

### WhatsApp Integration

#### Capabilities
- Send AI-generated voice notes to user's WhatsApp
- Session summaries after interactive sessions
- Scheduled daily reminder delivery
- Optional: two-way conversation (user replies via WhatsApp)
- Link back to app for full session details

#### Message Types
1. **Session Summary** (after Mode A interaction)
   - Brief recap of detected emotional state
   - Key coaching point delivered
   - Encouragement to continue

2. **Daily Reminder** (scheduled)
   - Personalized coaching message
   - Time-of-day appropriate tone
   - Optional: reference to user's goals

3. **Achievement Milestone** (optional)
   - Celebration for completing sessions
   - Weekly recap voice note

#### Acceptance Criteria
- Voice notes are 10-30 seconds long
- Audio quality is clear and professional
- Messages include user's name or personalization
- Delivery confirmation tracked
- Fallback to text message if voice fails

---

## Technical Requirements

### Voice Analysis Technology

#### Tone & Energy Detection

**Primary Option: Hume AI**
- Emotion detection from voice
- Real-time prosody analysis
- 28+ emotional dimensions
- Confidence scores per emotion

**Alternative: Vapi + Custom Analysis**
- Vapi for transcription
- Custom ML model for tone analysis
- Simpler emotion categories

**Metrics to Extract:**
- Pitch variation (stress indicators)
- Speech rate (anxiety/excitement)
- Volume patterns (confidence/energy)
- Pause frequency (overwhelm/uncertainty)
- Vocal tension markers
- Emotional valence (positive/negative)

#### Emotion-to-Coaching Mapping

| Detected State | Energy | Tone | Coaching Response |
|---------------|--------|------|-------------------|
| Stressed | High | Anxious | CALM - Grounding, breathing, structure |
| Overwhelmed | Low | Defeated | PUSH - Motivation, small wins, capability reminder |
| Negative Self-Talk | Medium | Critical | REFRAME - Perspective shift, evidence counter |
| Excited but Scattered | High | Positive | FOCUS - Channel energy, prioritize |
| Burned Out | Low | Flat | REST - Permission to pause, self-compassion |
| Confident | Medium | Positive | REINFORCE - Acknowledge, build on momentum |

#### Voice Response Generation

**Text-to-Speech Engine:**
- **Primary**: ElevenLabs (high quality, emotional range)
- **Alternative**: Play.ht or Azure Neural TTS
- **Requirements**:
  - Natural prosody
  - Emotional adaptability
  - Multiple voice options
  - < 2 second generation time

**Voice Personas:**
- **Energetic Coach** (Sarah): High energy, motivating, upbeat
- **Calm Mentor** (Marcus): Steady, grounding, reassuring
- **Wise Guide** (Elena): Thoughtful, reframing, perspective-focused

**Response Generation:**
- GPT-4 with specialized coaching prompts
- 10-second target length (approximately 25-30 words)
- Personalization using user name and context
- Coaching framework: Acknowledge → Insight → Action

---

### Platform Architecture

#### Frontend Stack

**Framework**: React Native + Expo
- Cross-platform (iOS/Android/Web)
- Managed workflow for rapid development
- Expo AV for audio recording/playback
- Expo Notifications for reminders

**Key Libraries:**
```json
{
  "expo-av": "Audio recording and playback",
  "expo-notifications": "Push notifications and scheduling",
  "expo-linking": "WhatsApp deep linking",
  "react-native-animatable": "UI animations",
  "react-native-svg": "Waveform visualization",
  "@react-navigation/native": "Navigation",
  "react-hook-form": "Form management",
  "date-fns": "Time/date handling"
}
```

**Screen Structure:**
```
Auth Stack
  - OnboardingScreen
  - LoginScreen
  - PhoneVerificationScreen

Main Stack
  - Tab Navigator
    - VoiceCheckScreen (Mode A)
    - HistoryScreen
    - RemindersScreen (Mode B)
    - ProfileScreen
```

#### Backend Stack

**Runtime**: Node.js (v18+)
**Framework**: Express.js

**Key Dependencies:**
```json
{
  "express": "REST API server",
  "prisma": "Database ORM",
  "jsonwebtoken": "Authentication",
  "bcrypt": "Password hashing",
  "bull": "Job queue for scheduled reminders",
  "axios": "HTTP client for external APIs",
  "twilio": "WhatsApp messaging",
  "openai": "GPT-4 for coaching responses",
  "@hume/api": "Emotion detection (if using Hume)",
  "elevenlabs-api": "Text-to-speech"
}
```

**API Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

POST   /api/v1/voice/analyze          # Upload recording, get tone analysis
POST   /api/v1/voice/generate-response # Generate coaching response
GET    /api/v1/voice/sessions          # Get session history
GET    /api/v1/voice/sessions/:id      # Get specific session

POST   /api/v1/reminders               # Create reminder
GET    /api/v1/reminders               # List user reminders
PUT    /api/v1/reminders/:id           # Update reminder
DELETE /api/v1/reminders/:id           # Delete reminder

POST   /api/v1/whatsapp/send           # Send WhatsApp voice note
GET    /api/v1/whatsapp/status/:id     # Check delivery status

GET    /api/v1/analytics/emotional-trends  # User's emotional patterns
```

**Background Jobs:**
- Reminder scheduler (checks every minute)
- WhatsApp delivery queue
- Session cleanup (old audio files)
- Analytics aggregation

#### Database Schema

**Technology**: PostgreSQL + Prisma ORM

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  whatsapp_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  preferred_coach_persona VARCHAR(50) DEFAULT 'calm',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Voice Sessions (Mode A)
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  recording_duration_seconds INTEGER,

  -- Analysis Results
  detected_emotion VARCHAR(50),      -- anxious, stressed, calm, excited, defeated
  detected_energy VARCHAR(20),       -- high, medium, low
  detected_tone VARCHAR(50),         -- positive, negative, neutral
  confidence_score DECIMAL(3,2),     -- 0.00 to 1.00

  -- AI Response
  coaching_type VARCHAR(20),         -- push, calm, reframe
  response_text TEXT,
  response_audio_url TEXT,
  response_duration_seconds INTEGER,

  -- Metadata
  transcript TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  whatsapp_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Reminders (Mode B)
CREATE TABLE daily_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Schedule
  time_of_day TIME NOT NULL,         -- e.g., 07:00:00
  timezone VARCHAR(50) DEFAULT 'UTC',
  days_of_week INTEGER[],            -- [0,1,2,3,4,5,6] for Sun-Sat

  -- Configuration
  coaching_intention TEXT,           -- "Energize me", "Help me focus"
  coach_persona VARCHAR(50),         -- override user default

  -- Status
  active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMP,
  next_scheduled_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminder Deliveries (tracking)
CREATE TABLE reminder_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID REFERENCES daily_reminders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  scheduled_for TIMESTAMP NOT NULL,
  delivered_at TIMESTAMP,
  delivery_status VARCHAR(20),       -- pending, sent, failed, read

  message_text TEXT,
  voice_note_url TEXT,
  whatsapp_message_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW()
);

-- Emotional Analytics
CREATE TABLE emotional_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Aggregate metrics
  avg_energy_level DECIMAL(3,2),
  dominant_emotion VARCHAR(50),
  session_count INTEGER DEFAULT 0,

  -- Coaching effectiveness
  push_responses_count INTEGER DEFAULT 0,
  calm_responses_count INTEGER DEFAULT 0,
  reframe_responses_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_voice_sessions_user_created ON voice_sessions(user_id, created_at DESC);
CREATE INDEX idx_reminders_user_active ON daily_reminders(user_id, active);
CREATE INDEX idx_reminder_deliveries_scheduled ON reminder_deliveries(scheduled_for) WHERE delivery_status = 'pending';
CREATE INDEX idx_emotional_trends_user_date ON emotional_trends(user_id, date DESC);
```

---

### Integration Specifications

#### Hume AI Integration (Emotion Detection)

**API**: Hume AI Vocal Expression Model

**Flow**:
1. Record audio on mobile device
2. Upload audio file to backend
3. Backend sends to Hume API
4. Receive emotion predictions with confidence scores
5. Map top emotions to coaching type

**Request Example**:
```javascript
const hume = new HumeClient({ apiKey: process.env.HUME_API_KEY });

const result = await hume.expressionMeasurement.batch.predictAudioFiles({
  files: [audioBuffer],
  models: ['prosody']
});

// Response includes emotions like:
// { name: 'Anxiety', score: 0.72 }
// { name: 'Determination', score: 0.45 }
```

#### ElevenLabs Integration (Voice Generation)

**API**: ElevenLabs Text-to-Speech

**Flow**:
1. Generate coaching text with GPT-4
2. Send to ElevenLabs with voice ID and settings
3. Receive audio stream
4. Upload to cloud storage (AWS S3 / Cloudinary)
5. Return URL to frontend

**Request Example**:
```javascript
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: coachingMessage,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  }
);

const audioBuffer = await response.arrayBuffer();
```

#### WhatsApp Integration (Twilio or Cloud API)

**Option A: Twilio**
```javascript
const twilio = require('twilio')(accountSid, authToken);

await twilio.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${userWhatsAppNumber}`,
  mediaUrl: [voiceNoteUrl]
});
```

**Option B: WhatsApp Cloud API (Official)**
```javascript
const response = await fetch(
  `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: userWhatsAppNumber,
      type: 'audio',
      audio: {
        link: voiceNoteUrl
      }
    })
  }
);
```

#### GPT-4 Coaching Prompt Engineering

**System Prompt Template**:
```
You are an expert AI life coach. You provide micro-coaching responses
(exactly 25-30 words) that are actionable, empathetic, and energizing.

Current Context:
- User's emotional state: {detected_emotion}
- Energy level: {energy_level}
- What they said: {transcript}
- Coaching type needed: {coaching_type}

Coaching Types:
- PUSH: Motivate them with energy and belief in their capability
- CALM: Ground them with structure, breathing, and perspective
- REFRAME: Shift their perspective from limiting to empowering

Respond in first person as their coach. Use their name: {user_name}.
Be conversational and warm. End with a clear micro-action they can take now.
```

**Example Responses**:
```
PUSH: "Sarah, I hear you're tired, but you've crushed harder challenges.
Take 5 minutes for coffee, then tackle just ONE thing. You've got this."

CALM: "Marcus, let's breathe. Your stress is real, but you're safe.
Write down your top 3 priorities, then focus on only the first one today."

REFRAME: "Elena, 'I'm behind' becomes 'I'm learning at my own pace.'
Progress isn't linear. What's ONE thing you did accomplish this week?"
```

---

## Priority Tiers for Prototype Demo

### 🔥 P0: Must-Have for Demo Impact

#### 1. Interactive Voice Check (Mode A) - Working End-to-End
- **Features**:
  - Record voice (15-60 seconds)
  - Display waveform during recording
  - Show "Analyzing..." state
  - Display detected emotion (visual indicator)
  - Play AI coaching response automatically
  - Save session to history
- **WHY**: This is your core differentiator
- **Demo Time**: 60 seconds
- **Success Metric**: Judge says "wow, it actually works"

#### 2. Tone/Energy Visualization
- **Features**:
  - Real-time visual indicator during analysis
  - Color-coded emotional states:
    - 🔴 Red: Stressed/Anxious
    - 🟢 Green: Calm/Centered
    - 🟡 Yellow: Neutral/Reflective
    - 🔵 Blue: Energized/Motivated
  - Animated transition between states
  - Emotion label with confidence %
- **WHY**: Makes the "AI listening" tangible and visual
- **Demo Time**: 10 seconds
- **Success Metric**: Non-technical judges understand what's happening

#### 3. Three Distinct Coaching Response Types
- **Prepare 3 demo scenarios**:

  **Scenario 1: Stressed/Anxious**
  - User script: "I have so much to do today and I don't know where to start, I'm feeling really overwhelmed"
  - Expected detection: HIGH ANXIETY + MEDIUM ENERGY
  - AI response type: CALM
  - Sample response: "I hear you. Let's breathe. Pick just ONE task to start. You don't need to solve everything right now. What's the smallest next step?"

  **Scenario 2: Defeated/Low Energy**
  - User script: "I'm so tired of trying, I feel like I'm never going to reach my goals, what's the point"
  - Expected detection: LOW ENERGY + NEGATIVE TONE
  - AI response type: PUSH
  - Sample response: "Hey, this feeling is temporary. You've overcome obstacles before. Rest today, but tomorrow, take ONE small action. You're stronger than you think."

  **Scenario 3: Negative Self-Talk**
  - User script: "I'm not smart enough to do this, everyone else seems to get it but I just don't"
  - Expected detection: SELF-CRITICAL + MEDIUM ENERGY
  - AI response type: REFRAME
  - Sample response: "Stop right there. 'Not smart enough' is a story, not a fact. You're learning. Everyone struggles in private. What's one thing you DO understand?"

- **WHY**: Shows AI adaptability and intelligence
- **Demo Time**: 90 seconds (30 sec each scenario)
- **Success Metric**: Judges see clear differentiation in responses

#### 4. WhatsApp Voice Note Delivery
- **Features**:
  - "Send to WhatsApp" button after session
  - Show loading state
  - Display success confirmation
  - **LIVE DEMO**: Receive actual voice note on phone during presentation
  - Play snippet of WhatsApp message
- **WHY**: "Wow moment" - tangible, shareable result
- **Demo Time**: 30 seconds
- **Success Metric**: Judge's phone receives message (have backup phone ready)

---

### ⭐ P1: Nice-to-Have for Polish

#### 5. Session History with Playback
- **Features**:
  - List of past 5-10 sessions
  - Show date/time, detected emotion, coaching type
  - Tap to expand session details
  - Replay user recording
  - Replay AI response
  - Emotional trend line graph (simple)
- **WHY**: Shows ongoing value, not just one-off interaction
- **Demo Time**: 20 seconds
- **Success Metric**: Demonstrates data retention and patterns

#### 6. Daily Reminder Setup (UI Only - Can Be Mock)
- **Features**:
  - "Set Daily Reminders" screen
  - Time picker for 3 slots (morning/afternoon/evening)
  - Coaching intention dropdown per slot
  - Toggle active/inactive
  - Preview of what reminder would say
- **WHY**: Demonstrates full product vision (Mode B)
- **Demo Time**: 15 seconds
- **Success Metric**: Judges understand the scheduled reminder concept

#### 7. Coach Persona Selection
- **Features**:
  - Profile screen with voice options
  - 2-3 coach personas with descriptions:
    - "Energetic Sarah" - High energy, motivating
    - "Calm Marcus" - Steady, grounding
    - "Wise Elena" - Thoughtful, reframing
  - Sample audio clip for each
  - Selection saves to user profile
- **WHY**: Personalization angle, shows product depth
- **Demo Time**: 10 seconds
- **Success Metric**: Judges appreciate customization

---

### 🎨 P2: If Time Allows (Polish & Extras)

#### 8. Animated Coaching Response
- **Features**:
  - Avatar or abstract visual that "speaks" during AI response
  - Lip-sync or waveform animation
  - Breathing animation during calm responses
- **WHY**: Visual engagement, professional feel

#### 9. Progress Dashboard
- **Features**:
  - Weekly emotional trend graph
  - "Sessions completed" counter
  - "Most common emotion" badge
  - Coaching type distribution pie chart
- **WHY**: Data-driven coaching narrative, gamification

#### 10. Multi-Platform Demo
- **Features**:
  - Show same session on phone + web browser simultaneously
  - Real-time sync between devices
- **WHY**: Technical credibility, shows scalability

#### 11. Onboarding Flow
- **Features**:
  - 3-screen intro explaining the concept
  - Sample voice interaction walkthrough
  - WhatsApp number collection
  - Coach persona selection
- **WHY**: Professional product feel

#### 12. Haptic Feedback & Micro-interactions
- **Features**:
  - Gentle vibration when recording starts/stops
  - Vibration pulse when emotion detected
  - Button press animations
  - Success confetti on first session
- **WHY**: Premium mobile experience

---

## Demo Script for Maximum Impact (5 Minutes)

### Setup Before Demo
- [ ] Pre-load 2 historical sessions in history
- [ ] Have WhatsApp open on phone (visible to judges)
- [ ] Test audio recording on presentation device
- [ ] Prepare backup pre-recorded demos if live fails
- [ ] Queue up emotional state visualizations
- [ ] Have 3 scripted voice recordings ready

---

### Minute 1: The Problem (Hook)
**Slide/Talking Points**:
- "We all have moments of stress, self-doubt, or overwhelm"
- "Traditional coaching is expensive ($200+/hour) and not available 24/7"
- "Existing apps give generic advice - they don't actually LISTEN to how you feel"

**Show**: Problem slide with relatable scenarios

---

### Minute 2: Mode A - Interactive Demo (Stressed State)
**Script**:
1. Open app on phone (projected/screen share)
2. Tap "Voice Check" button
3. Record stressed voice:
   - "I have so much to do today, I don't even know where to start, I'm feeling really overwhelmed"
4. Show waveform recording
5. Tap "Send" → Show analyzing animation
6. **CALL OUT**: "Watch this - it's detecting not just my words, but my emotional state"
7. Display: 🔴 HIGH STRESS + ANXIOUS detected (visual indicator)
8. Play AI response (auto-plays):
   - "I hear you. Let's breathe. Pick just ONE task to start. You don't need to solve everything right now. What's the smallest next step?"

**Impact Line**: "Notice how it didn't just give me a to-do list - it grounded me first, then gave me structure"

---

### Minute 3: Adaptive Intelligence Demo (Defeated State)
**Script**:
1. Tap "New Voice Check"
2. Record defeated voice:
   - "I'm so tired of trying, I feel like I'm never going to reach my goals"
3. Show analyzing
4. Display: 🟡 LOW ENERGY + DEFEATED detected
5. Play AI response:
   - "Hey, this feeling is temporary. You've overcome obstacles before. Rest today, but tomorrow, take ONE small action. You're stronger than you think."

**Impact Line**: "Same person, different emotional state - completely different coaching approach. It PUSHED me instead of calming me."

**Show side-by-side comparison**:
| Session 1 | Session 2 |
|-----------|-----------|
| Stressed → CALM response | Defeated → PUSH response |

---

### Minute 4: WhatsApp Integration (Wow Moment)
**Script**:
1. Tap "Send to WhatsApp" button
2. Show sending animation (2-3 seconds)
3. **PHONE NOTIFICATION ARRIVES** (visible on screen or hold up phone)
4. Open WhatsApp message
5. Play 5-second clip of voice note:
   - "Hey [Name], your session recap: You were feeling stressed about your workload. Remember - one task at a time. You've got this."

**Impact Line**: "Your coaching doesn't stay trapped in the app. It follows you throughout your day, right where you already are - WhatsApp."

---

### Minute 5: The Vision (Future Features + Close)
**Script**:
1. Show session history screen
   - "Track your emotional patterns over time"
   - Point to emotional trend graph
2. Show daily reminders setup screen (Mode B)
   - "Imagine waking up to a personalized voice note: 'Good morning Sarah, today's intention: energized focus'"
3. Show coach persona selection
   - "Choose the coaching style that resonates with you"

**Closing Line**:
- "This isn't just an app - it's your personal emotional fitness tracker and 24/7 coach"
- "We're making world-class coaching accessible to everyone, everywhere, anytime"
- **Call to Action**: "Try it yourself right now - who wants to record how they're feeling?"

---

## Quick Wins for Wow Factor

### Visual & Audio Polish
1. **Voice Waveform Animation**
   - Pulsing, animated waveform during recording
   - Different colors based on detected volume
   - Smooth transitions between states

2. **Emotional State Color Shift**
   - Entire UI background subtly shifts color based on detected emotion
   - Gradient transitions (not jarring)
   - Color psychology: red (stress), green (calm), blue (focused)

3. **Coach "Thinking" Indicator**
   - 2-3 second animated indicator before AI responds
   - Shows: "Listening to your tone...", "Understanding your energy...", "Crafting your coaching..."
   - Makes latency feel intentional, not buggy

4. **Haptic Feedback (Mobile)**
   - Gentle vibration when recording starts
   - Double pulse when recording stops
   - Success vibration when response plays

5. **Celebration Micro-interaction**
   - Brief confetti animation on first session completion
   - "Great job opening up" message
   - Encourages continued use

### Demo Techniques
6. **Live Judge Participation**
   - "Someone want to try? Record how you're feeling about this presentation right now"
   - Risky but memorable if it works
   - Have backup recording ready

7. **Before/After Comparison**
   - Show user's stressed face/posture before recording
   - Show calmer demeanor after AI response
   - Visual storytelling

8. **Phone Screen Mirroring**
   - Live mirror phone screen to projector
   - Shows real mobile experience
   - WhatsApp notification arrival is visible

9. **Multi-Sensory Experience**
   - Play AI voice response through good speakers
   - Show visual emotion indicators
   - Haptic feedback (if device supports)

10. **Emotional Authenticity**
    - Use REAL stressed voice, not acted
    - Show genuine moment of stress/doubt
    - AI response feels more impactful

---

## Technical Implementation Priority

### Week 1: Foundation (If building prototype)

**Day 1-2: Project Setup**
- [ ] Initialize React Native + Expo project
- [ ] Set up Node.js + Express backend
- [ ] Configure PostgreSQL database
- [ ] Create Prisma schema and migrations
- [ ] Basic auth (JWT) implementation
- [ ] Deploy backend to Railway/Render for testing

**Day 3-4: Audio Recording & Playback**
- [ ] Implement expo-av audio recording
- [ ] Upload audio to backend endpoint
- [ ] Store audio files (AWS S3 or Cloudinary)
- [ ] Basic playback functionality
- [ ] Waveform visualization (react-native-svg)

**Day 5-7: AI Integrations (MVP)**
- [ ] Integrate Hume AI for emotion detection
- [ ] Or implement fallback: mock tone analysis (3 hardcoded scenarios)
- [ ] Integrate ElevenLabs for TTS
- [ ] GPT-4 prompt engineering for coaching responses
- [ ] Connect voice analysis → coaching generation flow

---

### Week 2: Features & Polish

**Day 8-10: Mode A Complete**
- [ ] Session creation and storage
- [ ] History screen with list of sessions
- [ ] Session detail view with playback
- [ ] Emotional state visualization
- [ ] UI polish and animations
- [ ] Error handling and loading states

**Day 11-12: WhatsApp Integration**
- [ ] Set up Twilio or WhatsApp Cloud API
- [ ] Send test voice note to WhatsApp
- [ ] Generate session summary voice notes
- [ ] Track delivery status
- [ ] In-app confirmation when sent

**Day 13: Mode B (Reminders - Basic)**
- [ ] Reminder creation UI
- [ ] Store reminders in database
- [ ] Display list of active reminders
- [ ] Don't need to implement actual delivery for demo
- [ ] Just show UI/UX flow

**Day 14: Demo Prep**
- [ ] Create 3 test scenarios with scripts
- [ ] Pre-load demo data (2 historical sessions)
- [ ] Test end-to-end flow 10+ times
- [ ] Prepare backup recordings in case live demo fails
- [ ] Practice demo script with timing
- [ ] Test WhatsApp delivery to demo phone
- [ ] Record backup video demo

---

## Non-Functional Requirements

### Performance Targets
- **App launch time**: < 2 seconds (cold start)
- **Recording start latency**: < 300ms
- **Voice analysis time**: < 3 seconds
- **AI response generation**: < 3 seconds
- **Total interaction time**: < 10 seconds (record → response)
- **WhatsApp delivery time**: < 10 seconds
- **Session history load**: < 1 second

### Reliability Targets
- **Uptime**: 99.5% for MVP (allows for hackathon testing)
- **WhatsApp delivery success rate**: 95%+
- **Audio recording success rate**: 99%+
- **Error handling**: Graceful degradation with user-friendly messages

### Security & Privacy
- **Authentication**: JWT tokens with 7-day expiration
- **Password storage**: bcrypt hashing (10 rounds minimum)
- **Audio storage**: Private S3 buckets with signed URLs
- **HTTPS only**: All API communication encrypted
- **PII handling**:
  - User phone numbers encrypted at rest
  - Audio recordings auto-deleted after 30 days (configurable)
  - No third-party analytics tracking sensitive data

### Scalability (Future)
- **Database**: Designed for 10K+ users
- **Audio storage**: CDN distribution for playback
- **Background jobs**: Horizontal scaling with Redis + Bull
- **API rate limiting**: 100 requests/minute per user

### Accessibility
- **Screen reader support**: ARIA labels on all interactive elements
- **High contrast mode**: Support for vision impairments
- **Voice feedback**: Audio confirmation when recording starts/stops
- **Error messages**: Clear, non-technical language

---

## User Experience Principles

### Mobile-First Design
- Large, tappable buttons (minimum 44px touch target)
- Bottom navigation for easy thumb reach
- Swipe gestures for history navigation
- Pull-to-refresh on history screen

### Conversational Tone
- All UI copy should feel like talking to a friend
- Error messages are encouraging, not punishing
- Success states celebrate user progress

### Emotional Safety
- Users can delete any session instantly
- No judgment in AI responses
- Option to disable WhatsApp sharing
- Private by default - no social features

### Immediate Feedback
- Visual confirmation when recording starts
- Progress indicators during analysis
- Instant playback of AI response
- Clear status messages ("Sending to WhatsApp...")

---

## Risks & Mitigation Strategies

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Hume AI latency > 5 seconds | High | Medium | Implement loading animation, fallback to mock analysis |
| ElevenLabs API downtime | High | Low | Pre-generate 10 common responses, fallback to Azure TTS |
| WhatsApp delivery fails during demo | Critical | Medium | Have backup: show pre-recorded success video |
| Audio recording fails on iOS | High | Low | Test on multiple devices, have web fallback |
| GPT-4 generates inappropriate response | Medium | Low | Implement response validation, content filtering |

### Demo Day Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No internet connection | Critical | Record backup demo video, test offline mode |
| Microphone doesn't work on demo device | High | Test 2 days before, have backup phone |
| WhatsApp doesn't deliver in time | High | Pre-stage message, trigger manually if needed |
| AI response is bland/generic | Medium | Pre-test 20+ scenarios, cherry-pick best 3 |
| Judges don't understand value prop | High | Lead with relatable problem, show clear before/after |

### Mitigation Checklist
- [ ] Test full demo flow 24 hours before presentation
- [ ] Record backup video of each key feature
- [ ] Have 3 pre-loaded demo scenarios ready
- [ ] Test WhatsApp delivery to 3 different phones
- [ ] Prepare offline mode or local API fallback
- [ ] Have printed slides as backup if screen share fails

---

## Success Metrics

### Demo Day Success
- [ ] Live voice recording works without technical issues
- [ ] AI response plays clearly and is contextually appropriate
- [ ] WhatsApp message delivers within 10 seconds
- [ ] Judges ask questions about the technology (engagement)
- [ ] At least one judge says "I would use this"

### Post-Demo Product Validation
- **User Engagement**:
  - 70%+ of users complete at least 3 sessions in first week
  - Average session length: 30-90 seconds
  - Daily active users return 4+ days per week

- **AI Quality**:
  - 80%+ of responses are contextually appropriate (human review)
  - Emotion detection accuracy: 70%+ (validated against human labelers)
  - Users rate AI coaching 4+ stars out of 5

- **WhatsApp Integration**:
  - 60%+ of users enable WhatsApp notifications
  - Message delivery success rate: 95%+
  - Open rate on WhatsApp messages: 80%+

### Business Validation (Future)
- 1,000 beta signups within 2 weeks of launch
- Conversion to paid tier: 10%+ (if freemium model)
- NPS score: 40+ (users would recommend to friends)

---

## Go-to-Market Considerations (Post-Demo)

### Target Audience
1. **Primary**: Professionals (25-40) dealing with work stress
2. **Secondary**: Students managing academic pressure
3. **Tertiary**: Athletes/performers needing mental coaching

### Positioning
"Your 24/7 AI coach that listens to how you feel, not just what you say"

### Distribution Channels
- Product Hunt launch
- Mental health and productivity communities (Reddit, Discord)
- Partnership with therapy platforms (BetterHelp, Talkspace)
- Corporate wellness programs

### Monetization (Future)
- **Free Tier**: 5 voice sessions/week, 1 daily reminder
- **Pro Tier ($9.99/month)**: Unlimited sessions, 5 daily reminders, priority WhatsApp
- **Team Tier ($49.99/month)**: 5 users, shared insights dashboard

---

## Appendix

### Glossary
- **Micro-coaching**: Brief (10-30 second) coaching responses focused on immediate action
- **Tone analysis**: Detection of emotional state from voice prosody (pitch, pace, energy)
- **Push response**: Motivational coaching to increase energy and action
- **Calm response**: Grounding coaching to reduce anxiety and overwhelm
- **Reframe response**: Perspective-shifting coaching to challenge limiting beliefs
- **Session**: One complete interaction (user recording + AI response)

### Reference Architecture Diagram
```
┌─────────────┐
│  Mobile App │
│ (React Native)│
└──────┬──────┘
       │
       │ HTTPS/REST
       │
┌──────▼──────────────────────────────────────┐
│           Backend API                        │
│         (Node.js + Express)                  │
│                                              │
│  ┌────────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Auth     │  │  Voice   │  │ WhatsApp│ │
│  │ Controller │  │Controller│  │Controller│ │
│  └────────────┘  └──────────┘  └─────────┘ │
└──────┬────────────┬──────────────┬──────────┘
       │            │              │
       │            │              │
┌──────▼──────┐ ┌───▼──────────┐  │  ┌──────────────┐
│ PostgreSQL  │ │ External APIs│  │  │ Background   │
│  Database   │ │              │  │  │   Jobs       │
└─────────────┘ │ - Hume AI    │  │  │   (Bull)     │
                │ - ElevenLabs │  │  └──────┬───────┘
                │ - OpenAI GPT │  │         │
                └──────────────┘  │  ┌──────▼───────┐
                                  └─►│   Twilio     │
                                     │  WhatsApp    │
                                     └──────────────┘
```

### Technology Decision Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Frontend Framework | React Native, Flutter, Swift/Kotlin | React Native + Expo | Cross-platform, fast iteration, web support |
| Backend Runtime | Node.js, Python, Go | Node.js | JavaScript full-stack, rich ecosystem |
| Database | PostgreSQL, MongoDB, Supabase | PostgreSQL | Relational data, strong consistency |
| Emotion Detection | Hume AI, Azure Emotion API, Custom ML | Hume AI | Best-in-class accuracy, voice-specific |
| TTS Engine | ElevenLabs, Play.ht, Azure | ElevenLabs | Most natural, emotional range |
| WhatsApp API | Twilio, Cloud API, Pipedream | Twilio | Easiest setup, good docs |
| Voice AI Platform | Vapi, AssemblyAI, Deepgram | Hume + GPT-4 | More control, better coaching quality |

---

## Next Steps

### Immediate Actions (Next 48 Hours)
1. [ ] Choose primary tech stack (confirm Hume AI vs. Vapi)
2. [ ] Set up development environment (Expo + Node.js)
3. [ ] Create Figma mockups of 3 core screens
4. [ ] Sign up for API keys:
   - [ ] Hume AI (or Vapi)
   - [ ] ElevenLabs
   - [ ] OpenAI GPT-4
   - [ ] Twilio WhatsApp
5. [ ] Initialize Git repository
6. [ ] Create project roadmap in Linear/Notion

### Week 1 Goals
- [ ] Working audio recording on mobile
- [ ] Backend API deployed and accessible
- [ ] Database schema implemented
- [ ] Auth flow complete
- [ ] One end-to-end test: record → mock analysis → mock response

### Week 2 Goals
- [ ] Real emotion detection integrated
- [ ] AI coaching responses working
- [ ] WhatsApp delivery functional
- [ ] History screen complete
- [ ] Demo script written and rehearsed

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Owner**: Product Team
**Status**: Draft - Ready for Development
