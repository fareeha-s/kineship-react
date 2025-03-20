import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { CalendarWorkout, Workout } from '../types/workout';
import { Alert } from 'react-native';

export const useCalendar = () => {
  const [calendarWorkouts, setCalendarWorkouts] = useState<CalendarWorkout[]>([]);
  const [formattedWorkouts, setFormattedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const permission = await calendarService.requestCalendarPermissions();
      setHasPermission(permission);
      
      if (!permission) {
        Alert.alert('Permission Error', 'Calendar permissions not granted');
        throw new Error('Calendar permissions not granted');
      }

      // Start from yesterday to ensure at least one extra day is loaded
      const now = new Date();
      now.setDate(now.getDate() - 1); // Start from yesterday
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      const events = await calendarService.getCalendarEvents(now, thirtyDaysFromNow);
      console.log(`Found ${events.length} calendar events`);
      setCalendarWorkouts(events);
      
      // Format workouts for WorkoutCard component
      const formatted = events.map(workout => {
        const formattedWorkout = calendarService.formatWorkoutForCard(workout);
        console.log('Formatted calendar workout:', {
          id: formattedWorkout.id,
          title: formattedWorkout.title,
          date: formattedWorkout.date,
          hasRawDate: !!formattedWorkout.rawDate
        });
        return formattedWorkout;
      });
      setFormattedWorkouts(formatted);
    } catch (err) {
      Alert.alert('Calendar Error', err instanceof Error ? err.message : 'Failed to fetch workouts');
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  // Remove the automatic fetchWorkouts call
  // This allows users to explicitly trigger calendar access when they want to
  useEffect(() => {
    // Empty dependency array to run only once
  }, []);

  return { 
    calendarWorkouts, 
    formattedWorkouts,
    loading, 
    error, 
    hasPermission,
    refreshWorkouts: fetchWorkouts 
  };
};