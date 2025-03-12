import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export interface CalendarWorkout {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  source?: string;
  participants?: { id: string; name: string; avatar: string }[];
}

// Keywords to identify workout events
const WORKOUT_KEYWORDS = [
  'workout', 'gym', 'fitness', 'exercise', 'training',
  'class', 'yoga', 'pilates', 'spin', 'cycling', 'run',
  'cardio', 'strength', 'hiit', 'crossfit', 'barre',
  'zumba', 'dance', 'bootcamp', 'boxing', 'swim'
];

// Platform identifiers
const PLATFORM_IDENTIFIERS = [
  { name: 'ClassPass', keywords: ['classpass', 'class pass'] },
  { name: 'Strava', keywords: ['strava'] },
  { name: 'MindBody', keywords: ['mindbody', 'mind body'] },
  { name: 'Peloton', keywords: ['peloton'] },
  { name: 'Nike Training Club', keywords: ['nike', 'ntc'] },
  { name: 'Equinox+', keywords: ['equinox'] },
  { name: 'Barry\'s', keywords: ['barry', 'barrys'] },
  { name: 'SoulCycle', keywords: ['soul', 'soulcycle'] },
];

export const calendarService = {
  // Request calendar permissions
  requestCalendarPermissions: async () => {
    try {
      // For testing, you can return true to bypass permission checks
      // return true;
      
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        return true;
      } else {
        Alert.alert(
          'Calendar Permission Required',
          'Please grant calendar permission to access your workout events',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  },

  // Get calendar events
  getCalendarEvents: async (startDate: Date, endDate: Date): Promise<CalendarWorkout[]> => {
    try {
      // For testing, you can return mock data
      if (__DEV__) {
        return [
          {
            id: 'mock-1',
            title: 'Morning Yoga',
            startDate: new Date(new Date().setHours(8, 0, 0, 0)),
            endDate: new Date(new Date().setHours(9, 0, 0, 0)),
            location: 'Yoga Studio',
            source: 'ClassPass'
          },
          {
            id: 'mock-2',
            title: 'Evening Run',
            startDate: new Date(new Date().setHours(18, 30, 0, 0)),
            endDate: new Date(new Date().setHours(19, 30, 0, 0)),
            location: 'Central Park',
            source: 'Strava'
          },
          {
            id: 'mock-3',
            title: 'HIIT Workout',
            startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            location: 'Fitness First',
            source: 'MindBody'
          }
        ];
      }
      
      // Get all calendars
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      // Get events from all calendars
      const events = await Calendar.getEventsAsync(
        calendars.map(calendar => calendar.id),
        startDate,
        endDate
      );
      
      // Filter events that look like workouts
      return events
        .filter(event => {
          const eventText = `${event.title} ${event.notes || ''} ${event.location || ''}`.toLowerCase();
          return WORKOUT_KEYWORDS.some(keyword => eventText.includes(keyword.toLowerCase()));
        })
        .map(event => {
          const eventText = `${event.title} ${event.notes || ''} ${event.location || ''}`.toLowerCase();
          
          // Determine the source platform
          let source = undefined;
          for (const platform of PLATFORM_IDENTIFIERS) {
            if (platform.keywords.some(keyword => eventText.includes(keyword))) {
              source = platform.name;
              break;
            }
          }
          
          // Extract location from event
          let location = event.location || 'No location';
          
          // For ClassPass events, try to extract the studio name from the title
          if (source === 'ClassPass' && event.title) {
            const titleParts = event.title.split(' at ');
            if (titleParts.length > 1) {
              location = titleParts[1].split(' - ')[0].trim();
            }
          }
          
          return {
            id: event.id,
            title: event.title,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            location,
            source
          };
        });
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  },

  formatWorkoutForCard: (workout: CalendarWorkout) => {
    const timeString = workout.startDate.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const participants = workout.participants || [
      { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=1' }
    ];

    const platforms = workout.source 
      ? [workout.source] 
      : ['Calendar'];

    return {
      id: workout.id,
      title: workout.title,
      time: timeString,
      location: workout.location,
      participants,
      platforms
    };
  }
};