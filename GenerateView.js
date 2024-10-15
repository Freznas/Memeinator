import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, StyleSheet, Image, TextInput} from "react-native";
import { FlatList } from 'react-native';
import { useState, useEffect} from 'react';

// Dummybild som används tillfälligt
const localImage = require("./assets/Image20240927091254.png")

// Skapar en array av dummybilden
const dummyImageData = new Array(10).fill(localImage);

export function GenerateView(){

    const [texts, setTexts] = useState([])
    const [textFieldsCount, setTextFieldsCount] = useState(0);

    
    useEffect(() =>{
        const fetchTextFieldCount = () => {
            //Antalet hämtas från API anrop
            const responseCount = 2;
             // Uppdatera textFieldsCount med svaret
            setTextFieldsCount(responseCount)
            setTexts(Array(responseCount).fill(""));
        }
        fetchTextFieldCount()
    },[]);
    const handleTextChange = (text, index) =>{
        const newTexts = [... texts]
        newTexts[index] = text
        setTexts(newTexts)
    }

    return(
        <View style={[styles.container]}>

            <Text style={styles.titleTextStyle}> Generate Your Own Memes </Text>

            <View style={styles.memeContainer}>
            <Image 
                source={localImage} 
                style={styles.imageStyle} 
            ></Image>
            {texts.map((text, index ) => (
                <Text key={index} style={[styles.overlayText, { top: 100 + index * 40 }]}>
                    {text}
                </Text>


            ))}
            

            </View>

            <Text style={styles.underTitleTextStyle}>Choose Your Meme</Text>

            <FlatList
              // Data för listan (bilder)
              data={dummyImageData} 
              // Rendera varje bild i listan
              renderItem={({ item }) => (
                  <Image 
                      source={item} 
                      style={styles.listImage} 
                      resizeMode="contain"
                  />
              )}
              horizontal
              style={styles.listStyle}
              
              />

            {Array.from({ length: textFieldsCount }).map((_, index) => (
                <TextInput
                    key={index}
                    style={styles.textInput}
                    placeholder={`Enter text ${index + 1}`}
                    value={texts[index]} 
                    onChangeText={(text) => handleTextChange(text, index)}
                />
            ))}
                


        </View>




    )


}

const styles = StyleSheet.create({
    //Style för hela skärmen
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 20,
        
    },
    //Style för titeln
    titleTextStyle: {
        marginTop: 20
    },
    //Style för "choose your meme" text
    underTitleTextStyle: {
        marginTop: 20
    },
    //Style för den bild som visar den skapade memen med text
    imageStyle: {
        width: 250,
        height: 250,
        marginTop: 20, 
        borderWidth: 2,
        borderColor: "black"
    },
    //Style för bilder i listan där hämtade memes visas
    listImage : {
        width: 100, 
        height: 100,
        marginHorizontal: 5, 
    },
    //Style för själva listan
    listStyle: {
        marginTop: 20,
        maxHeight: 120 
    },
    //
    memeContainer: {
        position: "relative",
        alignItems: "center",
    
    },
    overlayText: {
        position: 'absolute',
        color: 'black',
        fontSize: 25,
        backgroundColor: 'transparent',
        padding: 5,
        borderRadius: 5,
        
    },
    textInput: {
        width: '100%',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
})