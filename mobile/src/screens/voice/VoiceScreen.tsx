import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useVapi } from '../../hooks/useVapi';

export default function VoiceScreen() {
  const { user } = useAuth();
  const { status, error, startCall, stopCall, isCallActive, isConnecting, detectedEmotion } = useVapi();
  const [showWhatsAppUI, setShowWhatsAppUI] = useState(false);

  // Handle call end - show WhatsApp UI
  useEffect(() => {
    if (status === 'disconnected' && detectedEmotion) {
      setShowWhatsAppUI(true);
      // Auto-hide after showing
      setTimeout(() => {
        Alert.alert(
          'Session Complete! 🎉',
          `Detected emotion: ${detectedEmotion.emoji} ${detectedEmotion.name}\n` +
          `Coaching type: ${detectedEmotion.coaching}\n\n` +
          `📱 WhatsApp summary sent (demo mode)`,
          [
            {
              text: 'OK',
              onPress: () => {
                setShowWhatsAppUI(false);
              }
            }
          ]
        );
      }, 1000);
    }
  }, [status, detectedEmotion]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const startVoiceCall = async () => {
    try {
      await startCall();
    } catch (err) {
      console.error('Failed to start voice call:', err);
    }
  };

  const endVoiceCall = () => {
    try {
      stopCall();
    } catch (err) {
      console.error('Failed to end voice call:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Coach</Text>
        <Text style={styles.subtitle}>
          Your AI coach that listens to how you feel
        </Text>
      </View>

      <View style={styles.content}>
        {!isCallActive ? (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How it works:</Text>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Tap the button to start your voice coaching session
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                Share how you're feeling - your stress, challenges, or victories
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                AI analyzes your emotional tone and energy level
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>
                Get personalized coaching (PUSH, CALM, or REFRAME)
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.activeCallContainer}>
            {detectedEmotion && (
              <View style={[styles.emotionBadge, { backgroundColor: detectedEmotion.color + '20' }]}>
                <Text style={styles.emotionEmoji}>{detectedEmotion.emoji}</Text>
                <Text style={[styles.emotionText, { color: detectedEmotion.color }]}>
                  {detectedEmotion.name}
                </Text>
                <Text style={styles.coachingType}>
                  Coaching: {detectedEmotion.coaching}
                </Text>
              </View>
            )}
            <View style={styles.waveformContainer}>
              <View style={styles.waveformBar} />
              <View style={[styles.waveformBar, styles.waveformBarTall]} />
              <View style={styles.waveformBar} />
              <View style={[styles.waveformBar, styles.waveformBarTall]} />
              <View style={styles.waveformBar} />
            </View>
            <Text style={styles.callStatus}>
              {detectedEmotion ? 'AI Coach Responding...' : 'Listening to your tone...'}
            </Text>
            <Text style={styles.callHint}>
              Speak naturally about how you're feeling
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.mainButton,
            isCallActive && styles.mainButtonActive,
            isConnecting && styles.mainButtonDisabled,
          ]}
          onPress={isCallActive ? endVoiceCall : startVoiceCall}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator color={colors.white} size="large" />
          ) : (
            <>
              <View
                style={[
                  styles.micIcon,
                  isCallActive && styles.micIconActive,
                ]}
              >
                <Text style={styles.micEmoji}>
                  {isCallActive ? '⏹' : '🎤'}
                </Text>
              </View>
              <Text style={styles.mainButtonText}>
                {isCallActive ? 'End Session' : 'Start Coaching'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  instructionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: colors.primaryLight,
    color: colors.white,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingTop: 6,
  },
  activeCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  emotionBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
    minWidth: 200,
  },
  emotionEmoji: {
    fontSize: 48,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  coachingType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 80,
  },
  waveformBar: {
    width: 8,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  waveformBarTall: {
    height: 60,
  },
  callStatus: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  callHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mainButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonActive: {
    backgroundColor: colors.error,
  },
  mainButtonDisabled: {
    opacity: 0.6,
  },
  micIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIconActive: {
    backgroundColor: colors.white + '40',
  },
  micEmoji: {
    fontSize: 32,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
