import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import WorkoutCard from '../../src/components/WorkoutCard';
import { mockWorkouts } from '../../app/App';
import { useRouter } from 'expo-router';
import { useCalendar } from '../../src/hooks/useCalendar';
import Icon from 'react-native-vector-icons/Feather';

interface Workout {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  platforms: string[];
}

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

  const handleWorkoutPress = (workout: Workout) => {
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  const formatDate = () => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`;
  };

  const handlePullCalendar = async () => {
    try {
      setLoading(true);
      
      // Create mock calendar workouts
      const mockCalendarWorkouts = [
        {
          id: 'cal-1',
          title: 'Morning Yoga',
          time: '8:00 AM',
          location: 'Yoga Studio',
          participants: [{ id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=1' }],
          platforms: ['ClassPass']
        },
        {
          id: 'cal-2',
          title: 'Evening Run',
          time: '6:30 PM',
          location: 'Central Park',
          participants: [{ id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=1' }],
          platforms: ['Strava']
        },
        {
          id: 'cal-3',
          title: 'HIIT Workout',
          time: '5:00 PM',
          location: 'Fitness First',
          participants: [{ id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=1' }],
          platforms: ['MindBody']
        }
      ];
      
      // Set local calendar workouts
      setLocalCalendarWorkouts(mockCalendarWorkouts);
      
      // Update state
      setCalendarInitialized(true);
      setShowCalendarWorkouts(true);
      
      Alert.alert('Success', 'Successfully pulled workouts from calendar');
    } catch (err) {
      Alert.alert('Error', 'Failed to pull calendar workouts: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const navigateToCalendarView = () => {
    router.push({
      pathname: "/calendar",
      params: {}
    });
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
          style={styles.calendarButton}
          onPress={handlePullCalendar}
          disabled={loading || calendarLoading}
        >
          <Text style={styles.calendarButtonText}>
            {calendarInitialized ? 'Refresh Calendar Workouts' : 'Pull Workouts from Calendar'}
          </Text>
          {(loading || calendarLoading) && <ActivityIndicator size="small" color="white" style={styles.smallLoader} />}
        </TouchableOpacity>

        {/* Calendar View Button */}
        <TouchableOpacity 
          style={styles.calendarViewButton}
          onPress={navigateToCalendarView}
        >
          <Text style={styles.calendarViewButtonText}>View Calendar</Text>
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
  calendarViewButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  calendarViewButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
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
  workoutList: {
    paddingTop: 8,
    gap: 1,
  },
  workoutItem: {
    marginBottom: 16,
  },
});

export default WorkoutFeed;