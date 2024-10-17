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

const localImage = require("./assets/Image20240927091254.png");

export function GenerateView() {
  const { data, fetchMemes } = ApiHandler();
  const [currentMeme, setCurrentMeme] = useState(null);
  const [texts, setTexts] = useState([]);
  const [textFieldsCount, setTextFieldsCount] = useState(0);
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetchMemes();
    getMemesFromAsyncStorage();
  }, []);

  const handleTextChange = (text, index) => {
    const newTexts = [...texts];
    newTexts[index] = text;
    setTexts(newTexts);
  };

  const handleDiscard = () => {
    setTexts(Array(textFieldsCount).fill(""));
  };

  const saveMemeInAsyncStorage = async () => {
    const memeToSave = { url: currentMeme.url, texts: texts };
    const updatedMemes = [...memes, memeToSave];
    setMemes(updatedMemes);

    try {
      await AsyncStorage.setItem("memesList", JSON.stringify(updatedMemes));
      console.log("Meme Saved!");
      alert("Meme Saved!");
    } catch (error) {
      console.error("Error saving Meme:", error);
    }
  };

  const getMemesFromAsyncStorage = async () => {
    try {
      const storedMemes = await AsyncStorage.getItem("memesList");
      if (storedMemes !== null) {
        setMemes(JSON.parse(storedMemes));
        console.log(
          "Retrieved memes from asyncStorage:",
          JSON.parse(storedMemes)
        );
      }
    } catch (error) {
      console.error("Error retrieving memes:", error);
    }
  };

  const deleteAllMemes = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Deleted all memes");
      setMemes([]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#00D9E1", "#133CE3", "#8D4EFA"]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.titleTextStyle}> Generate Your Own Memes </Text>

      <View style={styles.memeContainer}>
        <Image
          source={currentMeme ? { uri: currentMeme.url } : localImage}
          style={styles.imageStyle}
        />
        {texts.map((text, index) => (
          <Text
            key={index}
            style={[styles.overlayText, { top: 100 + index * 40 }]}
          >
            {text}
          </Text>
        ))}
      </View>

      <View>
        <Text style={styles.underTitleTextStyle}>Choose Your Meme</Text>
      </View>

      <ScrollView horizontal={true} style={styles.listStyle}>
        {data ? (
          data.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setCurrentMeme(item), setTextFieldsCount(item.box_count);
                setTexts(Array(item.box_count).fill(""));
              }}
            >
              <Image source={{ uri: item.url }} style={styles.memeScroll} />
            </Pressable>
          ))
        ) : (
          <Text>Loading</Text>
        )}
      </ScrollView>

      <ScrollView>
        {Array.from({ length: textFieldsCount }).map((_, index) => (
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
        <Pressable
          style={styles.pressableStyle}
          onPress={() => deleteAllMemes()}
        >
          <Text style={styles.buttonTextStyle}>Delete Storage</Text>
        </Pressable>

        <Pressable style={styles.pressableStyle} onPress={handleDiscard}>
          <Text style={styles.buttonTextStyle}>Discard</Text>
        </Pressable>

        <Pressable
          style={styles.pressableStyleSave}
          onPress={() => saveMemeInAsyncStorage()}
        >
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
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
  },

  //Style för "choose your meme" text <-- Do we need this text here? - Juhee
  underTitleTextStyle: {
    marginTop: 20,
    fontWeight: "normal",
    color: "white",
    fontSize: 18,
  },

  //Style för den bild som visar den skapade memen med text
  imageStyle: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "white",
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
    maxHeight: 120,
    maxWidth: 120,
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
