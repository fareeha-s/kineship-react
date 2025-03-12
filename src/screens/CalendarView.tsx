// src/screens/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useCalendar } from '../hooks/useCalendar';
import WorkoutCard from '../components/WorkoutCard';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const CalendarView = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const router = useRouter();
  
  const { 
    formattedWorkouts, 
    loading, 
    error, 
    hasPermission, 
    refreshWorkouts 
  } = useCalendar();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '673203126149-537pq9iembg9eo3chu0ovd2snka95u55.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  });

  useEffect(() => {
    checkExistingToken();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication?.accessToken || null);
      AsyncStorage.setItem('googleAccessToken', response.authentication?.accessToken || '');
    }
  }, [response]);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const checkExistingToken = async () => {
    const token = await AsyncStorage.getItem('googleAccessToken');
    if (token) {
      setAccessToken(token);
    }
  };

  const handleSignIn = async () => {
    promptAsync();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshWorkouts();
    setRefreshing(false);
  };
  
  const handlePullCalendar = async () => {
    try {
      await refreshWorkouts();
      setCalendarInitialized(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to pull calendar workouts');
    }
  };

  const handleWorkoutPress = (workout: any) => {
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  // Group workouts by date
  const groupedWorkouts = formattedWorkouts.reduce((groups: any, workout: any) => {
    // Create a date object from the workout date
    const dateObj = new Date(workout.date);
    const dateString = dateObj.toDateString();
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(workout);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedWorkouts).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Workouts Calendar</Text>
        
        {!calendarInitialized ? (
          <View style={styles.signInContainer}>
            <Text style={styles.signInHeader}>Connect your calendar</Text>
            <Text style={styles.signInSubtext}>
              Import your workouts from your device calendar
            </Text>
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={handlePullCalendar}
              disabled={loading}
            >
              <Icon name="calendar" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.signInText}>Pull Calendar Workouts</Text>
              {loading && <ActivityIndicator size="small" color="white" style={styles.smallLoader} />}
            </TouchableOpacity>
            
            {accessToken ? null : (
              <TouchableOpacity 
                style={styles.googleButton} 
                onPress={handleSignIn}
              >
                <Icon name="calendar" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.signInText}>Connect Google Calendar</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handlePullCalendar}
              disabled={loading}
            >
              <Icon 
                name="refresh-cw" 
                size={16} 
                color={loading ? "#a1a1aa" : "#6b7280"} 
                style={styles.refreshIcon} 
              />
              <Text style={styles.refreshText}>
                Refresh Calendar Workouts
              </Text>
              {loading && !refreshing && <ActivityIndicator size="small" color="#6b7280" style={styles.smallLoader} />}
            </TouchableOpacity>
            
            {loading && !refreshing ? (
              <ActivityIndicator size="large" color="#dc2626" style={styles.loader} />
            ) : formattedWorkouts.length > 0 ? (
              sortedDates.map(dateString => (
                <View key={dateString} style={styles.dateGroup}>
                  <Text style={styles.dateHeader}>
                    {new Date(dateString).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                  {groupedWorkouts[dateString].map((workout: any) => (
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
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="calendar" size={40} color="#6b7280" />
                <Text style={styles.placeholder}>No workout events found</Text>
                <Text style={styles.subPlaceholder}>
                  Add workouts to your calendar to see them here
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  signInHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  signInSubtext: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallLoader: {
    marginLeft: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  refreshIcon: {
    marginRight: 6,
  },
  refreshText: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginLeft: 4,
  },
  workoutItem: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 24,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  subPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CalendarView;