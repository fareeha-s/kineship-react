/**
 * Keywords used to identify workout events in calendars
 */
export const WORKOUT_KEYWORDS = [
  // General workout terms
  'workout', 'gym', 'fitness', 'exercise', 'training', 'class',
  
  // Cardio activities
  'spin', 'spinning', 'cycle', 'cycling', 'ride', 'run', 'running',
  'cardio', 'hiit', 'tread', 'treadmill', 'row', 'rowing',
  'swim', 'swimming', 'elliptical', 'stairmaster',
  
  // Strength training
  'strength', 'weights', 'lifting', 'powerlifting',
  'crossfit', 'circuit', 'bootcamp', 'boot camp',
  'resistance', 'conditioning', 'functional',
  
  // Mind-body & flexibility
  'yoga', 'pilates', 'barre', 'stretch', 'flexibility',
  'meditation', 'mindfulness', 'recovery',
  
  // Dance & rhythm
  'zumba', 'dance', 'rhythm', 'aerobics',
  
  // Combat sports
  'boxing', 'kickboxing', 'mma', 'martial arts',
  'karate', 'jiu jitsu', 'muay thai',
  
  // Sports & recreation
  'tennis', 'basketball', 'volleyball', 'soccer',
  'climbing', 'rock climbing', 'bouldering',
  
  // Studio names and common terms
  'equinox', 'soulcycle', 'peloton', 'orangetheory',
  'barry\'s', 'barrys', 'f45', 'crunch', '24 hour',
  'lifetime', 'ymca', 'planet fitness', 'la fitness',
  
  // Class types
  'beginner', 'intermediate', 'advanced',
  'express', 'power', 'flow', 'core', 'sculpt',
  'tone', 'burn', 'shred', 'endurance'
] as const;

/**
 * Platform identifiers for different fitness services
 */
export const PLATFORM_IDENTIFIERS = [
  { name: 'ClassPass', keywords: ['classpass', 'class pass'] },
  { name: 'Strava', keywords: ['strava'] },
  { name: 'MindBody', keywords: ['mindbody', 'mind body'] },
  { name: 'Peloton', keywords: ['peloton'] },
  { name: 'Nike Training Club', keywords: ['nike', 'ntc'] },
  { name: 'Equinox+', keywords: ['equinox'] },
  { name: 'Barry\'s', keywords: ['barry', 'barrys'] },
  { name: 'SoulCycle', keywords: ['soul', 'soulcycle'] },
] as const;
