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
    // Navigate to workout detail screen
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? '#111827' : '#f9fafb' }
    ]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: isDark ? '#ffffff' : '#111827' }
          ]}>Today's Workouts</Text>
          <TouchableOpacity style={[
            styles.createButton,
            { backgroundColor: '#dc2626' }
          ]}>
            <Text style={styles.buttonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.workoutList}>
          {mockWorkouts.map((workout) => (
            <TouchableOpacity 
              key={workout.id} 
              style={styles.workoutItem}
              onPress={() => handleWorkoutPress(workout)}
              activeOpacity={0.7}
            >
              <WorkoutCard {...workout} isDark={isDark} />
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
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  workoutList: {
    gap: 16,
  },
  workoutItem: {
    marginBottom: 16,
  },
});

export default WorkoutFeed; 