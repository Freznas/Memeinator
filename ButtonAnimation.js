import React, { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

export function DiscardButtonAnimation({ onPress, buttonText, buttonStyle, textStyle }) {
    
    const colorValue = useRef(new Animated.Value(0)).current;

   
    const animateBackgroundColor = () => {
        Animated.sequence([
            Animated.timing(colorValue, {
                toValue: 1, 
                duration: 200,
                useNativeDriver: false, 
            }),
            Animated.timing(colorValue, {
                toValue: 0, 
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    
    const handlePress = () => {
        animateBackgroundColor();
        onPress(); 
    };

    
    const backgroundColorInterpolation = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['lightgray', 'red'],
    });

    return (
        <Animated.View style={{ flex: 1, margin: 10, backgroundColor: backgroundColorInterpolation }}>
            <Pressable
                onPress={handlePress}
                style={[buttonStyle, { backgroundColor: null }]}
            >
                <Text style={textStyle}>{buttonText}</Text>
            </Pressable>
        </Animated.View>
    );
}
