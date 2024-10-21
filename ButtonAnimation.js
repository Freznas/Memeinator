import React, { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

export function DiscardButtonAnimation({ onPress, buttonText, buttonStyle, textStyle }) {
    
    const colorValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;

   
    const animateButton = () => {
        Animated.parallel([
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
            ]),
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.1, 
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1, 
                    duration: 100,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();
    };
    
    const handlePress = () => {
        animateButton()
        onPress(); 
    };

    
    const backgroundColorInterpolation = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['lightgray', 'red'],
    });

    return (
        <Animated.View style={{ flex: 1, margin: 10, borderRadius: 5, backgroundColor: backgroundColorInterpolation, transform: [{ scale: scaleValue }] }}>
            <Pressable
                onPress={handlePress}
                style={[buttonStyle, { backgroundColor: null }]}
            >
                <Text style={textStyle}>{buttonText}</Text>
            </Pressable>
        </Animated.View>
    );
}
