import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import WorkoutCard from '../../../src/components/WorkoutCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockWorkouts } from '../../../app/App';
import { Workout } from '../../../src/types/workout';
import { useCalendar } from '../../../src/hooks/useCalendar';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { formattedWorkouts } = useCalendar();
  
  useEffect(() => {
    // Find workout from either mock data or calendar data
    const findWorkout = () => {
      // First check if it's a regular workout
      const mockWorkout = mockWorkouts.find(w => w.id === id);
      if (mockWorkout) {
        setWorkout(mockWorkout);
        setLoading(false);
        return;
      }
      
      // Then check if it's a calendar workout
      const calendarWorkout = formattedWorkouts.find(w => w.id === id);
      if (calendarWorkout) {
        setWorkout(calendarWorkout);
        setLoading(false);
        return;
      }
      
      // If not found in either source
      setLoading(false);
    };
    
    findWorkout();
  }, [id, formattedWorkouts]);

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
        expanded={true}
        onBack={() => router.back()}
        isDark={isDark}
      />
    </View>
  );
} 