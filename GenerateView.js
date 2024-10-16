import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react';
import {View, StyleSheet, Text, View,Button  } from 'react-native';
import React from "react";
export function GenerateView()
{
  var memes = []

//get the meme collection from storage if it exsists.
  useEffect(() =>{
    getMemes()
  });
  async function saveMeme(){
    
    var newMeme = {
        "id": "61579",
        "name": "One Does Not Simply",
        "url": "https://i.imgflip.com/1bij.jpg",
        "width": 568,
        "height": 335,
        "box_count": 2
    }
    memes.push(newMeme)

        try {
            await AsyncStorage.setItem('memesList', JSON.stringify(memes));
            console.log('Data saved');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    
}
async function getMemes()
{
        try {
            const storedMemes = await AsyncStorage.getItem('memesList');
            //handle data from storage
            if (storedMemes !== null) {
                const data = JSON.parse(storedMemes);
                console.log('Retrieved data:', data);
                memes =[... data]
            } else {
                console.log('thou art memeless');
            }
        } catch (error) {
            console.error('Error retrieving memes:', error);
        }
}

async function deleteAllMemes()
{
        try {
             await AsyncStorage.clear()
            console.log("Deleted all memes")
            memes = []
         } catch (error) {
                console.error('Error clearing storage:', error);
              }
}
return(
    <View>
            <Button title ="Save" onPress = {saveMeme} />
            <Button title ="GET" onPress = {getMemes} />
            <Button title ="DELETE" onPress = {deleteAllMemes} />
    </View>
)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
