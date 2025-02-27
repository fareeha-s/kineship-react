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
}) => {
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
    <View style={[
      styles.card,
      {
        shadowColor: isDark ? '#000' : '#000',
      }
    ]}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Icon name="users" size={24} color="white" />
          </View>
          <View style={styles.textContent}>
            <Text style={[
              styles.cardTitle,
              { color: isDark ? 'white' : '#111827' }
            ]}>
              {title}
            </Text>
            <Text style={[
              styles.cardSubtitle,
              { color: isDark ? '#9ca3af' : '#6b7280' }
            ]}>
              {time} · {location}
            </Text>
          </View>
        </View>
        <View style={styles.avatarsRow}>
          {participants.slice(0, 3).map((participant, index) => (
            <View
              key={participant.id}
              style={[
                styles.avatarContainer,
                { marginLeft: index > 0 ? -12 : 0 }
              ]}
            >
              <Image
                source={{ uri: participant.avatar }}
                style={styles.avatarThumb}
              />
            </View>
          ))}
          {participants.length > 3 && (
            <View style={[styles.avatarContainer, { marginLeft: -12 }]}>
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

const { width } = Dimensions.get('window');

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
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
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
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginLeft: 0,
  },
  avatarThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#f3f4f6',
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  moreAvatarsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
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

export default WorkoutCard;