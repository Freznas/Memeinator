//Import dependencies & modules from react/react-native
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Import local modules
import { GenerateView } from './GenerateView'; // Importera GenerateView
import { SavedView } from './SavedView';       // Importera SavedView

// Create tab navigator instance
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Generate"
          component={GenerateView}
          options={{ headerShown: false }} // Hides the header for the "Generate"View
        />
        <Tab.Screen
          name="Saved"
          component={SavedView}
          options={{ headerShown: false }} // Hides the header for the "Saved"View
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
