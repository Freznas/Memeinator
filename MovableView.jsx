import React, { useState, useRef } from 'react';
import { View, Text, PanResponder } from 'react-native';

export function MovableView({ startingX, startingY, enteredText, color }) {
    const [position, setPosition] = useState({ x: startingX, y: startingY });
    const [isVisible, setIsVisible] = useState(true);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return true; // Tillåt pan-respons
            },

            onPanResponderMove: (_, gestureState) => {
                const newX = position.x + gestureState.dx;
                const newY = position.y + gestureState.dy;

                // Kontrollera om texten är inom bildens gränser
                if (newX < 0 || newX +100 > 350 ||
                     newY < 0 || newY +50 > 350
                    ) {
                    setIsVisible(false); // Texten försvinner om den flyttas utanför bilden
                } else {
                    setIsVisible(true); // Texten syns om den är inom bilden
                    setPosition({ x: newX, y: newY }); // Uppdatera positionen
                }
            },
            onPanResponderRelease: () => {
                // Valfritt: spara den slutgiltiga positionen eller utför ytterligare åtgärder här
            }
        })
    ).current;

    return (
        <View
            {...panResponder.panHandlers}
            style={[styles.movableContainer, { left: position.x, top: position.y }]}
        >
            {isVisible && (
                <Text style={[styles.movableText, { color: color }]}>
                    {enteredText}
                </Text>
            )}
        </View>
    );
}

// Kom ihåg att definiera stilarna nedan
const styles = {
    movableContainer: {
        position: 'absolute',
    },
    movableText: {
        fontSize: 30
        // Här kan du definiera dina textstilar
    }
};
