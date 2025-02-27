// src/screens/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

WebBrowser.maybeCompleteAuthSession();

const CalendarView = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (accessToken) {
      fetchCalendarEvents();
    }
  }, [accessToken]);

  const checkExistingToken = async () => {
    const token = await AsyncStorage.getItem('googleAccessToken');
    if (token) {
      setAccessToken(token);
    }
  };

  const fetchCalendarEvents = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      const data = await response.json();
      const workoutEvents = data.items.filter((event: any) => {
        const title = event.summary?.toLowerCase() || '';
        return title.includes('workout') || 
               title.includes('gym') || 
               title.includes('class') ||
               title.includes('training');
      });
      
      setEvents(workoutEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    promptAsync();
  };

  const renderEvent = (event: any) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.summary}</Text>
        <Icon name="chevron-right" size={20} color="#6b7280" />
      </View>
      <Text style={styles.eventTime}>
        {new Date(event.start.dateTime).toLocaleString()}
      </Text>
      {event.location && (
        <View style={styles.locationContainer}>
          <Icon name="map-pin" size={14} color="#6b7280" style={styles.locationIcon} />
          <Text style={styles.eventLocation}>{event.location}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Workouts Calendar</Text>
        
        {!accessToken ? (
          <View style={styles.signInContainer}>
            <Text style={styles.signInHeader}>Connect your calendar</Text>
            <Text style={styles.signInSubtext}>
              Import your workouts from Google Calendar
            </Text>
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={handleSignIn}
            >
              <Icon name="calendar" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.signInText}>Connect Google Calendar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#dc2626" style={styles.loader} />
            ) : events.length > 0 ? (
              events.map(renderEvent)
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
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
  },
  subPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});

export default CalendarView;