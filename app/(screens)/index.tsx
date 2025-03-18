import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import WorkoutCard from '../../src/components/WorkoutCard';
import { mockWorkouts } from '../App';
import { useRouter } from 'expo-router';
import { useCalendar } from '../../src/hooks/useCalendar';
import { Feather } from '@expo/vector-icons';

import { Workout } from '../../src/types/workout';

/**
 * WorkoutFeed component displays a list of workouts from both mock data and calendar events.
 * It allows users to pull workouts from their calendar and toggle their visibility.
 */
const WorkoutFeed = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { formattedWorkouts, loading: calendarLoading, error, hasPermission, refreshWorkouts } = useCalendar();
  const [showCalendarWorkouts, setShowCalendarWorkouts] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCalendarWorkouts, setLocalCalendarWorkouts] = useState<Workout[]>([]);

  // Combine mock workouts with calendar workouts if enabled
  const allWorkouts = showCalendarWorkouts && calendarInitialized
    ? [...mockWorkouts, ...localCalendarWorkouts]
    : mockWorkouts;

  /**
   * Handle press events on workout cards
   * For both calendar events and mock workouts: navigate to the workout details screen
   */
  const handleWorkoutPress = (workout: Workout) => {
    // Navigate to workout detail screen for all workouts
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  /**
   * Format the current date for display
   * @returns {string} Formatted date string (e.g., 'Mon Mar 17')
   */
  const formatDate = () => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`;
  };

  /**
   * Fetch workouts from the calendar and update the local state
   * This will request calendar permissions if not already granted
   */
  const handlePullCalendar = async () => {
    try {
      setLoading(true);
      // Clear existing calendar workouts
      setLocalCalendarWorkouts([]);
      
      await refreshWorkouts();
      
      // Update with new workouts
      setLocalCalendarWorkouts(formattedWorkouts);
      setCalendarInitialized(true);
      setShowCalendarWorkouts(true);
      
      // Show success message
      Alert.alert('Success', 'Calendar workouts refreshed');
    } catch (err) {
      console.error('Error pulling calendar workouts:', err);
      Alert.alert('Error', 'Failed to pull calendar workouts');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? '#000000' : '#f9fafb' }
    ]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Today's Section */}
        <View style={styles.dateSection}>
          <Text style={[styles.dateLabel, { color: isDark ? '#666666' : '#6b7280' }]}>Today</Text>
          <Text style={[styles.date, { color: isDark ? '#ffffff' : '#111827' }]}>{formatDate()}</Text>
        </View>

        {/* Calendar Button */}
        <TouchableOpacity 
          style={[styles.calendarButton, loading && styles.calendarButtonDisabled]}
          onPress={handlePullCalendar}
          disabled={loading}
        >
          <Text style={styles.calendarButtonText}>
            {calendarInitialized ? 'Refresh Calendar Workouts' : 'Pull Workouts from Calendar'}
          </Text>
          {loading && <ActivityIndicator size="small" color="white" style={styles.smallLoader} />}
        </TouchableOpacity>


        {/* Toggle Calendar Workouts (if initialized) */}
        {calendarInitialized && hasPermission && (
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              showCalendarWorkouts && styles.toggleButtonActive
            ]}
            onPress={() => setShowCalendarWorkouts(!showCalendarWorkouts)}
          >
            <Text 
              style={[
                styles.toggleText,
                showCalendarWorkouts && styles.toggleTextActive
              ]}
            >
              {showCalendarWorkouts ? 'Hide Calendar Workouts' : 'Show Calendar Workouts'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Workouts List */}
        <View style={styles.workoutList}>
          {allWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              onPress={() => handleWorkoutPress(workout)}
              style={styles.workoutItem}
            >
              <WorkoutCard
                {...workout}
                isDark={isDark}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 85,
    paddingHorizontal: 16,
  },
  dateSection: {
    paddingBottom: 16,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  calendarButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  calendarButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  toggleButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    backgroundColor: '#4b5563',
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  smallLoader: {
    marginLeft: 8,
  },
  calendarButtonDisabled: {
    opacity: 0.7,
  },
  workoutList: {
    paddingTop: 8,
    gap: 1,
  },
  workoutItem: {
    marginBottom: 16,
  },
});

export default WorkoutFeed;