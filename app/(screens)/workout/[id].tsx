import React from 'react';
import { View } from 'react-native';
import WorkoutCard from '../../../src/components/WorkoutCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockWorkouts } from '../../../app/App';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const workout = mockWorkouts.find(w => w.id === id);
  if (!workout) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <WorkoutCard 
        {...workout}
        expanded={true}
        onBack={() => router.back()}
      />
    </View>
  );
} 