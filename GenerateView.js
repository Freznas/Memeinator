import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function GenerateView() {
  return (
    <View style={styles.container}>
      <Text>Here you can choose templates to create your own Meme!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
