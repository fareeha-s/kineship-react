import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarView from '../src/screens/CalendarView';

export default function CalendarScreen() {
  return <CalendarView />;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  }
});