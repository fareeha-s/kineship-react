// src/components/WorkoutCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
  expanded?: boolean;
  onBack?: () => void;
  isDark?: boolean;
  type?: string;
  intensity?: string;
  duration?: string;
  description?: string;
}

const getBrandStyles = (location: string, isDark: boolean) => {
  if (location.includes("Barry's")) {
    return {
      gradient: isDark 
        ? ['rgba(255, 59, 48, 0.15)', 'rgba(255, 59, 48, 0.05)']
        : ['rgba(255, 59, 48, 0.08)', 'rgba(255, 59, 48, 0.02)'],
      icon: '🏃‍♂️',
      iconBg: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.08)',
      tint: isDark ? 'rgba(255, 59, 48, 0.8)' : 'rgba(255, 59, 48, 1)',
    };
  }
  if (location.includes('SoulCycle')) {
    return {
      gradient: isDark
        ? ['rgba(255, 204, 0, 0.12)', 'rgba(255, 204, 0, 0.02)']
        : ['rgba(255, 204, 0, 0.08)', 'rgba(255, 204, 0, 0.02)'],
      icon: '🚲',
      iconBg: isDark ? 'rgba(255, 204, 0, 0.15)' : 'rgba(255, 204, 0, 0.1)',
      tint: isDark ? 'rgba(255, 204, 0, 0.8)' : 'rgba(255, 204, 0, 1)',
    };
  }
  // Default gradient - using iOS blue
  return {
    gradient: isDark
      ? ['rgba(10, 132, 255, 0.12)', 'rgba(10, 132, 255, 0.02)']
      : ['rgba(10, 132, 255, 0.08)', 'rgba(10, 132, 255, 0.02)'],
    icon: '💪',
    iconBg: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(10, 132, 255, 0.08)',
    tint: isDark ? 'rgba(10, 132, 255, 0.8)' : 'rgba(10, 132, 255, 1)',
  };
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  time,
  location,
  participants,
  platforms,
  expanded = false,
  onBack,
  isDark = false,
  type,
  intensity,
  duration,
  description,
}) => {
  const brandStyle = getBrandStyles(location, isDark);
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const styles = StyleSheet.create({
    // Expanded View Styles
    expandedRoot: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      zIndex: 50,
    },
    scrollContainer: {
      flex: 1,
    },
    gradientHeader: {
      height: 260,
      backgroundColor: brandStyle.gradient[0],
      padding: 16,
      paddingTop: 48,
      position: 'relative',
      overflow: 'hidden',
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(250, 250, 250, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    headerContent: {
      position: 'absolute',
      bottom: 32,
      left: 24,
      right: 24,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700', 
      letterSpacing: -0.5,
      color: isDark ? 'white' : '#000000',
      marginBottom: 6,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    headerSubtitle: {
      fontSize: 17,
      fontWeight: '500', 
      color: isDark ? 'rgba(235, 235, 245, 0.8)' : 'rgba(60, 60, 67, 0.8)',
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    // Card View Styles
    card: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 14,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brandStyle.iconBg,
      shadowColor: brandStyle.tint,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    textContent: {
      flex: 1,
      justifyContent: 'center',
    },
    titleContainer: {
      marginBottom: 4,
    },
    cardTitle: {
      fontSize: 17, 
      fontWeight: '500', 
      letterSpacing: -0.24, 
      color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)',
    },
    cardSubtitle: {
      fontSize: 15, 
      fontWeight: '400', 
      letterSpacing: -0.24,
      color: isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)', 
    },
    avatarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    avatarContainer: {
      marginLeft: -8,
    },
    avatarThumb: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    },
    moreAvatars: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      backgroundColor: isDark ? 'rgba(60, 60, 67, 0.6)' : 'rgba(60, 60, 67, 0.18)',
    },
    moreAvatarsText: {
      fontSize: 12,
      fontWeight: '500', 
      color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)',
    },
    // Expanded View Styles
    participantsSection: {
      paddingVertical: 32,
      paddingHorizontal: 24,
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 250, 0.8)',
      borderRadius: 24,
      margin: 16,
      marginTop: -30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 20, 
      fontWeight: '700', 
      letterSpacing: -0.5,
      color: isDark ? 'white' : '#000000',
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    participantsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      gap: 24,
    },
    participantItem: {
      alignItems: 'center',
      width: 80,
      marginBottom: 10,
    },
    participantAvatarContainer: {
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    participantAvatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 3,
      borderColor: isDark ? 'rgba(60, 60, 67, 0.3)' : 'rgba(255, 255, 255, 0.9)',
    },
    participantName: {
      color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)',
      marginTop: 10,
      fontSize: 15,
      fontWeight: '600', 
      textAlign: 'center',
    },
    platformsSection: {
      padding: 24,
      paddingTop: 8,
      margin: 16,
      marginTop: 0,
    },
    platformsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    platformButton: {
      flex: 1,
      minWidth: 140,
      backgroundColor: isDark ? 'rgba(60, 60, 67, 0.3)' : 'rgba(242, 242, 247, 0.9)',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: brandStyle.tint,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(80, 80, 90, 0.3)' : 'rgba(220, 220, 230, 0.8)',
    },
    platformButtonText: {
      color: isDark ? 'white' : '#000000',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    // Workout Details Styles
    detailsSection: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(60, 60, 67, 0.3)' : 'rgba(60, 60, 67, 0.1)',
    },
    detailsContainer: {
      marginTop: 16,
    },
    detailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      gap: 12,
    },
    detailItem: {
      minWidth: 100,
      backgroundColor: isDark ? 'rgba(60, 60, 67, 0.3)' : 'rgba(242, 242, 247, 0.9)',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(80, 80, 90, 0.3)' : 'rgba(220, 220, 230, 0.8)',
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? 'white' : '#000000',
    },
    descriptionContainer: {
      backgroundColor: isDark ? 'rgba(60, 60, 67, 0.3)' : 'rgba(242, 242, 247, 0.9)',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(80, 80, 90, 0.3)' : 'rgba(220, 220, 230, 0.8)',
    },
    descriptionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 15,
      lineHeight: 22,
      color: isDark ? 'white' : '#000000',
    },
  });

  if (expanded) {
    return (
      <View style={styles.expandedRoot}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header with gradient */}
          <View style={styles.gradientHeader}>
            {/* Pattern overlay for visual interest */}
            <View style={styles.headerPattern}>
              {/* We could add a pattern image here */}
            </View>
            
            <TouchableOpacity 
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={22} color={isDark ? 'white' : '#000000'} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{title}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather name="clock" size={16} color={isDark ? 'rgba(235, 235, 245, 0.8)' : 'rgba(60, 60, 67, 0.8)'} style={{marginRight: 6}} />
                <Text style={styles.headerSubtitle}>{time}</Text>
                <Text style={[styles.headerSubtitle, {marginHorizontal: 8}]}>•</Text>
                <Feather name="map-pin" size={16} color={isDark ? 'rgba(235, 235, 245, 0.8)' : 'rgba(60, 60, 67, 0.8)'} style={{marginRight: 6}} />
                <Text style={styles.headerSubtitle}>{location}</Text>
              </View>
            </View>
          </View>

          {/* Participants */}
          <View style={styles.participantsSection}>
            <View style={styles.sectionTitle}>
              <Ionicons name="people" size={20} color={brandStyle.tint} style={{marginRight: 8}} />
              <Text style={{fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: isDark ? 'white' : '#000000'}}>Participants</Text>
            </View>
            <View style={styles.participantsRow}>
              {participants.map((participant) => (
                <View 
                  key={participant.id} 
                  style={styles.participantItem}
                >
                  <View style={styles.participantAvatarContainer}>
                    <Image
                      source={{ uri: participant.avatar }}
                      style={styles.participantAvatar}
                    />
                  </View>
                  <Text style={styles.participantName}>
                    {participant.name.split(' ')[0]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Workout Details */}
          {(type || intensity || duration || description) && (
            <View style={styles.detailsSection}>
              <View style={styles.sectionTitle}>
                <Ionicons name="fitness" size={20} color={brandStyle.tint} style={{marginRight: 8}} />
                <Text style={{fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: isDark ? 'white' : '#000000'}}>Workout Details</Text>
              </View>
              
              <View style={styles.detailsContainer}>
                {/* Workout Type, Intensity, Duration */}
                <View style={styles.detailsRow}>
                  {type && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Type</Text>
                      <Text style={styles.detailValue}>{type}</Text>
                    </View>
                  )}
                  
                  {intensity && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Intensity</Text>
                      <Text style={styles.detailValue}>{intensity}</Text>
                    </View>
                  )}
                  
                  {duration && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{duration}</Text>
                    </View>
                  )}
                </View>
                
                {/* Description */}
                {description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Join buttons */}
          <View style={styles.platformsSection}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="connection" size={20} color={brandStyle.tint} style={{marginRight: 8}} />
              <Text style={{fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: isDark ? 'white' : '#000000'}}>Join through</Text>
            </View>
            <View style={styles.platformsGrid}>
              {platforms.map((platform) => {
                // Define icon name with proper type checking
                let iconName: "monitor" | "video" | "phone" = "monitor";
                if (platform.toLowerCase().includes("zoom")) iconName = "video";
                if (platform.toLowerCase().includes("phone")) iconName = "phone";
                
                return (
                  <TouchableOpacity
                    key={platform}
                    style={styles.platformButton}
                    activeOpacity={0.7}
                  >
                    <Feather name={iconName} size={18} color={brandStyle.tint} style={{marginBottom: 6}} />
                    <Text style={styles.platformButtonText}>{platform}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: animatedOpacity }]}>
      <BlurView intensity={isDark ? 20 : 50} tint={isDark ? 'dark' : 'light'} style={{ flex: 1 }}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 18 }}>{brandStyle.icon}</Text>
            </View>
            <View style={styles.textContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>
                  {title}
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>
                {time} · {location.includes("Barry's") ? `${location} Castro` : location}
              </Text>
            </View>
          </View>
          <View style={styles.avatarsRow}>
            {participants.slice(0, 3).map((participant, index) => (
              <View
                key={participant.id}
                style={[
                  styles.avatarContainer,
                  { marginLeft: index > 0 ? -8 : 0 }
                ]}
              >
                <Image
                  source={{ uri: participant.avatar }}
                  style={styles.avatarThumb}
                />
              </View>
            ))}
            {participants.length > 3 && (
              <View style={[styles.avatarContainer, { marginLeft: -8 }]}>
                <View style={styles.moreAvatars}>
                  <Text style={styles.moreAvatarsText}>
                    +{participants.length - 3}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

export default WorkoutCard;