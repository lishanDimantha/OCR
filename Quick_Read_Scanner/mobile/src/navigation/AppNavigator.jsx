import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen       from '../screens/HomeScreen';
import CameraScreen     from '../screens/CameraScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import ResultScreen     from '../screens/ResultScreen';
import ErrorScreen      from '../screens/ErrorScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#185FA5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Prescription OCR' }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Scan Prescription' }}
        />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ title: 'Reading...', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Digital Prescription' }}
        />
        <Stack.Screen
          name="Error"
          component={ErrorScreen}
          options={{ title: 'Error' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}