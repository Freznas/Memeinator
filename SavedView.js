import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

// Import images from the assets folder and map them to their names
const imageAssets = {
  "01.jpg": require("./assets/01.jpg"),
  "02.jpg": require("./assets/02.jpg"),
  "03.jpg": require("./assets/03.jpg"),
  "04.jpg": require("./assets/04.jpg"),
  "05.jpg": require("./assets/05.jpg"),
  "06.jpg": require("./assets/06.jpg"),
  "07.jpg": require("./assets/07.jpg"),
  "08.jpg": require("./assets/08.jpg"),
  "09.jpg": require("./assets/09.jpg"),
  "10.jpg": require("./assets/10.jpg"),
  "11.jpg": require("./assets/11.jpg"),
  "12.jpg": require("./assets/12.jpg"),
  "13.jpg": require("./assets/13.jpg"),
  "14.jpg": require("./assets/14.jpg"),
  "15.jpg": require("./assets/15.jpg"),
  "16.jpg": require("./assets/16.jpg"),
};

export function SavedView() {
  const [memesList, setMemesList] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem("memesList");
        if (storedPhotos !== null) {
          setMemesList(JSON.parse(storedPhotos));
        } else {
          const defaultPhotos = [
            "01.jpg",
            "02.jpg",
            "03.jpg",
            "04.jpg",
            "05.jpg",
            "06.jpg",
            "07.jpg",
            "08.jpg",
            "09.jpg",
            "10.jpg",
            "11.jpg",
            "12.jpg",
            "13.jpg",
            "14.jpg",
            "15.jpg",
            "16.jpg",
          ];
          setMemesList(defaultPhotos);
          await AsyncStorage.setItem(
            "memesList",
            JSON.stringify(defaultPhotos)
          );
        }
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    const savePhotos = async () => {
      try {
        await AsyncStorage.setItem("memesList", JSON.stringify(memesList));
      } catch (error) {
        console.error("Error saving photos:", error);
      }
    };

    savePhotos();
  }, [memesList]);

  const deletePhoto = (imageName) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setMemesList((prevList) =>
            prevList.filter((item) => item !== imageName)
          );
          if (selectedPhoto === imageName) {
            setSelectedPhoto(null);
          }
          console.log(`Deleted image ${imageName}`);
        },
      },
    ]);
  };

  const downloadPhoto = (imageName) => {
    Alert.alert("Download", `Downloading image ${imageName}`);
    console.log(`Download image ${imageName}`);
  };

  const toggleSelectPhoto = (imageName) => {
    setSelectedPhoto((prevSelected) =>
      prevSelected === imageName ? null : imageName
    );
  };

  return (
    <LinearGradient
      colors={["#00D9E1", "#133CE3", "#8D4EFA"]} // Gradient colors
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {memesList.map((imageName, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleSelectPhoto(imageName)}>
              <Image source={imageAssets[imageName]} style={styles.image} />
              {selectedPhoto === imageName && (
                <View style={styles.overlay}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => deletePhoto(imageName)}
                  >
                    <Icon name="trash" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => downloadPhoto(imageName)}
                  >
                    <Icon name="download" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
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
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "150px",
    marginBottom: 10,
    position: "relative",
    borderRadius: 10,
  },
  image: {
    height: 150,
    width: "100%",
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
  },
});
