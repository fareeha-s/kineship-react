import { useState, useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import { calendarService } from '../services/calendarService';

interface UseCalendarReturn {
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  formattedWorkouts: any[];
  refreshWorkouts: (extendRange?: boolean) => Promise<void>;
  currentEndDate: Date;
}

export const useCalendar = (): UseCalendarReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [formattedWorkouts, setFormattedWorkouts] = useState<any[]>([]);
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 14)));

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

  const refreshWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check permissions first
      const granted = await checkPermissions();
      if (!granted) {
        setError('Calendar permissions not granted');
        return;
      }

      const startDate = new Date();
      let endDate;
      
      // Always try to load up to 14 days
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      setCurrentEndDate(endDate);

      const events = await calendarService.getCalendarEvents(startDate, endDate);
      const formatted = events.map(calendarService.formatWorkoutForCard);
      setFormattedWorkouts(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
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
    currentEndDate
  };
};
