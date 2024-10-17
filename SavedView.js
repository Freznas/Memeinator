// import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';

// Import images from the assets folder
import image1 from "./assets/01.jpg";
import image2 from "./assets/02.jpg";
import image3 from "./assets/03.jpg";
import image4 from "./assets/04.jpg";

export function SavedView({ navigation }) {
  // Array of images to display
  const images = [image1, image2, image3, image4];

  return (
    <LinearGradient
            colors={['#00D9E1', '#133CE3', '#8D4EFA']} // Gradient colors
            start={{x:0.3, y:0}}
            end={{x:0.7, y:1}}
            style={styles.container}
        >

    <ScrollView contentContainerStyle={styles.container}>
      {images.map((image, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image source={image} style={styles.image} />
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => {
                /* Handle delete */
                console.log(`Delete image ${index + 1}`);
              }}
            >
              <Text style={styles.iconText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* Handle download */
                console.log(`Download image ${index + 1}`);
              }}
            >
              <Text style={styles.iconText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eee",
    marginBottom: 20,
    padding: 10,
  },
  image: {
    height: 100,
    width: 100,
    objectFit: "cover",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 120,
  },
  iconText: {
    fontSize: 16,
    color: "black",
    marginHorizontal: 10,
  },
});
