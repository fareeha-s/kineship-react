// src/components/Navigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import WorkoutFeed from '../screens/WorkoutFeed';
import WorkoutDetail from '../screens/WorkoutDetail';
import CalendarView from '../screens/CalendarView';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutFeed" component={WorkoutFeed} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Icon name="home" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarView}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Icon name="calendar" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Icon name="user" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'white',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    padding: 8,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#fee2e2',
  },
});

export default Navigation;