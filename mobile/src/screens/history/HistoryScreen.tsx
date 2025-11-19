import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

// Mock session history data
const MOCK_SESSIONS = [
  {
    id: '1',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    emotion: 'Stressed',
    emoji: '😰',
    color: '#FF6B6B',
    coachingType: 'CALM',
    summary: 'Feeling overwhelmed with project deadlines',
    duration: '2:45',
  },
  {
    id: '2',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    emotion: 'Motivated',
    emoji: '💪',
    color: colors.primary,
    coachingType: 'REINFORCE',
    summary: 'Excited about new goals and progress made',
    duration: '3:12',
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    emotion: 'Defeated',
    emoji: '😔',
    color: '#FFA500',
    coachingType: 'PUSH',
    summary: 'Struggling with motivation and self-doubt',
    duration: '4:20',
  },
  {
    id: '4',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    emotion: 'Anxious',
    emoji: '😟',
    color: '#FF6B6B',
    coachingType: 'CALM',
    summary: 'Worried about upcoming presentation',
    duration: '2:30',
  },
  {
    id: '5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    emotion: 'Confident',
    emoji: '😎',
    color: colors.primary,
    coachingType: 'REINFORCE',
    summary: 'Feeling good about recent achievements',
    duration: '1:55',
  },
];

export default function HistoryScreen() {
  const { user } = useAuth();

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const renderSessionCard = ({ item }: { item: typeof MOCK_SESSIONS[0] }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={[styles.emotionBadge, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.emotionEmoji}>{item.emoji}</Text>
          <Text style={[styles.emotionText, { color: item.color }]}>
            {item.emotion}
          </Text>
        </View>
        <View style={styles.sessionMeta}>
          <Text style={styles.timeText}>{formatTime(item.date)}</Text>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      <Text style={styles.summaryText} numberOfLines={2}>
        {item.summary}
      </Text>

      <View style={styles.sessionFooter}>
        <View style={styles.coachingBadge}>
          <Text style={styles.coachingLabel}>Coaching:</Text>
          <Text style={styles.coachingType}>{item.coachingType}</Text>
        </View>
        <Text style={styles.whatsappSent}>📱 WhatsApp sent</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.fullName}!</Text>
          <Text style={styles.subtitle}>Your Coaching Sessions</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statNumber}>{MOCK_SESSIONS.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_SESSIONS}
        renderItem={renderSessionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  emotionEmoji: {
    fontSize: 20,
  },
  emotionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  durationText: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachingBadge: {
    flexDirection: 'row',
    gap: 4,
  },
  coachingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  coachingType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  whatsappSent: {
    fontSize: 11,
    color: colors.success,
  },
});
