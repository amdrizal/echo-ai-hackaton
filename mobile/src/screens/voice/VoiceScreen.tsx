import React, { useState } from 'react';
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
import { useGoals } from '../../contexts/GoalContext';

// Note: Vapi integration will be completed with actual SDK
// This is a placeholder structure for the hackathon

export default function VoiceScreen() {
  const { user } = useAuth();
  const { refreshGoals } = useGoals();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const startVoiceCall = async () => {
    try {
      setIsConnecting(true);

      // TODO: Initialize Vapi SDK
      // const vapi = new Vapi(process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY);
      // await vapi.start({
      //   assistantId: process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID,
      //   metadata: {
      //     userId: user?.id.toString(),
      //     userName: user?.fullName,
      //   },
      // });

      setIsCallActive(true);
      setIsConnecting(false);

      Alert.alert(
        'Voice Integration',
        'Vapi voice integration will be completed with your API keys. ' +
        'For now, this is a placeholder UI.'
      );
    } catch (error) {
      console.error('Failed to start voice call:', error);
      Alert.alert('Error', 'Failed to start voice call');
      setIsConnecting(false);
    }
  };

  const endVoiceCall = async () => {
    try {
      // TODO: Stop Vapi call
      // vapi.stop();

      setIsCallActive(false);

      // Refresh goals after call ends
      setTimeout(() => {
        refreshGoals();
      }, 2000);

      Alert.alert('Session Ended', 'Your goals have been updated!');
    } catch (error) {
      console.error('Failed to end voice call:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Coach</Text>
        <Text style={styles.subtitle}>
          Talk about your goals and dreams
        </Text>
      </View>

      <View style={styles.content}>
        {!isCallActive ? (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How it works:</Text>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Tap the button to start a voice conversation
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                Talk about your goals, dreams, and aspirations
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                Your goals will be automatically extracted and saved
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>
                Get a summary via WhatsApp when you're done
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.activeCallContainer}>
            <View style={styles.waveformContainer}>
              <View style={styles.waveformBar} />
              <View style={[styles.waveformBar, styles.waveformBarTall]} />
              <View style={styles.waveformBar} />
              <View style={[styles.waveformBar, styles.waveformBarTall]} />
              <View style={styles.waveformBar} />
            </View>
            <Text style={styles.callStatus}>Listening...</Text>
            <Text style={styles.callHint}>
              Speak naturally about your goals
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
