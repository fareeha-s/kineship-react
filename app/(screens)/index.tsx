import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import WorkoutCard from '../../src/components/WorkoutCard';
import { mockWorkouts } from '../../app/App';
import { useRouter } from 'expo-router';

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

        {/* Workouts List */}
        <View style={styles.workoutList}>
          {mockWorkouts.map((workout) => (
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
  },
  dateSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  workoutList: {
    paddingTop: 24,              // More space after the date header
    gap: 1,                      // Minimal gap since cards have internal padding
  },
  workoutItem: {
    marginBottom: 0,             // Remove bottom margin since we're using gap
  },
});

export default WorkoutFeed;