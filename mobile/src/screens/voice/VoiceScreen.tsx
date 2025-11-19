import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useVapi } from '../../hooks/useVapi';
import { BeatingHeart } from '../../components/BeatingHeart';

export default function VoiceScreen() {
  const { user } = useAuth();
  const { status, error, startCall, stopCall, isCallActive, isConnecting } = useVapi();
  const [recordingTime, setRecordingTime] = useState(0);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCallActive) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Pulse animation for mic button when connecting
  useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnecting, pulseAnim]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Voice Error', error);
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
      Alert.alert(
        'Session Complete! 🎉',
        'Your coaching session has ended.\n\n📱 Check WhatsApp for a summary (demo mode)',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Failed to end voice call:', err);
    }
  };

  const handleSkipToText = () => {
    Alert.alert(
      'Skip to Text',
      'This feature allows you to type your thoughts instead of speaking. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleHistory = () => {
    Alert.alert(
      'History',
      'View your previous emotion check-ins and coaching sessions. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emotion Check-In</Text>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>I'm here for you</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Main Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>
            Tell me what's on{'\n'}your mind...
          </Text>
          <Text style={styles.privacyText}>
            Your thoughts remain private and used{'\n'}only in the moment:
          </Text>
        </View>

        {/* Heart Circle with Timer */}
        <View style={styles.heartContainer}>
          <View style={styles.heartCircle}>
            <BeatingHeart isBeating={isCallActive} size={100} />
            {isCallActive && (
              <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
            )}
            {!isCallActive && (
              <Text style={styles.timerText}>00:00</Text>
            )}
          </View>
        </View>

        {/* Best Results Text */}
        <Text style={styles.bestResultsText}>
          Best results between 20-60 second
        </Text>

        {/* Microphone Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isCallActive && styles.micButtonActive,
            ]}
            onPress={isCallActive ? endVoiceCall : startVoiceCall}
            disabled={isConnecting}
          >
            <Text style={styles.micIcon}>
              {isCallActive ? '⏹' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleHistory}
          >
            <Text style={styles.actionIcon}>🕒</Text>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSkipToText}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Skip to text</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  heartCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bestResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  micIcon: {
    fontSize: 36,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
