import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, View,Button  } from 'react-native';
export function GenerateView()
{
  async function saveData(){
        const data = [
            { id: 1, name: 'Bulbasaur', type: 'Grass' },
            { id: 2, name: 'Charmander', type: 'Fire' },
            { id: 3, name: 'Squirtle', type: 'Water' },
        ];
    
        try {
            // Store the array of objects as a JSON string
            await AsyncStorage.setItem('pokemonList', JSON.stringify(data));
            console.log('Data saved');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    
}

async function getData()
{
        try {
            const jsonValue = await AsyncStorage.getItem('pokemonList');
            if (jsonValue !== null) {
                const data = JSON.parse(jsonValue);
                console.log('Retrieved data:', data);
            } else {
                console.log('No data found');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
}
return(
    <View>
            <Button title ="Save" onPress = {saveData} />
            <Button title ="GET" onPress = {getData} />
    </View>
)
}