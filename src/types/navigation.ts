export type RootStackParamList = {
  WorkoutFeed: undefined;
  WorkoutDetail: {
    workout: {
      id: string;
      title: string;
      time: string;
      location: string;
      participants: {
        id: string;
        name: string;
        avatar: string;
      }[];
      platforms: string[];
    };
  };
}; 