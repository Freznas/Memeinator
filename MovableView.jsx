import React, { useRef } from 'react';
import { Animated, View, StyleSheet, PanResponder, Text } from 'react-native';

export function MovableView({ enteredText, startingX, startingY, color, position }) {

    // https://reactnative.dev/docs/panresponder

    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: posX, dy: posY }], {
                useNativeDriver: false,

                // listener skickar vidare gestureState till check bounds nedan
                listener: (e, gestureState) => {
                    checkBounds(e, gestureState)
                    position({x: gestureState.moveX, y: gestureState.moveY})

                }
            }),
            onPanResponderRelease: () => {
                posX.extractOffset();
                posY.extractOffset();
            },
        }),
    ).current;

    // Kollar hårdkodade värden. Här behöver vi bildens position, bredd och höjd.
    // Alternativt göra bounds i GenerateView och skicka detta till GenerateView som ovan i properties.
    function checkBounds(_, gestureState) {
        if (gestureState.moveX > 680) {
            posX.setValue(0)
            posY.setValue(0)
        }
        if (gestureState.moveX < 350) {
            posX.setValue(0)
            posY.setValue(0)
        }
    }

    return (
        <View style={styles.movableContainer}>
            <Animated.View
                style={{
                    transform: [
                        { translateX: Animated.add(posX, startingX) },
                        { translateY: Animated.add(posY, startingY) }
                    ],
                }}
                {...panResponder.panHandlers}>
                <Text style={{ color: color }}>{enteredText ? enteredText : ""}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    movableContainer: {
        position: 'absolute', // För att inte skapa "tomma" views i GenerateView
    },

});

