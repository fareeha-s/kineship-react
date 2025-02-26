// kineship-react/app/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkoutFeed from '../src/screens/WorkoutFeed';
import WorkoutDetail from '../src/screens/WorkoutDetail';
import { RootStackParamList } from '../src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export const mockWorkouts = [
  {
    id: '1',
    title: "Barry's - LIFT x RUN",
    time: '2:00 PM',
    location: 'Castro / San Francisco',
    participants: [
      { id: '1', name: 'Gracie', avatar: 'https://ui-avatars.com/api/?name=Gracie' },
      { id: '2', name: 'Mat', avatar: 'https://ui-avatars.com/api/?name=Mat' },
      { id: '3', name: 'Rani', avatar: 'https://ui-avatars.com/api/?name=Rani' }
    ],
    platforms: ['ClassPass', 'MINDBODY', "Barry's"]
  },
  {
    id: '2',
    title: 'Marina Run Club',
    time: '8:00 AM',
    location: 'Marina / San Francisco',
    participants: [
      { id: '1', name: 'Gracie', avatar: 'https://ui-avatars.com/api/?name=Gracie' },
      { id: '4', name: 'El', avatar: 'https://ui-avatars.com/api/?name=El' },
      { id: '3', name: 'Rani', avatar: 'https://ui-avatars.com/api/?name=Rani' }
    ],
    platforms: ['Strava', 'ClassPass']
  }
];

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerShown: true,
              animation: 'slide_from_right'
            }}
          >
            <Stack.Screen 
              name="WorkoutFeed" 
              component={WorkoutFeed}
              options={{
                title: "Today's Workouts",
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="WorkoutDetail" 
              component={WorkoutDetail}
              options={{
                title: "Workout Details",
                headerShown: true
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}