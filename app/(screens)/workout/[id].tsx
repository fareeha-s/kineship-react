import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WorkoutCard from '../../../src/components/WorkoutCard';
import { mockWorkouts } from '../../../app/App';
import { Workout } from '../../../src/types/workout';
import { useCalendar } from '../../../src/hooks/useCalendar';

const WorkoutDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { formattedWorkouts, refreshWorkouts } = useCalendar();
  
  useEffect(() => {
    const findWorkout = async () => {
      setLoading(true);
      
      // First check if it's a regular workout
      const mockWorkout = mockWorkouts.find((w: any) => w.id === id);
      if (mockWorkout) {
        console.log('Found mock workout:', mockWorkout.title);
        setWorkout(mockWorkout);
        setLoading(false);
        return;
      }
      
      // Then check if it's a calendar workout
      let calendarWorkout = formattedWorkouts.find((w: any) => w.id === id);
      
      // If no calendar workout found and we have no formatted workouts, try refreshing
      if (!calendarWorkout && formattedWorkouts.length === 0) {
        console.log('No calendar workouts found, refreshing...');
        const refreshedWorkouts = await refreshWorkouts();
        calendarWorkout = refreshedWorkouts.find((w: any) => w.id === id);
      }
      
      if (calendarWorkout) {
        console.log('Found calendar workout:', calendarWorkout.title);
        setWorkout(calendarWorkout);
        setLoading(false);
        return;
      }
      
      console.log(`Workout not found with id: ${id}`);
      console.log(`Available calendar workout IDs:`, formattedWorkouts.map((w: any) => w.id));
      
      // If not found in either source
      setLoading(false);
    };
    
    if (id) {
      findWorkout();
    }
  }, [id, formattedWorkouts, refreshWorkouts]);

  // Format date for display
  const formatWorkoutDate = (date: Date) => {
    const today = new Date();
    const workoutDate = new Date(date);
    
    // Check if the date is today
    if (workoutDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    // Check if the date is tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (workoutDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    
    // Otherwise, return the formatted date
    return workoutDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#000000' : '#f9fafb' }}>
        <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
      </View>
    );
  }
  
  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#000000' : '#f9fafb' }}>
        <Text style={{ color: isDark ? '#ffffff' : '#000000', fontSize: 16 }}>Workout not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f9fafb' }}>
      <WorkoutCard 
        {...workout}
        time={formatWorkoutDate(workout.rawDate || new Date())}
        expanded={true}
        onBack={() => router.back()}
        isDark={isDark}
      />
    </View>
  );
};
export default WorkoutDetailScreen;