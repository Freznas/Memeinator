import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GenerateView } from "./GenerateView"
import { SavedView } from "./SavedView"
import { ApiHandler } from './ApiHandler';


export default function App() {

  // TESTKOD
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='GenerateView'>
        <Stack.Screen name='GenerateView' component={GenerateView} />
        <Stack.Screen name='Api' component={ApiHandler}/>
      </Stack.Navigator>

 

{
// TESTKOD SLUT

/*     <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Api" onPress={() => navigation.navigate('Api')}></Button>
      <StatusBar style="auto" />
    </View> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
