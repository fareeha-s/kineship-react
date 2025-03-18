import * as Calendar from 'expo-calendar';
import { Alert } from 'react-native';
import { WORKOUT_KEYWORDS, PLATFORM_IDENTIFIERS } from '../constants/workouts';
import { CalendarWorkout, Workout } from '../types/workout';

/**
 * Service for handling calendar-related operations
 */

export const calendarService = {
  /**
   * Request calendar permissions from the user
   * @returns {Promise<boolean>} True if permissions are granted, false otherwise
   */
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

  /**
   * Fetch and filter workout events from the user's calendars
   * @param {Date} startDate - Start date to fetch events from
   * @param {Date} endDate - End date to fetch events to
   * @returns {Promise<CalendarWorkout[]>} Array of workout events
   */
  getCalendarEvents: async (startDate: Date, endDate: Date): Promise<CalendarWorkout[]> => {
    try {
      console.log('Getting calendar events...');
      
      // Get all calendars
      console.log('Fetching calendars...');
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log('Found calendars:', calendars.length);
      
      // Get events from all calendars
      console.log('Fetching events from', startDate, 'to', endDate);
      const events = await Calendar.getEventsAsync(
        calendars.map(calendar => calendar.id),
        startDate,
        endDate
      );
      console.log('Found events:', events.length);
      
      // Log all events for debugging
      console.log('All calendar events:', events.map(e => ({ 
        title: e.title, 
        id: e.calendarId,
        location: e.location,
        startDate: e.startDate
      })));
      
      // Practical approach: Use calendar name and specific workout indicators
      const filteredEvents = events.filter(event => {
        const title = (event.title || '').toLowerCase();
        const notes = (event.notes || '').toLowerCase();
        const location = (event.location || '').toLowerCase();
        
        // Get calendar name from the calendars list using calendarId
        const calendar = calendars.find(cal => cal.id === event.calendarId);
        const calendarName = calendar ? calendar.title.toLowerCase() : '';
        
        console.log(`Checking event: "${title}" from calendar: "${calendarName}"`);
        
        // 1. First check: Is this from a fitness-specific calendar?
        const fitnessCalendars = ['fitness', 'workout', 'gym', 'exercise', 'training', 'health'];
        if (fitnessCalendars.some(name => calendarName.includes(name))) {
          console.log('✅ Included from fitness calendar:', title);
          return true;
        }
        
        // 2. Explicit business/personal events to exclude
        const businessEvents = [
          // Regular meetings
          'weeklies', 'weekly', 'meeting', 'sync', '1:1', 'one-on-one', 'standup', 
          'scrum', 'sprint', 'huddle', 'check-in', 'alignment', 'status',
          // Communication
          'interview', 'call', 'chat', 'discussion', 'conversation', 'debrief',
          'presentation', 'demo', 'workshop', 'training', 'onboarding',
          // Planning and review
          'brand', 'tasting', 'review', 'planning', 'retro', 'retrospective',
          'strategy', 'roadmap', 'brainstorm', 'ideation', 'kickoff',
          // General business terms
          'deadline', 'project', 'client', 'stakeholder', 'vendor', 'partner'
        ];
        
        if (businessEvents.some(term => title.includes(term))) {
          console.log('❌ Excluded business event:', title);
          return false;
        }
        
        // 3. Explicit personal events to exclude
        const personalEvents = [
          // Meals and social gatherings
          'lunch', 'dinner', 'breakfast', 'brunch', 'coffee', 'drinks', 'happy hour',
          'party', 'celebration', 'gathering', 'meetup', 'hangout', 'date', 'social',
          // Personal appointments
          'birthday', 'anniversary', 'doctor', 'dentist', 'appointment', 'haircut',
          'salon', 'spa', 'massage', 'therapy', 'counseling',
          // Travel and events
          'flight', 'trip', 'vacation', 'concert', 'movie', 'show', 'theater',
          // General social terms
          'catch-up', 'hang', 'meet', 'visit'
        ];
        
        if (personalEvents.some(term => title.includes(term))) {
          console.log('❌ Excluded personal event:', title);
          return false;
        }
        
        // 4. Known fitness studios and activities - definite includes
        const fitnessVenues = [
          // Major gym chains
          'equinox', 'soulcycle', 'peloton', 'orangetheory', 'barry\'s', 'barrys',
          'f45', 'crunch', 'lifetime', 'ymca', 'planet fitness', 'la fitness',
          '24 hour fitness', 'gold\'s gym', 'anytime fitness', 'fitness first',
          // Boutique studios
          'solidcore', 'pure barre', 'club pilates', 'corepower', 'rumble',
          'flywheel', 'cyclebar', 'row house', 'boxing', 'kickboxing',
          // Activities and classes
          'yoga', 'pilates', 'cycling', 'run club', 'crossfit', 'zumba',
          'bootcamp', 'hiit class', 'spin class', 'barre', 'reformer',
          'trx', 'circuit training', 'personal training', 'pt session'
        ];
        
        if (fitnessVenues.some(venue => title.includes(venue) || location.includes(venue))) {
          console.log('✅ Included fitness venue event:', title);
          return true;
        }
        
        // 5. Explicit workout terms
        const workoutTerms = ['workout', 'class', 'training', 'gym', 'fitness', 'exercise'];
        if (workoutTerms.some(term => title.includes(term))) {
          console.log('✅ Included workout term event:', title);
          return true;
        }
        
        // 6. Simple workout names - exact matches for common workout types
        const simpleWorkoutNames = [
          'spin', 'run', 'running', 'swim', 'swimming', 'hike', 'hiking', 
          'walk', 'walking', 'bike', 'biking', 'cycle', 'cycling', 'lift', 
          'lifting', 'weights', 'cardio', 'hiit', 'yoga', 'pilates',
          // Body part specific workouts
          'upper body', 'lower body', 'core', 'abs', 'leg day', 'arm day',
          'chest', 'back', 'shoulders', 'arms', 'legs', 'glutes',
          // Workout types
          'set', 'circuit', 'strength', 'conditioning', 'mobility', 'stretch',
          'functional', 'bodyweight', 'resistance', 'endurance'
        ];
        
        // Check if the title is exactly a workout name or starts with one
        for (const name of simpleWorkoutNames) {
          // Exact match or starts with the workout name
          if (title === name || title.startsWith(name + ' ')) {
            console.log('✅ Included simple workout name:', title);
            return true;
          }
          
          // Also check if it's part of a phrase like "morning spin" or "evening run"
          const commonPrefixes = ['morning', 'evening', 'afternoon', 'night', 'daily', 'weekly'];
          for (const prefix of commonPrefixes) {
            if (title === `${prefix} ${name}` || title.startsWith(`${prefix} ${name} `)) {
              console.log('✅ Included prefixed workout name:', title);
              return true;
            }
          }
          
          // Check if the title contains the workout name as part of a compound phrase
          // This will catch things like "Upper Body Set" or "Core Workout"
          if (title.includes(name)) {
            console.log('✅ Included compound workout name:', title);
            return true;
          }
        }
        
        // 7. For everything else, be conservative and exclude
        console.log('❌ Excluded by default:', title);
        return false;
      });
      
      console.log('Final workout events:', filteredEvents.map(e => e.title));
      
      return filteredEvents
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

  /**
   * Format a calendar workout event for display in a workout card
   * @param {CalendarWorkout} workout - The calendar workout to format
   * @returns {Workout} Formatted workout data for display
   */
  formatWorkoutForCard: (workout: CalendarWorkout): Workout => {
    const timeString = workout.startDate.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Format the date for display and grouping
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(workout.startDate);
    const dateString = `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;

    const participants = workout.participants || [
      { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=1' }
    ];

    const platforms = workout.source 
      ? [workout.source] 
      : ['Calendar'];

    // Create a unique ID by combining the calendar ID with the event ID and timestamp
    // This ensures no duplicate IDs even if events have the same ID across different calendars
    const uniqueId = `cal-${workout.id}-${workout.startDate.getTime()}`;
    
    // Create a proper date object to ensure it's passed correctly
    const rawDate = new Date(workout.startDate);
    console.log(`Formatting workout "${workout.title}" with date: ${dateString}, rawDate: ${rawDate}`);
    
    return {
      id: uniqueId,
      title: workout.title,
      time: timeString,
      date: dateString,
      rawDate: rawDate,
      location: workout.location,
      participants,
      platforms
    };
  }
};