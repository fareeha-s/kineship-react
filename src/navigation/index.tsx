import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Screens
import Welcome from '../screens/Welcome';
import WorkoutFeed from '../screens/WorkoutFeed';
import CalendarView from '../screens/CalendarView';

const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#dc2626" />
    </View>
  );
}

export default function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Welcome" 
            component={Welcome} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Feed" 
              component={WorkoutFeed}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Calendar" 
              component={CalendarView}
              options={{ 
                title: 'Calendar',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}