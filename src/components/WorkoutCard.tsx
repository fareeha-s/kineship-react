// src/components/WorkoutCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface WorkoutCardProps {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: Participant[];
  platforms: string[];
  isDark?: boolean;
  type?: string;
  intensity?: string;
  duration?: string;
  description?: string;
  onDelete?: () => void;
}

const getBrandStyles = (location: string, isDark: boolean) => {
  if (location.includes("Barry's")) {
    return {
      icon: '🏃‍♂️',
      iconBg: isDark ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 59, 48, 0.15)',
      tint: isDark ? '#FF3B30' : '#FF3B30', // iOS red
    };
  }
  if (location.includes('SoulCycle')) {
    return {
      icon: '🚲',
      iconBg: isDark ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 204, 0, 0.15)',
      tint: isDark ? '#FFCC00' : '#FFCC00', // iOS yellow
    };
  }
  if (location.includes('Yoga')) {
    return {
      icon: '🧘‍♀️',
      iconBg: isDark ? 'rgba(88, 86, 214, 0.3)' : 'rgba(88, 86, 214, 0.15)',
      tint: isDark ? '#5856D6' : '#5856D6', // iOS purple
    };
  }
  return {
    icon: '💪',
    iconBg: isDark ? 'rgba(52, 199, 89, 0.3)' : 'rgba(52, 199, 89, 0.15)',
    tint: isDark ? '#34C759' : '#34C759', // iOS green
  };
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  time,
  location,
  participants,
  platforms,
  isDark = false,
  type,
  intensity,
  duration,
  description,
  onDelete,
}) => {
  const brandStyle = getBrandStyles(location, isDark);
  
  // iOS-specific styles following Apple's Human Interface Guidelines
  const styles = StyleSheet.create({
    card: {
      marginVertical: 6,
      marginHorizontal: 0, // Restore full width
      borderRadius: 12, // iOS typical corner radius
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', // iOS system background colors
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
      overflow: 'hidden',
      width: '100%', // Ensure full width
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16, // iOS standard padding
      width: '100%',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8, // iOS typical corner radius for smaller elements
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brandStyle.iconBg,
    },
    textContent: {
      flex: 1,
      marginLeft: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mainContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 17, // iOS typical font size
      fontWeight: '600', // iOS semibold weight
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 4,
      fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif' : Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    cardSubtitle: {
      fontSize: 15, // iOS typical font size for secondary text
      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif' : Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    avatarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
    avatarContainer: {
      marginRight: -8,
    },
    avatarThumb: {
      width: 28,
      height: 28,
      borderRadius: 14, // iOS circular avatars
      borderWidth: 2,
      borderColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    // Swipe action styles
    deleteAction: {
      backgroundColor: '#FF3B30', // iOS system red
      justifyContent: 'center',
      alignItems: 'flex-end',
      height: '100%',
      paddingHorizontal: 30,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    deleteText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
  });

  // Render right actions (delete button) when swiped
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number> | any, dragX: Animated.AnimatedInterpolation<number> | any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ scale }] }]}>
        <TouchableOpacity onPress={() => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          if (onDelete) onDelete();
        }}>
          <Feather name="trash-2" size={24} color="white" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      onSwipeableOpen={() => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }}
      enabled={onDelete !== undefined}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 18 }}>{brandStyle.icon}</Text>
          </View>
          <View style={styles.textContent}>
            <View style={styles.mainContent}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>
                {time} • {location}
              </Text>
            </View>
            
            {/* Participant avatars */}
            {participants && participants.length > 0 && (
              <View style={styles.avatarsRow}>
                {participants.slice(0, 3).map((participant, index) => (
                  <View key={participant.id} style={styles.avatarContainer}>
                    <Image
                      source={{ uri: participant.avatar }}
                      style={styles.avatarThumb}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default WorkoutCard;