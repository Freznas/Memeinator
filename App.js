
//Import dependencies & modules from react/react-native
import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
//Import local modules
import { GenerateView } from "./GenerateView"; // Importera GenerateView
import { SavedView } from "./SavedView"; // Importera SavedView


const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Generator") {
              iconName = "build";
            } else if (route.name === "Your memes") {
              iconName = "save";
            }

            return <Icon name={iconName} size={size} color={color} />
          },
          tapBarActiveTintColor: MyTheme.colors.primary,
          tapBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#C6F5FF',
          },
        })}
      >
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
