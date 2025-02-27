import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const { signIn, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="users" size={40} color="#dc2626" />
          </View>
          <Text style={styles.title}>Kineship</Text>
          <Text style={styles.subtitle}>
            Connect with friends through fitness
          </Text>
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={signIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://i.imgur.com/Dk4Lk8h.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.signInText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  signInButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
  },
  footerText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#dc2626',
    textDecorationLine: 'underline',
  },
});