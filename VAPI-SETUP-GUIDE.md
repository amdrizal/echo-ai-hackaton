# Vapi Assistant Setup Guide

## Current Issue
The Vapi call connects successfully, but you can't hear any sound from the assistant.

## Root Cause
The assistant with ID `86b1f3f9-0a8a-49d7-93e9-a11657bede91` needs to be properly configured in your Vapi dashboard.

## Solution: Configure Your Vapi Assistant

### Step 1: Log into Vapi Dashboard
1. Go to https://dashboard.vapi.ai
2. Log in with your Vapi account

### Step 2: Find Your Assistant
1. Click on **"Assistants"** in the left sidebar
2. Look for assistant ID: `86b1f3f9-0a8a-49d7-93e9-a11657bede91`
3. Or create a new assistant if this one doesn't exist

### Step 3: Configure the Assistant

#### Basic Settings
- **Name**: Echo-AI Coach
- **Model**: gpt-3.5-turbo or gpt-4
- **Voice Provider**: ElevenLabs, PlayHT, or Deepgram

#### System Prompt
Add this prompt to make the assistant act as an emotional coach:

```
You are Echo-AI, an empathetic AI coach that helps people with their emotional well-being and goal setting.

Your role:
1. Listen carefully to how the user is feeling
2. Detect their emotional state (stressed, anxious, motivated, calm, defeated, overwhelmed, confident)
3. Respond with appropriate coaching based on their emotion:
   - CALM coaching for stressed/anxious users (breathing exercises, perspective)
   - PUSH coaching for defeated users (motivation, encouragement)
   - REINFORCE coaching for motivated/confident users (validation, momentum)
4. Help them articulate their goals clearly
5. Ask follow-up questions to understand their challenges

Keep responses:
- Conversational and warm
- Under 30 seconds when spoken
- Focused on emotional support first, then practical advice
- Encouraging but realistic

Start by greeting the user and asking how they're feeling today.
```

#### First Message
```
Hey! I'm your AI coach. I'm here to listen and help. How are you feeling today?
```

#### Voice Settings
- **Voice Provider**: Choose ElevenLabs (best quality) or PlayHT
- **Voice**: Select a warm, friendly voice
  - ElevenLabs: "Rachel" or "Josh"
  - PlayHT: "Matthew" or "Joanna"
- **Speed**: 1.0 (normal)
- **Pitch**: 0 (neutral)

#### Advanced Settings
- **End Call After Silence**: 30 seconds
- **Background Sound**: None
- **Record Call**: Enabled (for testing)
- **Transcribe**: Enabled

### Step 4: Test the Assistant

After configuring, test directly in Vapi dashboard:
1. Click **"Test"** button on the assistant
2. You should hear the first message
3. Try speaking to verify two-way audio works

### Step 5: Update Your App (If You Created a New Assistant)

If you created a new assistant with a different ID:

1. Copy the new Assistant ID from Vapi dashboard
2. Update `mobile/.env`:
   ```env
   EXPO_PUBLIC_VAPI_ASSISTANT_ID=YOUR_NEW_ASSISTANT_ID
   ```
3. Restart the Expo dev server:
   ```bash
   npx expo start --clear
   ```

## Quick Fix: Use a Pre-configured Assistant

If you want to test immediately, you can use Vapi's demo assistant:

1. Create a new assistant in Vapi dashboard
2. Use the template: "Voice Assistant"
3. Copy the new assistant ID
4. Update `.env` with the new ID
5. Restart Expo

## Troubleshooting

### No Sound from Assistant

**Check:**
- ✅ Assistant has a voice provider configured (ElevenLabs/PlayHT)
- ✅ Assistant has a first message set
- ✅ Assistant has a system prompt
- ✅ Your browser has microphone permissions enabled
- ✅ Your browser audio is not muted
- ✅ The Vapi assistant is in "Active" status

**Test:**
```javascript
// Add this log in your browser console to see Vapi events
console.log('Vapi events:', vapi);
```

### Microphone Not Working

**Check browser permissions:**
1. Click the lock icon in address bar
2. Ensure "Microphone" is set to "Allow"
3. Refresh the page and try again

### Assistant Responds Too Slowly

**Optimize:**
- Use gpt-3.5-turbo instead of gpt-4
- Keep system prompt concise
- Use faster voice provider (Deepgram TTS)

### Call Disconnects Immediately

**Check:**
- Vapi API key is correct in `.env`
- Assistant ID is correct
- Assistant status is "Active" in dashboard
- You have credits in your Vapi account

## Testing Checklist

- [ ] Vapi account has credits
- [ ] Assistant exists in dashboard
- [ ] Voice provider is configured
- [ ] First message is set
- [ ] System prompt is configured
- [ ] Browser microphone permission granted
- [ ] Call connects (no errors in console)
- [ ] You can hear the assistant's first message
- [ ] Assistant can hear you speak
- [ ] Transcription appears in console

## Expected Flow

1. **Click "Start Coaching"**
   - Console: "Vapi call started successfully"
   - Browser: Microphone permission prompt

2. **Allow Microphone**
   - Assistant speaks: "Hey! I'm your AI coach..."
   - You hear the voice clearly

3. **You Speak**
   - Your words are transcribed
   - Console shows: `transcript: "I'm feeling stressed"`
   - Emotion detection runs
   - Emotion badge appears

4. **Assistant Responds**
   - Based on what you said
   - Provides appropriate coaching
   - Natural conversation continues

## Demo Script

Once configured, test with this script:

**You**: "I'm feeling really stressed about work"
**Expected**: Assistant detects "Stressed" emotion, provides CALM coaching

**You**: "I'm so motivated to finish this project"
**Expected**: Assistant detects "Motivated" emotion, provides REINFORCE coaching

**You**: "I feel defeated and want to give up"
**Expected**: Assistant detects "Defeated" emotion, provides PUSH coaching

## Getting Help

If you still can't hear the assistant:

1. **Check Vapi Dashboard Logs**:
   - Go to "Logs" in Vapi dashboard
   - See recent calls
   - Check for errors

2. **Check Browser Console**:
   - Look for Vapi event logs
   - Check for audio errors

3. **Test in Vapi Dashboard**:
   - Use the built-in test feature
   - Verify assistant speaks there first

4. **Verify API Keys**:
   ```bash
   # In mobile/.env
   EXPO_PUBLIC_VAPI_PUBLIC_KEY=your_public_key_here
   EXPO_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
   ```

---

**Most Common Issue**: Assistant not configured with voice provider in Vapi dashboard!
**Quick Fix**: Add ElevenLabs or PlayHT voice in assistant settings.
