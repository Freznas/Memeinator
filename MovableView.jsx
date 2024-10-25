import React, { useState, useRef } from 'react';
import { View, Text, PanResponder,Animated } from 'react-native';

export function MovableView({ enteredText, startingX, startingY, color, imgDim }) {

    // https://reactnative.dev/docs/panresponder

    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: posX, dy: posY }], {
                useNativeDriver: false,

              
                //Listener sends the gestureState to the Checkbounds(see row 33)
                listener: (e, gestureState) => {
                    checkBounds(e, gestureState)
                }
            }),
            onPanResponderRelease: () => {
                posX.extractOffset();
                posY.extractOffset();
            }
            })
            
    ).current;


    //Checks bounds for MovableView when moving the text.
    function checkBounds(_, gestureState) {
        if (gestureState.moveX > imgDim.pageX + imgDim.width ||
            gestureState.moveX < imgDim.pageX) {
            posX.setValue(0)
            posY.setValue(0)
        }
        if (gestureState.moveY > imgDim.pageY + imgDim.height ||
            gestureState.moveY < imgDim.pageY) {
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
                <Text style={{ color: color , fontSize: 20 }}>{enteredText ? enteredText : ""}</Text>
            </Animated.View>

        </View>
    );
}

const styles = {
    movableContainer: {
        position: 'absolute',
    },
   
};
