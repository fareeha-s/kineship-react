// kineship-react/app/App.tsx
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from '../src/context/AuthContext';
import Navigation from '../src/navigation';

// Import images
const images = {
  gracie: require('../assets/images/gracie.jpeg'),
  aiguo: require('../assets/images/aiguo.png'),
  moi: require('../assets/images/moi.jpg'),
  rani: require('../assets/images/rani.png'),
  shan: require('../assets/images/shan.png'),
  rolemodel: require('../assets/images/rolemodel.jpg'),
};

// Mock data can stay for now
export const mockWorkouts = [
  {
    id: '1',
    title: "Barry's - LIFT x RUN",
    time: '2:00 PM',
    location: "Barry's",
    participants: [
      { id: '1', name: 'Gracie', avatar: images.gracie },
      { id: '2', name: 'Rani', avatar: images.rani },
      { id: '3', name: 'Shan', avatar: images.shan },
    ],
    platforms: ['Strava', 'ClassPass'],
  },
  {
    id: '2',
    title: 'Marina Run Club',
    time: '8:00 AM',
    location: 'Marina',
    participants: [
      { id: '4', name: 'Aiguo', avatar: images.aiguo },
      { id: '5', name: 'Moi', avatar: images.moi },
      { id: '6', name: 'Rolemodel', avatar: images.rolemodel },
      { id: '7', name: 'Rani', avatar: images.rani },
    ],
    platforms: ['Strava'],
  },
  {
    id: '3',
    title: 'Sonora - Pilates II',
    time: '8:00 AM',
    location: 'Sonora',
    participants: [
      { id: '8', name: 'Moi', avatar: images.moi },
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