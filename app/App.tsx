// kineship-react/app/App.tsx
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from '../src/context/AuthContext';
import Navigation from '../src/navigation';

// Mock data can stay for now
export const mockWorkouts = [
  {
    id: '1',
    title: "Barry's - LIFT x RUN",
    time: '2:00 PM',
    location: "Barry's",
    participants: [
      { id: '1', name: 'Gracie', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Rani', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Shan', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    platforms: ['Strava', 'ClassPass'],
  },
  {
    id: '2',
    title: 'Marina Run Club',
    time: '8:00 AM',
    location: 'Marina',
    participants: [
      { id: '4', name: 'Aiguo', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Moi', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '6', name: 'Rolemodel', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: '7', name: 'Rani', avatar: 'https://i.pravatar.cc/150?img=7' },
    ],
    platforms: ['Strava'],
  },
  {
    id: '3',
    title: 'Sonora - Pilates II',
    time: '8:00 AM',
    location: 'Sonora',
    participants: [
      { id: '8', name: 'Moi', avatar: 'https://i.pravatar.cc/150?img=8' },
    ],
    platforms: ['MindBody'],
  },
];

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}