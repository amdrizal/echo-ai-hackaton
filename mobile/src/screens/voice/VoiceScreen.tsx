import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useVapi } from '../../hooks/useVapi';
import { BeatingHeart } from '../../components/BeatingHeart';

export default function VoiceScreen() {
  const { user } = useAuth();
  const { status, error, startCall, stopCall, isCallActive, isConnecting, detectedEmotion } = useVapi();
  const [recordingTime, setRecordingTime] = useState(0);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const emotionSlideAnim = React.useRef(new Animated.Value(0)).current;

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

  // Slide in animation when emotion is detected
  useEffect(() => {
    if (detectedEmotion) {
      Animated.spring(emotionSlideAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      emotionSlideAnim.setValue(0);
    }
  }, [detectedEmotion, emotionSlideAnim]);

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

      {/* Scrollable Content for Responsiveness */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emotion Detection Card at Top */}
        {detectedEmotion && (
          <Animated.View
            style={[
              styles.emotionCardTop,
              {
                opacity: emotionSlideAnim,
                transform: [
                  {
                    translateY: emotionSlideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.emotionEmojiLarge}>{detectedEmotion.emoji}</Text>
            <View style={styles.emotionInfoTop}>
              <Text style={[styles.emotionNameLarge, { color: detectedEmotion.color }]}>
                {detectedEmotion.name}
              </Text>
              <Text style={styles.coachingTypeTop}>
                AI Response: {detectedEmotion.coaching}
              </Text>
              <View style={[styles.coachingBadgeLarge, { backgroundColor: detectedEmotion.color + '20' }]}>
                <Text style={[styles.coachingBadgeTextLarge, { color: detectedEmotion.color }]}>
                  {detectedEmotion.coaching === 'CALM' && '🧘 Calming approach'}
                  {detectedEmotion.coaching === 'PUSH' && '💪 Motivational push'}
                  {detectedEmotion.coaching === 'REINFORCE' && '✨ Positive reinforcement'}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

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
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.actionsContainer}>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleHistory}
          >
            <Text style={styles.actionIcon}>🕒</Text>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          {/* Minimalist Microphone Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.micButtonMinimal,
                isCallActive && styles.micButtonMinimalActive,
              ]}
              onPress={isCallActive ? endVoiceCall : startVoiceCall}
              disabled={isConnecting}
            >
              <Text style={styles.micIconMinimal}>
                {isCallActive ? '⏹' : '🎤'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SCREEN_HEIGHT * 0.6, // Responsive height
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
    marginTop: 30,
    marginBottom: 20,
  },
  // Emotion Card at Top Styles
  emotionCardTop: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary + '40',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emotionEmojiLarge: {
    fontSize: 64,
  },
  emotionInfoTop: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  emotionNameLarge: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  coachingTypeTop: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  coachingBadgeLarge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  coachingBadgeTextLarge: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Actions Container - Fixed Bottom Bar
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 30, // Extra padding for devices with notch/home indicator
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  // Minimalist Mic Button
  micButtonMinimal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  micButtonMinimalActive: {
    backgroundColor: colors.error,
  },
  micIconMinimal: {
    fontSize: 28,
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
