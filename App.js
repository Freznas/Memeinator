
//Import dependencies & modules from react/react-native
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//Import local modules
import { GenerateView } from "./GenerateView"; // Importera GenerateView
import { SavedView } from "./SavedView"; // Importera SavedView


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Generator"
          component={GenerateView}
          options={{ headerShown: false }} // Döljer Headern för "GenerateView" -JB
        />
        <Tab.Screen
          name="Your memes"
          component={SavedView}
          options={{ headerShown: false }} // Döljer Headern för "SavedView" -JB
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
