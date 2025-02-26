// src/screens/WorkoutDetail.tsx
import React from 'react';
import { View } from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import { useNavigation, useRoute } from '@react-navigation/native';

const WorkoutDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params as { workout: any };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <WorkoutCard 
        {...workout}
        expanded={true}
        onBack={() => navigation.goBack()}
      />
    </View>
  );
};

export default WorkoutDetail;