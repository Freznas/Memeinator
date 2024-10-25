import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { FlatList } from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { ApiHandler } from "./ApiHandler";
import { LinearGradient } from "expo-linear-gradient";
import { DiscardButtonAnimation } from "./ButtonAnimation";
import ViewShot from 'react-native-view-shot'; // For capturing the view
import * as FileSystem from 'expo-file-system'; // For saving the file
import Slider from '@react-native-community/slider'; // Import required for implementing dummy slider
import { ColorPicker } from 'react-native-color-picker';
import { MovableView } from "./MovableView";

// Logo
const localImage = require("./assets/memeinator.png");


// Creating a invisible slider because color-picker required a slider component.see row: 273 (DO NOT TOUCH!)
const DummySlider = () => {
  return <View style={{ height: 0, width: 0 }} />;
};
export default DummySlider;

export function GenerateView() {
  // Retrieving data and fetchMemes() from ApiHandler
  const { data, fetchMemes } = ApiHandler();
  const [currentMeme, setCurrentMeme] = useState(null);
  const [texts, setTexts] = useState([]);
  const [textFieldsCount, setTextFieldsCount] = useState(0);
  const [imageSource, setImageSource] = useState(localImage);
  const [showTextInput, setShowTextInput] = useState(true);
  const [colors, setColors] = useState([]);
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [memes, setMemes] = useState([]);

  //Image Dimensions- sends to MovableView
  const [imgDim, setImgDim] = useState({x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0})


  const [imgRefSource, setImgRefSource] = useState("");

  // Referens to the image
  const imageRef = useRef(null);

  const imageAttributes = () => {
    if (imageRef.current) {
      imageRef.current.measure((x, y, width, height, pageX, pageY) => {

        setImgDim({x: x, y: y, width: width, height: height, pageX: pageX, pageY: pageY})
      });
    }
  };


  const viewShotRef = useRef(null); // Reference to capture the view

  useEffect(() => {
    const fetchTextFieldCount = () => {
     //number of textinputfields from API call 
    };
    fetchTextFieldCount();
    const responseCount = 0;
    // Update textFieldsCount with the response
    setTextFieldsCount(responseCount);
    setTexts(Array(responseCount).fill(""));
    fetchMemes();
    getMemesFromAsyncStorage();
  }, []);

  const handleTextChange = (text, index) => {
    const newTexts = [...texts];
    newTexts[index] = text;
    setTexts(newTexts);
  };

  const handleColorChange = (selectedColor, index) => {
    const newColors = [...colors];
    newColors[index] = selectedColor;
    setColors(newColors);
  };

  const openColorPicker = (index) => {
    setSelectedIndex(index); 
    setColorPickerVisible(true); 
  };

  const closeColorPicker = () => {
    setColorPickerVisible(false); 
  };

  //Clear the textArray on discard
  const handleDiscard = () => {
    setTexts(Array(textFieldsCount).fill(""));
    setCurrentMeme(null);
    setImageSource(localImage);
    setShowTextInput(false);
  };

  const saveNewMeme = async (newMeme) => {
    try {
      const storedMemes = await AsyncStorage.getItem("memesList");
      const memeList = storedMemes ? JSON.parse(storedMemes) : [];
      // Create array with new meme
      const updatedList = [...memeList, newMeme];
      // Put array in storage
      await AsyncStorage.setItem("memesList", JSON.stringify(updatedList));
      alert("Meme Saved!");
    } catch (error) {
      console.error("Error saving new meme:", error);
    }
  };

  const saveMeme = async () => {
    try {
     // Capture the view as a base64 image
         await viewShotRef.current.capture({
            format: 'jpg',
            quality: 0,
           // result: 'base64', // Store as base64 to save in AsyncStorage
            result: 'base64',
            snapshotContentContainer: true,
            useRenderInContext: true
          }).then(result => {
            const newMeme = {
                // Generating a unique id for each meme
                id: Date.now(),
                url: result,
                colors: colors,
              };
          
              saveNewMeme(newMeme);
              setMemes((prevMemes) => [...prevMemes, newMeme]);
          })
      } catch (error) {
        console.error('Error capturing and saving image:', error);
        Alert.alert('Error', 'Failed to capture and save image.');
      }
    };

  const getMemesFromAsyncStorage = async () => {
    try {
      // Get array from storage
      const storedMemes = await AsyncStorage.getItem("memesList");
      if (storedMemes !== null) {
        setMemes(JSON.parse(storedMemes));
        console.log(JSON.parse(storedMemes))
      }
    } catch (error) {
      console.error("Error retrieving memes:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#00D9E1", "#133CE3", "#8D4EFA"]} // Gradient colors for ba
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.container}
    >
        <Text style={styles.titleTextStyle}> Generate Your Own Memes </Text>

        <ViewShot ref = {viewShotRef}  style={styles.memeContainer} >
            {/* Sets the image to the chosen meme */}
            <Image

                source={imgRefSource ? { uri: imgRefSource } : imageSource}
                ref={imageRef} 
                onLoad={imageAttributes}

                style={styles.imageStyle}
                resizeMode="contain"

            />
          
             {texts.map((text, index ) => ( 


            //ImgDim sends via props to MovableView
              <MovableView key={index} style={styles.overlayText}
              startingX={ 0 } startingY={ 50 + index * 40 }
              enteredText={text} color={colors[index]} imgDim={imgDim} />


              
            ))}
        </ViewShot>
      
            <FlatList

            data={data}
            horizontal={true}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => {
                        setCurrentMeme(item);
                        setImgRefSource(item.url);                       
                        setTextFieldsCount(item.box_count);
                        setTexts(Array(item.box_count).fill(""));
                        setShowTextInput(true);
                        
                    }}
                >
                    <Image  source={{ uri: item.url }} style={styles.memeScroll} />
                </Pressable>
            )}
            ListEmptyComponent={<Text>Loading...</Text>}
            style={styles.listStyle}
        />
   
        <ScrollView style={styles.scrollView}>
            {/* Create number of textinputs based on the value of textFieldCount which is based on the API fetch */}
            {showTextInput &&
                Array.from({ length: textFieldsCount }).map((_, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <TextInput
                            style={[styles.textInput, { color: colors[index] }]}
                            placeholder={`Enter text ${index + 1}`}
                            value={texts[index]}
                            onChangeText={(text) => handleTextChange(text, index)}
                             
                        />
                        <LinearGradient
                            colors={['#f43b47', '#0ba360']} //Gradients for the colorpicker button.
                            style={styles.colorButtonGradient}
                        >
                            <Pressable style={styles.colorPickButton} onPress={() => openColorPicker(index)}>
                                <Text></Text>
                            </Pressable>
                        </LinearGradient>
                    </View>
                ))}
        </ScrollView>

        {isColorPickerVisible && (
          //Modal represents the pop-up window containing the colorPicker
            <Modal transparent={true} visible={isColorPickerVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.colorPickerContainer}>
                        <ColorPicker
                            onColorSelected={(colors) => {
                                handleColorChange(colors, selectedIndex);
                                closeColorPicker();
                            }}
                            style={{ flex: 1 }}
                            sliderComponent={DummySlider} // Here is the invisible colorSlider component.
                        />
                        <View style={styles.buttonsContainer}>
                            <Pressable
                                style={styles.colorButton}
                                onPress={() => [handleColorChange('#000000', selectedIndex),  closeColorPicker()]}                            >
                                <Text style={styles.colorButtonText}>Black</Text>
                            </Pressable>
                            <Pressable
                                style={styles.colorButton}
                                onPress={() => [handleColorChange('#FFFFFF', selectedIndex),  closeColorPicker()]}
                                                            >
                                <Text style={styles.colorButtonText}>White</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Pressable style={styles.closeButton} onPress={closeColorPicker}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
            
        )}

        <View style={styles.buttonContainer}>
        <DiscardButtonAnimation
          onPress={handleDiscard}
          buttonText="Discard"
          buttonStyle={styles.pressableStyle}
          textStyle={styles.buttonTextStyle}
        />

        <Pressable style={styles.pressableStyleSave} onPress={saveMeme}>
          <Text style={styles.buttonTextStyle}>Save</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({


//Style for the screen
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 20,

    },
    scrollView: {
        height: 150
    },

    //Style for title
    titleTextStyle: {
        marginTop: 30,
        marginBottom: 20,
        fontWeight: 'bold',
        color: 'white',
        fontSize: 25
    },

    //Style for the the generated meme with text.
    imageStyle: {
        width: 350,
        height: 350,
        resizeMode: 'cover'
    },
//Style for images in the fetched meme list 
    listImage: {
        width: 100,
        height: 100,
        marginHorizontal: 20,
    },
    //Style for the FlatList
    listStyle: {
        width: 300,
        height: 300,
        marginTop: 20,
        maxHeight: 120
    },
    
    memeContainer: {
        position: "relative",
        alignItems: "center",
       backgroundColor: "transparent"
            
    },

    overlayText: {
        position: "absolute",
        color: "black",
        fontSize: 25,
       backgroundColor: 'transparent',
        padding: 5,
        borderRadius: 5,
    },

    //Style for inputfields
    textInput: {
        height: 35,
        width: 200,
        padding: 10,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight:5
    },

    //Style for buttonContainer
    buttonContainer: {
        flexDirection: "row",
        width: '100%',
        height: 90,
        paddingTop: 10,
        justifyContent: "space-between"
    },

    //Style for buttons
    pressableStyle: {
        flex: 1,
        margin: 10,
        backgroundColor: "lightgray",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center"
    },

    pressableStyleSave: {
        flex: 1,
        margin: 10,
        backgroundColor: "#FFCF23",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center"
    },

    buttonTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    memeScroll: {
        margin: 10,
        marginBottom: 40,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
      backgroundColor: 'white'
    },

    colorPicker: {
        width: 50,
        height: 50,
        backgroundColor: '#D3D3D398',
        borderRadius: 35,
        marginTop: 25,

        
        //Black & White color buttons inside the color picker
    }, colorButton: {
        backgroundColor: "lightgray",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        margintop: 10,
       
    },
    
    //Open colorPicker button
    colorPickButton: {
        padding: 10,
        marginLeft: 10,
        borderRadius: 5,
        margintop: 15,
        height: 25,
      
    },
    //Gradient for the Open colorPicker button
    colorButtonGradient: {
        borderRadius: 100,
        padding: 1,
    },
  //Shadesout the background when opening the colorPicker Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
//ColorPicker container design
    colorPickerContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 0.5,
        justifyContent: 'center',
    },
    // Close button for colorPicker
    closeButton: {
        backgroundColor: "lightgray",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    //Texxt for close button
    closeButtonText: {
        color: 'black',
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '80%', 
    },
})

