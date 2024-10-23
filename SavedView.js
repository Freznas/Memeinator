import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

export function SavedView() {
  const [memeList, setMemeList] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);

  // A function to load existing memes from AsyncStorage
  const loadMemes = async () => {
    try {
      const storedMemes = await AsyncStorage.getItem("memesList");
      if (storedMemes !== null) {
        setMemeList(JSON.parse(storedMemes));
      }
    } catch (error) {
      console.error("Error loading memes:", error);
    }
  };

  // Ensure memes are loaded every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadMemes();
    }, [])
  );

  // Modified delete function to delete a meme by its unique ID
  const deleteMeme = (meme) => {
    if (Platform.OS === "web") {
      // Use window.confirm for web
      if (window.confirm("Are you sure you want to delete this meme?")) {
        const updatedList = memeList.filter((item) => item.id !== meme.id);
        setMemeList(updatedList); // Update the state
        saveMemesToStorage(updatedList); // Save updated meme list to AsyncStorage
        if (selectedMeme === meme) {
          setSelectedMeme(null); // Reset selection if the deleted meme was selected
        }
        console.log(`${meme.url} Deleted`);
      }
    } else {
      // Use Alert for iOS and Android
      Alert.alert(
        "Delete Meme",
        "Are you sure you want to delete this meme?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              const updatedList = memeList.filter(
                (item) => item.id !== meme.id
              );
              setMemeList(updatedList); // Update the state
              saveMemesToStorage(updatedList); // Save updated meme list to AsyncStorage
              if (selectedMeme === meme) {
                setSelectedMeme(null); // Reset selection if the deleted meme was selected
              }
              console.log(`${meme.url} Deleted`);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Save the updated meme list to AsyncStorage
  const saveMemesToStorage = async (updatedList) => {
    try {
      await AsyncStorage.setItem("memesList", JSON.stringify(updatedList));
    } catch (error) {
      console.error("Error saving memes:", error);
    }
  };

  // Select/deselect a meme
  const toggleSelectMeme = (meme) => {
    setSelectedMeme((prevSelected) => (prevSelected === meme ? null : meme));
  };

  return (
    <LinearGradient
      colors={["#00D9E1", "#133CE3", "#8D4EFA"]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {memeList.map((meme, index) => (
          <View key={index} style={styles.itemContainer}>
            <Pressable onPress={() => toggleSelectMeme(meme)}>
              <Image source={{ uri: meme.url }} style={styles.image} />
              {selectedMeme === meme && (
                <View style={styles.overlay}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => deleteMeme(meme)}
                  >
                    <Icon name="trash" size={24} color="#fff" />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => downloadMeme(meme.url)}
                  >
                    <Icon name="download" size={24} color="#fff" />
                  </Pressable>
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  itemContainer: {
    margin: 10,
    position: "relative",
    borderRadius: 10,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
  },
});
