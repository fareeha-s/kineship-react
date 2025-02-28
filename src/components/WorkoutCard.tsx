// src/components/WorkoutCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
}

const getBrandStyles = (location: string, isDark: boolean) => {
  if (location.includes("Barry's")) {
    return {
      gradient: isDark 
        ? ['rgba(220, 38, 38, 0.2)', 'rgba(220, 38, 38, 0.05)']
        : ['rgba(220, 38, 38, 0.1)', 'rgba(220, 38, 38, 0.02)'],
      icon: '🏃‍♂️',
      iconBg: isDark ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.1)',
    };
  }
  if (location.includes('SoulCycle')) {
    return {
      gradient: isDark
        ? ['rgba(255, 226, 0, 0.15)', 'rgba(255, 226, 0, 0.02)']
        : ['rgba(255, 226, 0, 0.1)', 'rgba(255, 226, 0, 0.02)'],
      icon: '🚲',
      iconBg: isDark ? 'rgba(255, 226, 0, 0.2)' : 'rgba(255, 226, 0, 0.15)',
    };
  }
  // Default gradient
  return {
    gradient: isDark
      ? ['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.02)']
      : ['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.02)'],
    icon: '💪',
    iconBg: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
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
  isDark,
}) => {
  const brandStyle = getBrandStyles(location, isDark);
  const styles = StyleSheet.create({
    // Expanded View Styles
    expandedRoot: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#111827',
      zIndex: 50,
    },
    scrollContainer: {
      flex: 1,
    },
    gradientHeader: {
      height: 256,
      backgroundColor: brandStyle.gradient[0],
      padding: 16,
      paddingTop: 48,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(17, 24, 39, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContent: {
      position: 'absolute',
      bottom: 32,
      left: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(209, 213, 219, 0.8)',
      marginTop: 4,
    },
    // Card View Styles
    card: {
      marginHorizontal: 16,
      marginVertical: 6,
      paddingVertical: 20,
      backgroundColor: brandStyle.gradient[0],
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#fff',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.2 : 0.15,
      shadowRadius: 24,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.5)',
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 64,
      paddingRight: 8,
      paddingLeft: 16,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 0,
      backgroundColor: brandStyle.iconBg,
      shadowColor: isDark ? '#000' : brandStyle.gradient[0],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
    },
    textContent: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 4,
    },
    titleContainer: {
      marginBottom: 4,
    },
    subtitleContainer: {
      paddingVertical: 2,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.4,
      color: isDark ? 'rgba(243, 244, 246, 0.98)' : 'rgba(0, 0, 0, 0.8)',
    },
    cardSubtitle: {
      fontSize: 15,
      letterSpacing: -0.2,
      opacity: 0.7,
      color: isDark ? 'rgba(209, 213, 219, 0.7)' : 'rgba(102, 102, 102, 0.75)',
    },
    avatarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginLeft: -6,
    },
    avatarThumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: isDark ? '#000000' : '#ffffff',
    },
    moreAvatars: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#000000' : '#ffffff',
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
    },
    moreAvatarsText: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: -0.1,
      color: isDark ? '#F3F4F6' : '#4B5563',
    },
    // Expanded View Styles
    participantsSection: {
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    participantsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 32,
    },
    participantItem: {
      alignItems: 'center',
    },
    participantAvatarContainer: {
      padding: 4,
    },
    participantAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: 'white',
    },
    participantName: {
      color: 'white',
      marginTop: 8,
      fontSize: 14,
    },
    platformsSection: {
      padding: 24,
    },
    platformsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
      marginBottom: 16,
    },
    platformsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    platformButton: {
      flex: 1,
      minWidth: 120,
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    platformButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });

  if (expanded) {
    return (
      <View style={styles.expandedRoot}>
        <ScrollView style={styles.scrollContainer}>
          {/* Header with gradient */}
          <View style={styles.gradientHeader}>
            <TouchableOpacity 
              onPress={onBack}
              style={styles.backButton}
            >
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSubtitle}>{time} · {location}</Text>
            </View>
          </View>

          {/* Participants */}
          <View style={styles.participantsSection}>
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

          {/* Join buttons */}
          <View style={styles.platformsSection}>
            <Text style={styles.platformsTitle}>Join in through:</Text>
            <View style={styles.platformsGrid}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={styles.platformButton}
                >
                  <Text style={styles.platformButtonText}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 20 }}>{brandStyle.icon}</Text>
          </View>
          <View style={styles.textContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>
                {title}
              </Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.cardSubtitle}>
                {time} · {location.includes("Barry's") ? `${location} Castro` : location}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.avatarsRow}>
          {participants.slice(0, 3).map((participant, index) => (
            <View
              key={participant.id}
              style={[
                styles.avatarContainer,
                { marginLeft: index > 0 ? -6 : 0 }
              ]}
            >
              <Image
                source={{ uri: participant.avatar }}
                style={styles.avatarThumb}
              />
            </View>
          ))}
          {participants.length > 3 && (
            <View style={[styles.avatarContainer, { marginLeft: -6 }]}>
              <View style={styles.moreAvatars}>
                <Text style={styles.moreAvatarsText}>
                  +{participants.length - 3}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default WorkoutCard;