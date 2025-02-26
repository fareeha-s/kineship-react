import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerShown: false  // Hide all headers by default
    }}>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="workout/[id]" 
        options={{
          headerShown: false  // Hide header for workout detail too
        }}
      />
    </Stack>
  );
} 