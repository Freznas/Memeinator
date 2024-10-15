import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiHandler } from './ApiHandler';
import { View, Button } from 'react-native';

// TESTKOD
export function GenerateView({ navigation }) {

    return (
        <View>
            <Button title="Api" onPress={() => navigation.navigate('Api')}></Button>
        </View>
    )

}

// TESTKOD SLUT
