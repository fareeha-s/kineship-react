import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert, ActivityIndicator, Modal, Pressable, Animated, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WorkoutCard from '../../src/components/WorkoutCard';
import { mockWorkouts } from '../App';
import { useRouter } from 'expo-router';
import { useCalendar } from '../../src/hooks/useCalendar';
import { Feather } from '@expo/vector-icons';
import { calendarService } from '../../src/services/calendarService'; // Import calendarService

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
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const { formattedWorkouts, loading: calendarLoading, error, hasPermission, refreshWorkouts, addDeletedWorkout } = useCalendar();
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

  const handleDeleteWorkout = async (workoutId: string) => {
    // Find the workout to delete
    const workoutToDelete = allWorkouts.find(workout => workout.id === workoutId);
    
    if (!workoutToDelete) {
      console.log('Workout not found:', workoutId);
      return;
    }
    
    if (!('calendarId' in workoutToDelete)) {
      console.log('Not a calendar workout:', workoutId);
      return;
    }
    
    // Show confirmation dialog before deleting
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // If it's a calendar workout and has a calendarId, delete it from the calendar
              if (workoutToDelete.calendarId) {
                console.log('Deleting calendar event:', workoutToDelete.calendarId);
                const success = await calendarService.deleteCalendarEvent(workoutToDelete.calendarId);
                if (!success) {
                  console.log('Failed to delete calendar event');
                  Alert.alert('Error', 'Failed to delete the workout from your calendar.');
                  return;
                }
              }
              
              // Add the workout ID to the set of deleted workouts in useCalendar
              addDeletedWorkout(workoutId);
              
              // Remove the workout from localCalendarWorkouts
              setLocalCalendarWorkouts(prev => 
                prev.filter(workout => workout.id !== workoutId)
              );
              
              // Show success message
              Alert.alert('Success', 'The workout has been deleted.');
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete the workout. Please try again.');
            }
          }
        }
      ]
    );
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
      
      // Make sure we have an array of workouts
      if (!Array.isArray(newWorkouts)) {
        console.error('Expected array of workouts but got:', newWorkouts);
        throw new Error('Failed to get workouts from calendar');
      }
      
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
        
        Alert.alert('Success', `Found ${workoutsWithDates.length} calendar workouts including yesterday's workouts`);
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
      { backgroundColor: isDark ? '#000000' : '#F2F2F7' }
    ]}>
      {/* Vibrant gradient background overlay */}
      <LinearGradient
        colors={isDark 
          ? ['#1a2f25', '#2d4339', '#1a2f25'] 
          : ['#FFFFFF', '#E8F3ED', '#FFE5E0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />
      


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
          <View style={styles.emojiContainer}>
            <Text style={[styles.emojiText, { marginTop: 4 }]}>🤸‍♀️🏃‍♀️💃🎾✨</Text>
          </View>
          <View>
            <TouchableOpacity 
              style={[styles.plusButton, { backgroundColor: isDark ? 'rgba(75, 85, 99, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}
              onPress={() => {
                setShowMenu(!showMenu);
                Animated.spring(menuAnimation, {
                  toValue: showMenu ? 0 : 1,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Text style={[styles.plusButtonText, { color: isDark ? 'white' : '#4b5563' }]}>+</Text>
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
                    }],
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
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
                    <Text style={[styles.menuText, { color: isDark ? 'white' : '#374151' }]}>Pull from Calendar</Text>
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
                    <Text style={[styles.menuText, { color: isDark ? 'white' : '#374151' }]}>Plan a Social</Text>
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
            
            // Check if this date is today
            const rawDate = workoutsByDate[date][0].rawDate;
            const today = new Date();
            const isToday = rawDate && 
              rawDate.getDate() === today.getDate() && 
              rawDate.getMonth() === today.getMonth() && 
              rawDate.getFullYear() === today.getFullYear();
            
            return (
            <View key={date} style={styles.dateSection}>
              {/* Today Label for today's date */}
              {isToday ? (
                <Text style={[styles.todayLabel, isDark && { color: '#fff' }]}>
                  TODAY
                </Text>
              ) : (
                rawDate && (
                  <Text style={[styles.todayLabel, isDark && { color: '#fff' }]}>
                    {(() => {
                      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                      return days[rawDate.getDay()];
                    })()}
                  </Text>
                )
              )}
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <Text style={[styles.dateLabel, isDark && { color: '#fff' }, { fontSize: 20 }]}>
                  {(() => {
                    if (rawDate) {
                      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      return `${months[rawDate.getMonth()]} ${rawDate.getDate()}`;
                    }
                    return date;
                  })()}
                </Text>
              </View>
              
              {/* Workouts for this date */}
              {workoutsByDate[date].map((workout, workoutIndex) => (
                <View
                  key={workout.id}
                  style={[
                    styles.workoutItem,
                    workoutIndex === workoutsByDate[date].length - 1 && styles.lastWorkoutItem
                  ]}
                >
                  <WorkoutCard
                    id={workout.id}
                    title={workout.title}
                    time={workout.time}
                    location={workout.location}
                    participants={workout.participants}
                    platforms={workout.platforms}
                    type={workout.type}
                    intensity={workout.intensity}
                    duration={workout.duration}
                    description={workout.description}
                    isDark={isDark}
                    onPress={() => handleWorkoutPress(workout)}
                    onDelete={() => handleDeleteWorkout(workout.id)}
                  />
                </View>
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

// Define styles based on the current theme
const getThemedStyles = (isDark: boolean) => StyleSheet.create({
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400',
  },
  endText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
    fontWeight: '400',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight || 0),
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 24,
    backgroundColor: 'transparent', // Transparent to show container background
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingTop: 0,
  },
  emojiContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 4,
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 40,
    letterSpacing: 0,
    textAlign: 'left',
    marginBottom: 0,
  },
  dateSection: {
    paddingBottom: 12,
    marginTop: 16,
  },
  dateHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: -0.5,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  dayOfWeek: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: isDark ? '#60A5FA' : '#3B82F6',
    marginBottom: 4,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 0,
    backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
  },
  plusButtonText: {
    fontSize: 28,
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
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    minWidth: 200,
    borderWidth: 0.5,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 4,
    backgroundColor: isDark ? 'rgba(60, 60, 67, 0.1)' : 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0.5,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  menuText: {
    fontSize: 16,
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
    gap: 8, 
    paddingBottom: 48,
    paddingHorizontal: 0,
  },
  workoutItem: {
    marginBottom: 4,
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: 'transparent'
  },
  lastWorkoutItem: {
    marginBottom: 0, // No margin for last card in a day
  },
  todayLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: isDark ? '#60A5FA' : '#3B82F6',
    marginBottom: 6,
    marginTop: 0,
  },


});

// Generate styles based on the current theme
const styles = getThemedStyles(false); // Default to light theme, we use inline conditionals for dark theme

export default WorkoutFeed;