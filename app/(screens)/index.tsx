import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert, ActivityIndicator, Modal, Pressable, Animated } from 'react-native';
import WorkoutCard from '../../src/components/WorkoutCard';
import { mockWorkouts } from '../App';
import { useRouter } from 'expo-router';
import { useCalendar } from '../../src/hooks/useCalendar';
import { Feather } from '@expo/vector-icons';

import { Workout } from '../../src/types/workout';

/**
 * WorkoutFeed component displays a list of workouts from both mock data and calendar events.
 * It allows users to pull workouts from their calendar and toggle their visibility.
 */
const WorkoutFeed = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [visibleWorkouts, setVisibleWorkouts] = useState(5); // Start with 5 workout cards
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { formattedWorkouts, loading: calendarLoading, error, hasPermission, refreshWorkouts } = useCalendar();
  const [showCalendarWorkouts, setShowCalendarWorkouts] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [localCalendarWorkouts, setLocalCalendarWorkouts] = useState<Workout[]>([]);

  // Combine mock workouts with calendar workouts if enabled
  const allWorkouts = showCalendarWorkouts && calendarInitialized
    ? [...mockWorkouts, ...localCalendarWorkouts]
    : mockWorkouts;
    
  // Debug: Log all workouts with their dates
  console.log('All workouts with dates:', allWorkouts.map(w => ({ 
    id: w.id, 
    title: w.title, 
    date: w.date, 
    hasRawDate: !!w.rawDate 
  })));
  
  // Group workouts by date
  const workoutsByDate = allWorkouts.reduce((acc, workout) => {
    // Use the workout's date or default to today
    const date = workout.date || formatDate();
    console.log(`Workout "${workout.title}" has date: ${date}`);
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);
  
  // Debug: Log workout groups
  console.log('Workout groups:', Object.keys(workoutsByDate));
  
  // Sort dates chronologically
  const sortedDates = Object.keys(workoutsByDate).sort((a, b) => {
    const dateA = workoutsByDate[a][0].rawDate || new Date();
    const dateB = workoutsByDate[b][0].rawDate || new Date();
    return dateA.getTime() - dateB.getTime();
  });
  
  // Debug: Log sorted dates
  console.log('Sorted dates:', sortedDates);

  /**
   * Handle press events on workout cards
   * For both calendar events and mock workouts: navigate to the workout details screen
   */
  const handleWorkoutPress = (workout: Workout) => {
    // Navigate to workout detail screen for all workouts
    router.push({
      pathname: "/workout/[id]",
      params: { id: workout.id }
    });
  };

  /**
   * Format the current date for display
   * @returns {string} Formatted date string (e.g., 'Mon Mar 17')
   */
  const formatDate = () => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`;
  };

  /**
   * Fetch workouts from the calendar and update the local state
   * This will request calendar permissions if not already granted
   */
  const handlePullCalendar = async () => {
    try {
      setLoading(true);
      
      // Ensure calendar workouts are shown
      setShowCalendarWorkouts(true);
      setCalendarInitialized(true);
      
      // Fetch new workouts and get them directly
      const newWorkouts = await refreshWorkouts();
      
      // Ensure all calendar workouts have proper dates before setting them
      const workoutsWithDates = newWorkouts.map((workout: any) => {
        if (!workout.date) {
          // Format the date for any workouts missing it
          const date = workout.rawDate || new Date();
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          workout.date = `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
        }
        return workout;
      });
      
      console.log('Setting calendar workouts with dates:', workoutsWithDates.map((w: any) => ({ 
        id: w.id, 
        title: w.title, 
        date: w.date 
      })));
      
      // Update with new workouts
      setLocalCalendarWorkouts(workoutsWithDates);
      
      // Check if we've reached the end (14 days)
      if (workoutsWithDates.length > 0) {
        const lastWorkout = workoutsWithDates[workoutsWithDates.length - 1];
        const lastWorkoutDate = lastWorkout.rawDate || new Date();
        const daysSinceStart = Math.floor((lastWorkoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        setHasReachedEnd(daysSinceStart >= 14);
        
        Alert.alert('Success', `Found ${workoutsWithDates.length} calendar workouts`);
      } else {
        Alert.alert('No Workouts Found', 'No workout events were found in your calendar. Try adding more specific workout names to your calendar events.');
      }
    } catch (err) {
      console.error('Error pulling calendar workouts:', err);
      Alert.alert('Error', 'Failed to pull calendar workouts');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? '#000000' : '#f9fafb' }
    ]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 50; // Load more when within 50px of the bottom
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
            contentSize.height - paddingToBottom;

          if (isCloseToBottom && !isLoadingMore && showCalendarWorkouts) {
            setIsLoadingMore(true);
            
            // First try to show more of the already loaded workouts
            const totalWorkouts = sortedDates.reduce((sum, date) => sum + workoutsByDate[date].length, 0);
            
            if (visibleWorkouts < totalWorkouts) {
              // If we have more workouts loaded but not shown, show 3 more
              setTimeout(() => {
                setVisibleWorkouts(prev => Math.min(prev + 3, totalWorkouts));
                setIsLoadingMore(false);
              }, 300); // Small delay for smooth loading feel
            } else if (!hasReachedEnd) {
              // If we've shown all loaded workouts, try to load more from calendar
              refreshWorkouts().then(() => {
                setIsLoadingMore(false);
                // Check if we've reached the end
                const lastDate = sortedDates[sortedDates.length - 1];
                if (lastDate) {
                  const lastWorkout = workoutsByDate[lastDate][0];
                  const lastWorkoutDate = lastWorkout.rawDate || new Date();
                  const daysSinceStart = Math.floor((lastWorkoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  setHasReachedEnd(daysSinceStart >= 14);
                }
              });
            } else {
              setIsLoadingMore(false);
            }
          }
        }}
        scrollEventThrottle={400} // Throttle scroll events to every 400ms
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.dateContainer}>
            <Text style={[styles.date, { color: isDark ? '#ffffff' : '#111827' }]}>{formatDate()}</Text>
          </View>
          <View>
            <TouchableOpacity 
              style={styles.plusButton}
              onPress={() => {
                setShowMenu(!showMenu);
                Animated.spring(menuAnimation, {
                  toValue: showMenu ? 0 : 1,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>

            {/* Overlay to dismiss menu */}
            {showMenu && (
              <Pressable 
                style={styles.overlay}
                onPress={() => {
                  setShowMenu(false);
                  Animated.spring(menuAnimation, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start();
                }}
              />
            )}

            {/* Dropdown Menu */}
            {showMenu && (
              <View style={styles.menuContainer}>
                <Animated.View 
                  style={[styles.menu, {
                    opacity: menuAnimation,
                    transform: [{
                      translateY: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                      })
                    }]
                  }]}
                >
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setShowMenu(false);
                      handlePullCalendar();
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.menuText}>Pull from Calendar</Text>
                    {loading && <ActivityIndicator size="small" color="#4b5563" style={styles.smallLoader} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setShowMenu(false);
                      // TODO: Implement social planning
                      Alert.alert('Coming Soon', 'Social workout planning will be available soon!');
                    }}
                  >
                    <Text style={styles.menuText}>Plan a Social</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>
        </View>

        {/* Workouts List Grouped by Date */}
        <View style={styles.workoutList}>
          {/* Show limited number of workout cards */}
          {sortedDates.map((date, index) => {
            // Count total workouts up to this date
            const totalWorkoutsSoFar = sortedDates
              .slice(0, index + 1)
              .reduce((sum, d) => sum + workoutsByDate[d].length, 0);
            
            // Only show if we're within our visible workout limit
            if (totalWorkoutsSoFar > visibleWorkouts) return null;
            
            return (
            <View key={date} style={styles.dateSection}>
              {/* Date Header */}
              <Text style={[styles.dateLabel, isDark && { color: '#fff' }]}>
                {date}
              </Text>
              
              {/* Workouts for this date */}
              {workoutsByDate[date].map((workout, workoutIndex) => (
                <TouchableOpacity
                  key={workout.id}
                  onPress={() => handleWorkoutPress(workout)}
                  style={[
                    styles.workoutItem,
                    workoutIndex === workoutsByDate[date].length - 1 && styles.lastWorkoutItem
                  ]}
                >
                  <WorkoutCard
                    {...workout}
                    isDark={isDark}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )})}

          {/* Loading indicator at bottom */}
          {isLoadingMore && showCalendarWorkouts && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={isDark ? '#666666' : '#6b7280'} />
              <Text style={[styles.loadingText, { color: isDark ? '#666666' : '#6b7280' }]}>
                Loading more workouts...
              </Text>
            </View>
          )}
          
          {/* End of list indicator */}
          {hasReachedEnd && showCalendarWorkouts && sortedDates.length > 0 && (
            <Text style={[styles.endText, { color: isDark ? '#666666' : '#6b7280' }]}>
              No more workouts to load
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  endText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateContainer: {
    flex: 1,
  },
  dateSection: {
    paddingBottom: 12,
    marginTop: 12,
  },
  dateLabel: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  date: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  plusButton: {
    backgroundColor: '#4b5563',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  menuContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
    zIndex: 2,
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: 'transparent',
  },

  toggleButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    backgroundColor: '#4b5563',
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  smallLoader: {
    marginLeft: 8,
  },
  calendarButtonDisabled: {
    opacity: 0.7,
  },
  workoutList: {
    paddingTop: 8,
    gap: 1,
  },
  workoutItem: {
    marginBottom: 4, // Reduced from 8 to 4 for cards within same day
  },
  lastWorkoutItem: {
    marginBottom: 0, // No margin for last card in a day
  },
});

export default WorkoutFeed;