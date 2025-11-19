import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useGoals } from '../../contexts/GoalContext';
import { useAuth } from '../../contexts/AuthContext';
import { Goal } from '../../types/goal';
import { colors } from '../../theme/colors';

export default function GoalListScreen() {
  const { goals, loading, fetchGoals, refreshGoals } = useGoals();
  const { user } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, []);

  const getCategoryColor = (category: string) => {
    return (colors as any)[category] || colors.primary;
  };

  const renderGoalCard = ({ item }: { item: Goal }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) + '20' },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryColor(item.category) },
            ]}
          >
            {item.category}
          </Text>
        </View>
        {item.createdFromVoice && (
          <Text style={styles.voiceIndicator}>🎤 Voice</Text>
        )}
      </View>

      <Text style={styles.goalTitle}>{item.title}</Text>

      {item.description && (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.goalFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? colors.successLight : colors.border },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'active' ? colors.success : colors.textSecondary },
            ]}
          >
            {item.status}
          </Text>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Goals Yet</Text>
      <Text style={styles.emptyText}>
        Start a voice coaching session to create your first goal!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.fullName}!</Text>
          <Text style={styles.subtitle}>Your Goals</Text>
        </View>
      </View>

      {loading && goals.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoalCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshGoals}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Dark teal background
  },
  header: {
    backgroundColor: colors.backgroundSecondary, // Secondary teal
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary, // White text
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary, // Muted cyan-gray
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  goalCard: {
    backgroundColor: colors.backgroundSecondary, // Secondary teal
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 217, 192, 0.15)', // Subtle cyan background
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    // Color set dynamically based on category
  },
  voiceIndicator: {
    fontSize: 12,
    color: colors.textSecondary, // Muted cyan-gray
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary, // White text
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary, // Muted cyan-gray
    lineHeight: 20,
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: colors.textTertiary, // Darker muted text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary, // White text
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary, // Muted cyan-gray
    textAlign: 'center',
    lineHeight: 20,
  },
});
