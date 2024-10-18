import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { ApiHandler } from "./ApiHandler";
import { LinearGradient } from "expo-linear-gradient";
import { DiscardButtonAnimation } from "./ButtonAnimation";

// Dummybild som används tillfälligt
const localImage = require("./assets/Image20240927091254.png");

// Skapar en array av dummybilden
const dummyImageData = new Array(10).fill(localImage);




export function GenerateView(){
    // Hämtar data och fetchMemes() från ApiHandler
    const { data, fetchMemes } = ApiHandler();
    const [currentMeme, setCurrentMeme] = useState(null)

    const [texts, setTexts] = useState([])
    const [textFieldsCount, setTextFieldsCount] = useState(0);
    const [imageSource, setImageSource] = useState(localImage);
    const [showTextInput, setShowTextInput] = useState(true)

    const [memes, setMemes] = useState([])
    useEffect(() =>{
        const fetchTextFieldCount = () => {
            //Antalet hämtas från API anrop
            const responseCount = 0
             // Uppdatera textFieldsCount med svaret
            setTextFieldsCount(responseCount)
            setTexts(Array(responseCount).fill(""));
        }
        fetchTextFieldCount()
        fetchMemes()
        getMemesFromAsyncStorage()
    },[]);

    const handleTextChange = (text, index) =>{
        // Kopia av textarrayen som skrivs i input
        const newTexts = [... texts] 
        // Uppdaterar texten i texts-arrayen på rätt index
        newTexts[index] = text 
        // Uppdaterar state med den nya texts-arrayen.
        setTexts(newTexts) 
    }
    //Nollställer textArrayen vid discard
    const handleDiscard = () =>{
        setTexts(Array(textFieldsCount).fill(""))
        setCurrentMeme(null)
        setImageSource(localImage)
        setShowTextInput(false)
    }


  const saveMemeInAsyncStorage = async () => {
    const memeToSave = { url: currentMeme.url, texts: texts };
    //create array with new meme
    const updatedMemes = [...memes, memeToSave];
    setMemes(updatedMemes);

    try {
      //Put array in storage
      await AsyncStorage.setItem("memesList", JSON.stringify(updatedMemes));
      console.log("Meme Saved!");
      alert("Meme Saved!");
    } catch (error) {
      console.error("Error saving Meme:", error);
    }
  };

  const getMemesFromAsyncStorage = async () => {
    try {
      //get array from storage
      const storedMemes = await AsyncStorage.getItem("memesList");
      if (storedMemes !== null) {
        setMemes(JSON.parse(storedMemes));
        console.log(
          "Retrieved memes from asyncStorage:",
          JSON.parse(storedMemes)
        );
      } else {
        console.log("Async Storage contains no memes");
      }
    } catch (error) {
      console.error("Error retrieving memes:", error);

    }
  };

 
  
  const deleteAllMemes = async () =>
  {
          try {
               await AsyncStorage.clear()
              console.log("Deleted all memes")
              setMemes([])
           } catch (error) {
                  console.error('Error clearing storage:', error);
                }
  }

  
    return(
        <LinearGradient
            colors={['#00D9E1', '#133CE3', '#8D4EFA']} // Gradient colors
            start={{x:0.3, y:0}}
            end={{x:0.7, y:1}}
            style={styles.container}
        > 

            <Text style={styles.titleTextStyle}> Generate Your Own Memes </Text>

            <View style={styles.memeContainer}>
            
            {/* Sätter bild till den meme du klickar på. Finns ingen, väljs dummybild - JH */}
            <Image 
                source={currentMeme
                    ?  { uri: currentMeme.url }
                    : imageSource} 
                style={styles.imageStyle} 
                resizeMode='contain'
            ></Image>

            {/* Varje text som skrivs i inputs målas upp ovanpå memebilden, just nu bara på olika höjder av bilden.
            Ska anpassas efter vilka kordinater som hämtas i APIn */}
            {texts.map((text, index ) => (
                <Text key={index} style={[styles.overlayText, { top: 100 + index * 40 }]}>
                    {text}
                </Text>


            ))}
            </View>
            {/* Fick flytta ut denna och ändra till scrollView på rad 78 då renderingen inte fungerade på ios - JH */}
            <View>
            <Text style={styles.underTitleTextStyle}>Choose Your Meme</Text>
            </View>

            
            <FlatList
                data={data} 
                horizontal={true} 
                keyExtractor={item => item.id.toString()} 
                renderItem={({ item }) => (
                    <Pressable 
                    onPress={() => {
                    setCurrentMeme(item); 
                    setTextFieldsCount(item.box_count)
                    setTexts(Array(item.box_count).fill(""))
                    setShowTextInput(true);}}>
                    <Image source={{ uri: item.url }} style={styles.memeScroll} />
                    </Pressable>)}
                ListEmptyComponent={<Text>Loading...</Text>} 
                style={styles.listStyle}
            ></FlatList>

              <ScrollView>
                {/* Skapar visst antal textinputs baserat på värdet av textfieldCount, detta baseras också på APIns hämtning. */}
            
              {showTextInput && Array.from({ length: textFieldsCount }).map((_, index) => (
                <TextInput
                    key={index}
                    style={styles.textInput}
                    placeholder={`Enter text ${index + 1}`}
                    value={texts[index]} 
                    onChangeText={(text) => handleTextChange(text, index)}
                />
            ))}
              </ScrollView>

            <View style={styles.buttonContainer}>
            
                <Pressable style={styles.pressableStyle} 
                onPress = { () =>  deleteAllMemes()}>
                <Text style={styles.buttonTextStyle}>Delete Storage</Text>
                </Pressable>

                <DiscardButtonAnimation 
                onPress={handleDiscard} 
                buttonText="Discard" 
                buttonStyle={styles.pressableStyle} 
                textStyle={styles.buttonTextStyle} 
                />

                <Pressable style={styles.pressableStyleSave} 
                onPress = { () =>  saveMemeInAsyncStorage()}>
                <Text style={styles.buttonTextStyle}>Save</Text>
                </Pressable>

            </View>
        </LinearGradient>
    );
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
        marginTop: 60,
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white',
        fontSize: 25
    },

    //Style för "choose your meme" text <-- Do we need this text here? - Juhee
    underTitleTextStyle: {
        marginTop: 20,
        fontWeight: 'normal',
        color: 'white',
        fontSize: 18
    },

    //Style för den bild som visar den skapade memen med text
    imageStyle: {
        width: 350,
        height: 350,
       
    },

  //Style för bilder i listan där hämtade memes visas
  listImage: {
    width: 100,
    height: 100,
    marginHorizontal: 20,
  },

  //Style för själva listan
  listStyle: {
    marginTop: 20,
    maxHeight: 100,
    maxWidth: 350,
  },

  //Style på container för att overlayText ska centreras med image
  memeContainer: {
    position: "relative",
    alignItems: "center",
  },

  //Style för texten ovanpå meme
  overlayText: {
    position: "absolute",
    color: "black",
    fontSize: 25,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
  },

  //Style för inputfields
  textInput: {
    width: 350,
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },

  //Style för buttonContainer
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 10,
    justifyContent: "space-between",
  },

  //Style för knappar
  pressableStyle: {
    flex: 1,
    margin: 10,
    backgroundColor: "lightgray",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },

  pressableStyleSave: {
    flex: 1,
    margin: 10,
    backgroundColor: "#FFCF23",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },

  buttonTextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  memeScroll: {
    margin: 10,
    marginBottom: 40,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
