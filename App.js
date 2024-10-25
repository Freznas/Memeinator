import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GenerateView } from "./GenerateView"; 
import { SavedView } from "./SavedView"; 


const Tab = createBottomTabNavigator();


// GitHub Länk:  https://github.com/Freznas/Memeinator.git 



const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
  },
};
//create the bottomTabNavigator to switch between the two pages.
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
          options={{ headerShown: false }} // Hides the header for "GenerateView"
        />
        <Tab.Screen
          name="Your memes"
          component={SavedView}
          options={{ headerShown: false }} // Hides the header for "SavedView"
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
