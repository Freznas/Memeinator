import React, { useRef } from 'react';
import { Animated, View, StyleSheet, PanResponder, Text } from 'react-native';

export function MovableView({ enteredText, startingX, startingY }) {

    // https://reactnative.dev/docs/panresponder

    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: posX, dy: posY }], { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                posX.extractOffset();
                posY.extractOffset();
            },
        }),
    ).current;

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
                <Text>{enteredText ? enteredText : ""}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    movableContainer: {
        position: 'absolute', // För att inte skapa "tomma" views i GenerateView
    },

});

