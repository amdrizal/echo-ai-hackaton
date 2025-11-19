import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { GoalProvider } from './src/contexts/GoalContext';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <GoalProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </GoalProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
