// src/screens/WorkoutFeed.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
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

  const handleWorkoutPress = (workout: Workout) => {
    // Navigate to workout detail screen
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Workouts</Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.buttonText}>Create Workout</Text>
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
              <WorkoutCard {...workout} />
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
    backgroundColor: '#f9fafb',
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
    color: '#111827',
  },
  createButton: {
    backgroundColor: '#dc2626',
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