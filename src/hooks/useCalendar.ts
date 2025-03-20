import { useState, useEffect, useRef } from 'react';
import * as Calendar from 'expo-calendar';
import { calendarService } from '../services/calendarService';

interface UseCalendarReturn {
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  formattedWorkouts: any[];
  refreshWorkouts: () => Promise<any[]>;
  currentEndDate: Date;
  deletedWorkoutIds: Set<string>;
  addDeletedWorkout: (id: string) => void;
}

export const useCalendar = (): UseCalendarReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [formattedWorkouts, setFormattedWorkouts] = useState<any[]>([]);
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 14)));
  const deletedWorkoutIds = useRef<Set<string>>(new Set());

  const addDeletedWorkout = (id: string) => {
    deletedWorkoutIds.current.add(id);
  };

  const checkPermissions = async () => {
    try {
      console.log('Checking calendar permissions...');
      const { status } = await Calendar.getCalendarPermissionsAsync();
      console.log('Current permission status:', status);
      
      if (status === 'granted') {
        setHasPermission(true);
        return true;
      }
      
      console.log('Requesting calendar permissions...');
      const { status: newStatus } = await Calendar.requestCalendarPermissionsAsync();
      console.log('New permission status:', newStatus);
      
      const granted = newStatus === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error checking calendar permissions:', error);
      return false;
    }
  };

  const refreshWorkouts = async (): Promise<any[]> => {
    try {
      setLoading(true);
      setError(null);

      // Check permissions first
      const granted = await checkPermissions();
      if (!granted) {
        setError('Calendar permissions not granted');
        return [];
      }

      const startDate = new Date();
      let endDate;
      
      // Always try to load up to 14 days
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      setCurrentEndDate(endDate);

      const events = await calendarService.getCalendarEvents(startDate, endDate);
      
      // Ensure events is an array before mapping
      if (!Array.isArray(events)) {
        console.error('Events is not an array:', events);
        return [];
      }
      
      // Format the events
      const formatted = events.map(calendarService.formatWorkoutForCard);
      
      // Deduplicate workouts based on title, date, and time
      const uniqueWorkouts = [];
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
    loading,
    error,
    hasPermission,
    formattedWorkouts,
    refreshWorkouts,
    currentEndDate,
    deletedWorkoutIds: deletedWorkoutIds.current,
    addDeletedWorkout
  };
};
