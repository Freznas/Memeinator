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

export default function SavedView() {
  // State to hold the list of photos
  const [photoList, setPhotoList] = useState([]);
  // State to hold the currently selected photo
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Load photo list from AsyncStorage or initialize with default images
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Retrieve stored photos from AsyncStorage
        const storedPhotos = await AsyncStorage.getItem("photoList");
        if (storedPhotos !== null) {
          // If photos exist in storage, parse and set them to state
          setPhotoList(JSON.parse(storedPhotos));
        } else {
          // If no photos are stored, initialize with default images
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
          setPhotoList(defaultPhotos);
          // Save the default photos to AsyncStorage for future use
          await AsyncStorage.setItem(
            "photoList",
            JSON.stringify(defaultPhotos)
          );
        }
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };

    loadPhotos();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Save photo list to AsyncStorage whenever it changes
  useEffect(() => {
    const savePhotos = async () => {
      try {
        // Save the current photoList to AsyncStorage
        await AsyncStorage.setItem("photoList", JSON.stringify(photoList));
      } catch (error) {
        console.error("Error saving photos:", error);
      }
    };

    savePhotos();
  }, [photoList]); // Dependency array includes photoList; runs whenever photoList changes

  // Function to delete a photo
  const deletePhoto = (imageName) => {
    // Display a confirmation alert to the user
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // Update the photo list by filtering out the deleted photo
          setPhotoList((prevList) =>
            prevList.filter((item) => item !== imageName)
          );
          // Clear selected photo if it was the one deleted
          if (selectedPhoto === imageName) {
            setSelectedPhoto(null);
          }
          console.log(`Deleted image ${imageName}`);
        },
      },
    ]);
  };

  // Function to download a photo (placeholder implementation)
  const downloadPhoto = (imageName) => {
    Alert.alert("Download", `Downloading image ${imageName}`);
    console.log(`Download image ${imageName}`); // Log the download action
  };

  // Function to toggle the selection of a photo
  const toggleSelectPhoto = (imageName) => {
    setSelectedPhoto(
      (prevSelected) => (prevSelected === imageName ? null : imageName) // Toggle selection
    );
  };

  // Render the component
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {photoList.map((imageName, index) => (
        <View key={index} style={styles.itemContainer}>
          <TouchableOpacity onPress={() => toggleSelectPhoto(imageName)}>
            <Image source={imageAssets[imageName]} style={styles.image} />
            {selectedPhoto === imageName && (
              <View style={styles.overlay}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => deletePhoto(imageName)} // Delete button
                >
                  <Icon name="trash" size={24} color="#fff" /> // Trash icon
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => downloadPhoto(imageName)} // Download button
                >
                  <Icon name="download" size={24} color="#fff" /> // Download
                  icon
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "48%",
    marginBottom: 10,
    position: "relative", // Position relative to allow overlay positioning
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 10, // Add padding around buttons
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white background
    borderRadius: 30, // Rounded corners for buttons
  },
});
