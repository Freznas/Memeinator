import { useState, useEffect } from "react"
import {StyleSheet, View, ScrollView, Image, Text, Pressable } from 'react-native';


export function ApiHandler() {

    const [data, setData] = useState(null)
    const [currentMeme, setMeme] = useState(null)

    useEffect(() => {
        fetchMemes()
        printMeme()
    }, [])

    function fetchMemes() {
        const baseUrl = "https://api.imgflip.com/get_memes"
        fetch(baseUrl)
            .then(response => response.json())
            .then(json => {
                if (json.success && Array.isArray(json.data.memes)) {
                    let memeData = json.data.memes
                    setData(memeData)
                }
            })
            .catch(err => console.error('Error: ', err));
    }

    function printMeme() {
        if(currentMeme != null) {
            console.log(currentMeme)
        } 
    }

    return (
        <View style={{backgroundColor: "lightgreen" }}>
            <ScrollView horizontal>
                {
                    data ? (data.map(item => (<Pressable key={item.id} onPress={setMeme}><Image source={{ uri: item.url }} style={styles.memeScroll} /></Pressable>)))
                        : (<Text>Loading</Text>)

                }
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({

    memeScroll: {
      margin: 20, 
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 5,
      width: 150, 
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    }
  
    });