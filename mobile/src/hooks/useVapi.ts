import { useState, useEffect, useCallback } from 'react';
import vapiService from '../services/vapiService';

const VAPI_ASSISTANT_ID = process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID || '';

export type VapiCallStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'error';

// Emotion detection patterns based on keywords and phrases
const EMOTION_PATTERNS = {
  stressed: {
    keywords: ['stressed', 'stress', 'pressure', 'overwhelm', 'too much', 'exhausted', 'burnt out', 'tension'],
    name: 'Stressed',
    emoji: '😰',
    color: '#FF6B6B',
    coaching: 'CALM'
  },
  anxious: {
    keywords: ['anxious', 'anxiety', 'worried', 'nervous', 'fear', 'scared', 'uneasy', 'restless'],
    name: 'Anxious',
    emoji: '😟',
    color: '#FF6B6B',
    coaching: 'CALM'
  },
  defeated: {
    keywords: ['defeated', 'give up', 'hopeless', 'can\'t do', 'impossible', 'failure', 'failed', 'lose', 'lost'],
    name: 'Defeated',
    emoji: '😔',
    color: '#FFA500',
    coaching: 'PUSH'
  },
  overwhelmed: {
    keywords: ['overwhelmed', 'drowning', 'buried', 'swamped', 'too many', 'chaos', 'hectic'],
    name: 'Overwhelmed',
    emoji: '😓',
    color: '#FF6B6B',
    coaching: 'CALM'
  },
  motivated: {
    keywords: ['motivated', 'motivated', 'excited', 'ready', 'energized', 'determined', 'driven', 'passionate'],
    name: 'Motivated',
    emoji: '💪',
    color: '#6366F1',
    coaching: 'REINFORCE'
  },
  calm: {
    keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'balanced', 'centered'],
    name: 'Calm',
    emoji: '😌',
    color: '#10B981',
    coaching: 'REINFORCE'
  },
  confident: {
    keywords: ['confident', 'sure', 'certain', 'believe', 'capable', 'strong', 'powerful', 'ready'],
    name: 'Confident',
    emoji: '😎',
    color: '#6366F1',
    coaching: 'REINFORCE'
  }
};

interface DetectedEmotion {
  name: string;
  emoji: string;
  color: string;
  coaching: string;
}

export const useVapi = () => {
  const [status, setStatus] = useState<VapiCallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<DetectedEmotion | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>('');

  // Initialize Vapi on mount
  useEffect(() => {
    vapiService.initialize();

    // Set up event listeners
    vapiService.onCallStart(() => {
      console.log('🎤 Vapi: Call started');
      setStatus('connected');
      setError(null);
    });

    vapiService.onCallEnd(() => {
      console.log('🛑 Vapi: Call ended');
      setStatus('disconnected');
    });

    vapiService.onMessage((message: any) => {
      console.log('📨 Vapi message received:', JSON.stringify(message, null, 2));

      // Handle different message types
      if (message.type === 'transcript') {
        console.log(`💬 Transcript from ${message.role}:`, message.transcript);

        if (message.role === 'user') {
          // User's speech transcript
          const transcript = message.transcript || '';
          setUserTranscript(prev => prev + ' ' + transcript);

          // Analyze emotion from transcript
          const emotion = detectEmotion(transcript);
          if (emotion) {
            console.log('😊 Emotion detected:', emotion.name);
            setDetectedEmotion(emotion);
          }
        } else if (message.role === 'assistant') {
          console.log('🤖 Assistant said:', message.transcript);
        }
      } else if (message.type === 'speech-update') {
        console.log('🗣️ Speech update:', message.status);
      } else if (message.type === 'conversation-update') {
        console.log('💭 Conversation update:', message);
      } else {
        console.log('ℹ️ Other message type:', message.type);
      }
    });

    vapiService.onError((err: any) => {
      console.error('Vapi error:', err);
      setStatus('error');
      setError(err.message || 'An error occurred during the call');
    });

    // Cleanup on unmount
    return () => {
      vapiService.removeAllListeners();
    };
  }, []);

  // Emotion detection function
  const detectEmotion = (text: string): DetectedEmotion | null => {
    const lowerText = text.toLowerCase();

    // Check each emotion pattern
    for (const [key, pattern] of Object.entries(EMOTION_PATTERNS)) {
      for (const keyword of pattern.keywords) {
        if (lowerText.includes(keyword)) {
          return {
            name: pattern.name,
            emoji: pattern.emoji,
            color: pattern.color,
            coaching: pattern.coaching
          };
        }
      }
    }

    return null;
  };

  const startCall = useCallback(async () => {
    try {
      console.log('useVapi: Starting call...');
      console.log('useVapi: Assistant ID:', VAPI_ASSISTANT_ID);

      setStatus('connecting');
      setError(null);
      setDetectedEmotion(null);
      setUserTranscript('');

      if (!VAPI_ASSISTANT_ID) {
        throw new Error('Vapi Assistant ID not configured. Check EXPO_PUBLIC_VAPI_ASSISTANT_ID in .env');
      }

      console.log('useVapi: Calling vapiService.startCall...');
      await vapiService.startCall({
        assistantId: VAPI_ASSISTANT_ID,
        metadata: {
          timestamp: new Date().toISOString(),
        }
      });
      console.log('useVapi: Call started successfully');
    } catch (err: any) {
      console.error('useVapi: Failed to start call:', err);
      setStatus('error');
      setError(err.message || 'Failed to start voice call');
    }
  }, []);

  const stopCall = useCallback(() => {
    try {
      setStatus('disconnecting');
      vapiService.stopCall();
    } catch (err: any) {
      setError(err.message || 'Failed to stop call');
      console.error('Failed to stop call:', err);
    }
  }, []);

  return {
    status,
    error,
    detectedEmotion,
    startCall,
    stopCall,
    isCallActive: status === 'connected' || status === 'connecting',
    isConnecting: status === 'connecting',
  };
};
