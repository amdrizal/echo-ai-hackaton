import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useGoals } from '../../contexts/GoalContext';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { goals } = useGoals();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const activeGoals = goals.filter((g) => g.status === 'active').length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const voiceGoals = goals.filter((g) => g.createdFromVoice).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* User Info */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {user?.phoneNumber && (
            <Text style={styles.userPhone}>{user.phoneNumber}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Stats</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.length}</Text>
              <Text style={styles.statLabel}>Total Goals</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {activeGoals}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {completedGoals}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.info }]}>
                {voiceGoals}
              </Text>
              <Text style={styles.statLabel}>From Voice</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings')}
          >
            <Text style={styles.menuItemText}>Notifications</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'WhatsApp integration')}
          >
            <Text style={styles.menuItemText}>WhatsApp Integration</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Account settings')}
          >
            <Text style={styles.menuItemText}>Account Settings</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          Echo-AI v{process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0'}
        </Text>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary, // White text
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.backgroundSecondary, // Secondary teal
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Bright cyan
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.background, // Dark text on cyan
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary, // White text
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary, // Muted cyan-gray
    textAlign: 'center',
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textTertiary, // Darker muted
    textAlign: 'center',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: colors.backgroundSecondary, // Secondary teal
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary, // White text
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.backgroundTertiary, // Tertiary teal
    borderRadius: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary, // White text (color applied inline for success/primary)
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary, // Muted cyan-gray
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.textPrimary, // White text
  },
  menuItemArrow: {
    fontSize: 24,
    color: colors.textTertiary, // Darker muted
  },
  logoutButton: {
    backgroundColor: colors.error, // Red error color
    borderRadius: 28, // Pill shape
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: colors.white, // White text
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: colors.textTertiary, // Darker muted
    fontSize: 12,
    marginTop: 8,
  },
});
