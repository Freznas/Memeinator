import React, { useRef } from 'react';
import { Text, Animated, StyleSheet} from 'react-native';
import { useState } from 'react';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

// npm install react-native-gesture-handler

export function MovableView({ setEnteredText, startingX, startingY }) {

    // Förflyttningarna i variabler om texten förflyttas 50 i X så är distanceX = 50 (längden på förflyttningssträckan)
    // useRef används istället för state då detta värde inte omrenderas vid ändring av det.
    // current sätter värdet till det angivna och är muterbart.
    const distanceX = useRef(new Animated.Value(0)).current;
    const distanceY = useRef(new Animated.Value(0)).current;

    // Utgångspositionen på texten
    /*  const startingX = 0;
     const startingY = 0; */

    // Senaste positionen - från början 0 eftersom vi inte har en senaste position
    const lastPosition = useRef({ x: 0, y: 0 }).current;

    const enteredText = setEnteredText

    // Eventet för förflyttningen - ska flyttas den sträcka vi drar till
    const gestureEvent = Animated.event(
        [{ nativeEvent: { translationX: distanceX, translationY: distanceY } }],
        { useNativeDriver: true }
    );

    function stateChangeHandler(event) {
        // 5 i detta fall representerar slutet av statet - alltså när du väl släpper musen i den nya positionen.
        if (event.nativeEvent.state === 5) {
            // Spara den nya positionen i den senaste positionen
            lastPosition.x += event.nativeEvent.translationX;
            lastPosition.y += event.nativeEvent.translationY;

            // translate X och Y måste sättas till 0 då detta nu är en redan gjord förflyttning.
            // offset sätts till nuvarande position i slutet av state - alltså lastOffset.
            distanceX.setOffset(lastPosition.x);
            distanceX.setValue(0);
            distanceY.setOffset(lastPosition.y);
            distanceY.setValue(0);
        }
    };



    return (
        <GestureHandlerRootView style={{ backgroundColor: 'transparent' }}>
            {/*  <TextInput placeholder='input' onChangeText={textInputHandler} multiline={true} ></TextInput> */}
            <PanGestureHandler onGestureEvent={gestureEvent} onHandlerStateChange={stateChangeHandler}>
                <Animated.View
                    style={[styles.movableContainer, {
                        // Animering av förflyttning.
                        // Animated har en inbyggd add()-funktion som adderar positionerna. Så den nya är ursprungliga + förflyttningen
                        transform: [
                            // Starting-värdena är fasta, men eventet uppdateras bakom kulisserna.
                            { translateX: Animated.add(distanceX, startingX) },
                            { translateY: Animated.add(distanceY, startingY) },
                        ],
                    },
                    ]}
                >
                    <Text>{enteredText ? enteredText : ""}</Text>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>

    );
};

const styles = StyleSheet.create({
    movableContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // För att inte skapa "tomma" views i GenerateView

    },
});

