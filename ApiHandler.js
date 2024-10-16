import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Image, Text, Pressable } from 'react-native';


export function ApiHandler() {

    const [data, setData] = useState(null)
    const [currentMeme, setCurrentMeme] = useState(null)

    useEffect(() => {
        fetchMemes()
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

    return (
        <View style={{ backgroundColor: "lightgreen" }}>
            <ScrollView horizontal>
                {
                    data ? (data.map(item => (<Pressable key={item.id} onPress={() => setCurrentMeme(item)}><Image source={{ uri: item.url }} style={styles.memeScroll} /></Pressable>)))
                        : (<Text>Loading</Text>)

                }

            </ScrollView>

            <Text style={{margin: 20, textAlign: 'center', fontSize: 24, backgroundColor: 'pink'}}>
                {currentMeme
                    ? `Du har tryckt på:\nid: ${currentMeme.id} \nname: ${currentMeme.name} \nurl: ${currentMeme.url}`
                    : 'Tryck på en bild!'}
            </Text>

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