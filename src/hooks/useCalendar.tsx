import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { calendarService } from '../services/calendarService';
import { CalendarWorkout, Workout } from '../types/workout';

interface UseCalendarReturn {
  calendarWorkouts: CalendarWorkout[];
  formattedWorkouts: Workout[];
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  refreshWorkouts: () => Promise<Workout[]>;
  currentEndDate?: Date;
  deletedWorkoutIds: Set<string>;
  addDeletedWorkout: (id: string) => void;
}

export const useCalendar = (): UseCalendarReturn => {
  const [calendarWorkouts, setCalendarWorkouts] = useState<CalendarWorkout[]>([]);
  const [formattedWorkouts, setFormattedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 14)));
  const deletedWorkoutIds = useRef<Set<string>>(new Set());

  const addDeletedWorkout = (id: string) => {
    deletedWorkoutIds.current.add(id);
  };

  const checkPermissions = async () => {
    try {
      console.log('Checking calendar permissions...');
      const permission = await calendarService.requestCalendarPermissions();
      setHasPermission(permission);
      return permission;
    } catch (error) {
      console.error('Error checking calendar permissions:', error);
      return false;
    }
  };

  const refreshWorkouts = async (): Promise<Workout[]> => {
    try {
      setLoading(true);
      setError(null);
  
      // Check permissions first
      const permission = await calendarService.requestCalendarPermissions();
      setHasPermission(permission);
      
      if (!permission) {
        Alert.alert('Permission Error', 'Calendar permissions not granted');
        setError('Calendar permissions not granted');
        return [];
      }
  
      // Start from yesterday to ensure at least one extra day is loaded
      const now = new Date();
      now.setDate(now.getDate() - 1); // Start from yesterday
      const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
      setCurrentEndDate(twoWeeksFromNow);
      
      const events = await calendarService.getCalendarEvents(now, twoWeeksFromNow);      console.log(`Found ${events.length} calendar events`);
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
      
      // Deduplicate workouts based on title, date, and time
      const uniqueWorkouts: Workout[] = [];
      const workoutKeys = new Set();
      
      for (const workout of formatted) {
        // Create a unique key based on title, date, and time
        const workoutKey = `${workout.title.toLowerCase()}_${workout.date}_${workout.time}`;
        
        // Only add the workout if we haven't seen this key before and it's not deleted
        if (!workoutKeys.has(workoutKey) && !deletedWorkoutIds.current.has(workout.id)) {
          workoutKeys.add(workoutKey);
          uniqueWorkouts.push(workout);
        } else if (deletedWorkoutIds.current.has(workout.id)) {
          console.log(`Skipping deleted workout: ${workout.title} on ${workout.date} at ${workout.time}`);
        } else {
          console.log(`Skipping duplicate workout: ${workout.title} on ${workout.date} at ${workout.time}`);
        }
      }
      
      setFormattedWorkouts(uniqueWorkouts);
      
      // Log the formatted workouts for debugging
      console.log('Returning formatted workouts:', uniqueWorkouts);
      return uniqueWorkouts;
    } catch (err) {
      Alert.alert('Calendar Error', err instanceof Error ? err.message : 'Failed to fetch workouts');
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    calendarWorkouts,
    formattedWorkouts,
    loading,
    error,
    hasPermission,
    refreshWorkouts,
    currentEndDate,
    deletedWorkoutIds: deletedWorkoutIds.current,
    addDeletedWorkout
  };
};