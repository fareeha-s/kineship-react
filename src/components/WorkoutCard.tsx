// src/components/WorkoutCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Animated, ImageBackground } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

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
  onPress?: () => void;
  onDelete?: () => void;
  expanded?: boolean;
  onBack?: () => void;
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
  onPress,
  onDelete,
  expanded = false,
  onBack,
}) => {
  // State to track if the card is being swiped
  const [isSwiping, setIsSwiping] = useState(false);
  const brandStyle = getBrandStyles(location, isDark);
  
  // iOS-specific styles following Apple's Human Interface Guidelines
  const styles = StyleSheet.create({
    mainContent: {
      flex: 1,
    },
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
    avatarsContainer: {
      justifyContent: 'center',
    },
    avatarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
    // New expanded card styles to match the image
    expandedCardContainer: {
      flex: 1,
      backgroundColor: '#121212',
    },
    expandedImageBackground: {
      width: '100%',
      height: 550,
      justifyContent: 'space-between',
    },
    dateContainer: {
      alignItems: 'center',
      paddingTop: 40,
    },
    todayText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    dateText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 4,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    orbitalContainer: {
      flex: 1,
      position: 'relative',
    },
    orbitalLines: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    orbitalLine: {
      position: 'absolute',
      width: 280,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 0.5,
    },
    starDecoration1: {
      position: 'absolute',
      top: '20%', // Using string percentages is valid for View styles
      left: '20%',
    },
    starDecoration2: {
      position: 'absolute',
      top: '30%',
      right: '25%',
    },
    starDecoration3: {
      position: 'absolute',
      bottom: '35%',
      left: '30%',
    },
    starText: {
      fontSize: 24,
      color: '#FFFFFF',
    },
    orbitalAvatar: {
      alignItems: 'center',
      zIndex: 2,
    },
    orbitalAvatarInner: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    orbitalAvatarImage: {
      width: '100%',
      height: '100%',
    },
    orbitalAvatarName: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    workoutInfoContainer: {
      padding: 24,
      paddingBottom: 32,
    },
    workoutTitle: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    workoutTimeLocation: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 4,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    workoutLocation: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      opacity: 0.9,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    platformContainer: {
      padding: 20,
      backgroundColor: '#121212',
    },
    joinText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    platformButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    platformButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    descriptionContainer: {
      padding: 20,
      backgroundColor: '#121212',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    descriptionTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    descriptionText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      lineHeight: 24,
      fontFamily: Platform.OS === 'ios' ? '-apple-system' : 'sans-serif',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 16,
      zIndex: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
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

  // Render the expanded view with detailed information
  if (expanded) {
    // Background image for the expanded card - gym with red lighting
    const gymBackgroundImage = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
    
    // Calculate positions for orbital layout
    const getOrbitalPosition = (index: number, total: number): {
      top: number;
      left: number;
    } => {
      if (total === 1) {
        return { 
          top: 200, // 30% of container height (approximated)
          left: 200, // 50% of container width (approximated)
        };
      }
      
      const angle = (index / total) * 2 * Math.PI;
      const radius = 120; // Radius of the orbit
      const centerX = 0;
      const centerY = 0;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Calculate positions as numeric values (pixels) instead of percentages
      // These are approximations based on container dimensions
      const containerHeight = 550; // Height of expandedImageBackground
      const containerWidth = 400;  // Approximate width of the container
      
      const topPosition = containerHeight * 0.5 + (y / radius) * (containerHeight * 0.3);
      const leftPosition = containerWidth * 0.5 + (x / radius) * (containerWidth * 0.4);
      
      return {
        top: topPosition,
        left: leftPosition,
      };
    };
    
    // Platform icon mapping
    const getPlatformIcon = (platform: string) => {
      const platformMap: Record<string, { icon: string, color: string, bgColor: string }> = {
        'Strava': { icon: 'strava', color: '#FC4C02', bgColor: '#FFFFFF' },
        'ClassPass': { icon: 'calendar-check', color: '#FFFFFF', bgColor: '#1D63FF' },
        'MindBody': { icon: 'spa', color: '#FFFFFF', bgColor: '#F83A3A' },
        'Peloton': { icon: 'bicycle', color: '#FFFFFF', bgColor: '#E4002B' },
        'Nike Training Club': { icon: 'running', color: '#FFFFFF', bgColor: '#000000' },
        'Equinox+': { icon: 'dumbbell', color: '#FFFFFF', bgColor: '#000000' },
        'Barry\'s': { icon: 'heartbeat', color: '#FFFFFF', bgColor: '#FF0000' },
        'SoulCycle': { icon: 'biking', color: '#FFFFFF', bgColor: '#FFDB00' },
      };
      
      return platformMap[platform] || { icon: 'star', color: '#FFFFFF', bgColor: '#4A4A4A' };
    };
    
    // Format time for display
    const formatTimeRange = (timeStr: string) => {
      // If time already contains a range, return as is
      if (timeStr.includes('-')) return timeStr;
      
      // Otherwise, try to parse the time and add 50 minutes
      try {
        const timeParts = timeStr.match(/([0-9]+):([0-9]+)\s*([AP]M)/i);
        if (!timeParts) return timeStr;
        
        let [_, hours, minutes, ampm] = timeParts;
        let hoursNum = parseInt(hours);
        let minutesNum = parseInt(minutes);
        
        // Add 50 minutes for end time
        minutesNum += 50;
        if (minutesNum >= 60) {
          hoursNum += Math.floor(minutesNum / 60);
          minutesNum = minutesNum % 60;
          
          // Handle AM/PM change
          if (hoursNum === 12) {
            ampm = ampm === 'AM' ? 'PM' : 'AM';
          } else if (hoursNum > 12) {
            hoursNum = hoursNum - 12;
            ampm = ampm === 'AM' ? 'PM' : 'AM';
          }
        }
        
        return `${timeStr} - ${hoursNum}:${minutesNum.toString().padStart(2, '0')}${ampm}`;
      } catch (e) {
        return timeStr;
      }
    };
    
    return (
      <View style={styles.expandedCardContainer}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        
        <ImageBackground 
          source={{ uri: gymBackgroundImage }}
          style={styles.expandedImageBackground}
          imageStyle={{ opacity: 0.8 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Date display */}
          <View style={styles.dateContainer}>
            <Text style={styles.todayText}>Today</Text>
            <Text style={styles.dateText}>Fri Aug 7</Text>
          </View>
          
          {/* Orbital participant layout */}
          <View style={styles.orbitalContainer}>
            {/* Connecting lines and decorations */}
            <View style={styles.orbitalLines}>
              <View style={styles.orbitalLine} />
              <View style={[styles.orbitalLine, { transform: [{ rotate: '60deg' }] }]} />
              <View style={[styles.orbitalLine, { transform: [{ rotate: '120deg' }] }]} />
              <View style={styles.starDecoration1}>
                <Text style={styles.starText}>✨</Text>
              </View>
              <View style={styles.starDecoration2}>
                <Text style={styles.starText}>✨</Text>
              </View>
              <View style={styles.starDecoration3}>
                <Text style={styles.starText}>✨</Text>
              </View>
            </View>
            
            {/* Participant avatars in orbital layout */}
            {participants && participants.length > 0 && (
              participants.slice(0, 3).map((participant, index) => {
                const position = getOrbitalPosition(index, participants.slice(0, 3).length);
                return (
                  <View key={participant.id} style={[styles.orbitalAvatar, {
                    position: 'absolute',
                    top: position.top - 40, // Adjust for avatar centering
                    left: position.left - 40, // Adjust for avatar centering
                  }]}>
                    <View style={styles.orbitalAvatarInner}>
                      <Image
                        source={{ uri: participant.avatar }}
                        style={styles.orbitalAvatarImage}
                      />
                    </View>
                    <Text style={styles.orbitalAvatarName}>{participant.name}</Text>
                  </View>
                );
              })
            )}
          </View>
          
          {/* Workout title and details at bottom */}
          <View style={styles.workoutInfoContainer}>
            <Text style={styles.workoutTitle}>{title}</Text>
            <Text style={styles.workoutTimeLocation}>
              {formatTimeRange(time)}
            </Text>
            <Text style={styles.workoutLocation}>{location}</Text>
          </View>
        </ImageBackground>
        
        {/* Platform buttons */}
        <View style={styles.platformContainer}>
          <Text style={styles.joinText}>Join in through:</Text>
          <View style={styles.platformButtons}>
            {platforms && platforms.length > 0 && (
              platforms.map((platform, index) => {
                const { icon, color, bgColor } = getPlatformIcon(platform);
                return (
                  <TouchableOpacity 
                    key={platform} 
                    style={[styles.platformButton, { backgroundColor: bgColor }]}
                    activeOpacity={0.8}
                  >
                    <FontAwesome5 name={icon} size={24} color={color} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
        
        {/* Additional workout details can be added below if needed */}
        {description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About this workout</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
      </View>
    );
  }
  
  // Render the regular card view
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      onSwipeableOpen={() => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setIsSwiping(true);
      }}
      onSwipeableClose={() => {
        setIsSwiping(false);
      }}
      onBegan={() => {
        setIsSwiping(true);
      }}
      onEnded={() => {
        // Add a small delay before allowing press events again
        setTimeout(() => {
          setIsSwiping(false);
        }, 100);
      }}
      enabled={onDelete !== undefined}
    >
      <TouchableOpacity
        onPress={() => {
          if (!isSwiping && onPress) {
            onPress();
          }
        }}
        activeOpacity={0.7}
        style={styles.card}
      >
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
          </View>
          
          {/* Participant avatars - on the right side */}
          <View style={styles.avatarsContainer}>
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
      </TouchableOpacity>
    </Swipeable>
  );
};

export default WorkoutCard;