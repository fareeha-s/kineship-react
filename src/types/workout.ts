/**
 * Represents a participant in a workout
 */
export interface WorkoutParticipant {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Represents a workout event from any source (mock or calendar)
 */
export interface Workout {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: WorkoutParticipant[];
  platforms: string[];
  date?: string; // Optional for backward compatibility with mock workouts
  rawDate?: Date; // Raw date object for sorting
}

/**
 * Represents a workout event specifically from the calendar
 */
export interface CalendarWorkout {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  source?: string;
  participants?: WorkoutParticipant[];
}
