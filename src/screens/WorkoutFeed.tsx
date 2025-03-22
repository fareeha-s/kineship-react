// src/screens/WorkoutFeed.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import { mockWorkouts } from '../../app/App';
import { useRouter } from 'expo-router';
import { useCalendar } from '../hooks/useCalendar';
import Icon from 'react-native-vector-icons/Feather';

interface Workout {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  platforms: string[];
  type?: string;
  intensity?: string;
  duration?: string;
  description?: string;
}

const WorkoutFeed = () => {
  const router = useRouter();
  const { formattedWorkouts, loading: calendarLoading, error, hasPermission, refreshWorkouts } = useCalendar();
  const [refreshing, setRefreshing] = useState(false);
  const [showCalendarWorkouts, setShowCalendarWorkouts] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Combine mock workouts with calendar workouts
  const allWorkouts = showCalendarWorkouts && calendarInitialized
    ? [...mockWorkouts, ...formattedWorkouts]
    : mockWorkouts;
    
  // Sort workouts by time
  const sortedWorkouts = [...allWorkouts].sort((a, b) => {
    // Convert time strings to comparable values
    const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
    const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  const handleWorkoutPress = (workout: Workout) => {
    router.push(`/workout/${workout.id}`);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    if (calendarInitialized) {
      await refreshWorkouts();
    }
    setRefreshing(false);
  };
  
  const handlePullCalendar = async () => {
    try {
      setLoading(true);
      await refreshWorkouts();
      setCalendarInitialized(true);
      setShowCalendarWorkouts(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to pull calendar workouts');
    } finally {
      setLoading(false);
    }
  };

  const navigateToCalendarView = () => {
    router.push('/calendar');
  };
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Today's Workouts</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.buttonText}>Create Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.calendarViewButton}
              onPress={navigateToCalendarView}
            >
              <Icon name="calendar" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Calendar button */}
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={handlePullCalendar}
          disabled={loading || calendarLoading}
        >
          <Icon name="calendar" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.calendarButtonText}>
            {calendarInitialized ? 'Refresh Calendar Workouts' : 'Pull Workouts from Calendar'}
          </Text>
          {(loading || calendarLoading) && <ActivityIndicator size="small" color="white" style={styles.smallLoader} />}
        </TouchableOpacity>
        
        {calendarInitialized && hasPermission && (
          <View style={styles.calendarToggle}>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                showCalendarWorkouts && styles.toggleButtonActive
              ]}
              onPress={() => setShowCalendarWorkouts(!showCalendarWorkouts)}
            >
              <Icon 
                name="calendar" 
                size={16} 
                color={showCalendarWorkouts ? "#fff" : "#6b7280"} 
                style={styles.toggleIcon} 
              />
              <Text 
                style={[
                  styles.toggleText,
                  showCalendarWorkouts && styles.toggleTextActive
                ]}
              >
                Show Calendar Workouts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handlePullCalendar}
              disabled={loading || calendarLoading}
            >
              <Icon 
                name="refresh-cw" 
                size={16} 
                color="#6b7280" 
                style={[styles.toggleIcon, (loading || calendarLoading) && styles.rotating]} 
              />
              <Text style={styles.toggleText}>
                Refresh Calendar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {(loading || calendarLoading) && !refreshing && calendarInitialized ? (
          <ActivityIndicator size="large" color="#dc2626" style={styles.loader} />
        ) : (
          <View style={styles.workoutList}>
            {sortedWorkouts.length > 0 ? (
              sortedWorkouts.map((workout) => (
                <TouchableOpacity 
                  key={workout.id} 
                  style={styles.workoutItem}
                  onPress={() => handleWorkoutPress(workout)}
                  activeOpacity={0.7}
                >
                  <WorkoutCard {...workout} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="calendar" size={40} color="#6b7280" />
                <Text style={styles.placeholder}>No workouts found</Text>
                <Text style={styles.subPlaceholder}>
                  Create a workout or add workouts to your calendar
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  createButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  calendarViewButton: {
    backgroundColor: '#4b5563',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b5563',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  calendarButtonText: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  smallLoader: {
    marginLeft: 8,
  },
  calendarToggle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#4b5563',
  },
  toggleIcon: {
    marginRight: 4,
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  rotating: {
    // Animation would be added here with Animated API
  },
  loader: {
    marginVertical: 20,
  },
  workoutList: {
    marginTop: 8,
  },
  workoutItem: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 20,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  subPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default WorkoutFeed;