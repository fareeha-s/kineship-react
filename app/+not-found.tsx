import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '../src/components/ui/ThemedText';
import { ThemedView } from '../src/components/ui/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.main}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="h1">Oops!</ThemedText>
          </ThemedView>
          <ThemedText type="h2">This screen doesn't exist.</ThemedText>
          <ThemedText type="body">
            Hit the back button to go to the previous screen.
          </ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="body">Go to home screen!</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  main: {
    // Add styles here if needed
  },
  titleContainer: {
    // Add styles here if needed
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
