import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { AppNavigator } from './navigation/AppNavigator';
import { WorkoutProvider } from './context/WorkoutContext';
import { paperTheme } from './theme/paperTheme';

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <WorkoutProvider>
        <AppNavigator />
      </WorkoutProvider>
    </PaperProvider>
  );
}