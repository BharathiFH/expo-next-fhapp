import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const HoverGradient = ({ isHovered, cursorX, cursorY, style }) => {
    const hoverGradientOpacity = useSharedValue(0);
    const gradientX = useSharedValue(0);
    const gradientY = useSharedValue(0);
    const buttonWidth = useSharedValue(0);
    const buttonHeight = useSharedValue(0);

    useEffect(() => {
        isHovered
            ? (hoverGradientOpacity.value = withTiming(1, { duration: 100 }))
            : (hoverGradientOpacity.value = withTiming(0, { duration: 100 }));
        gradientX.value = (cursorX / buttonWidth.value) * 100;
        gradientY.value = (cursorY / buttonHeight.value) * 100;
    }, [buttonHeight, buttonWidth, cursorX, cursorY, gradientX, gradientY, hoverGradientOpacity, isHovered]);

    const handleLayout = useCallback(
        (event) => {
            const { width, height } = event.nativeEvent.layout;
            buttonWidth.value = width;
            buttonHeight.value = height;
        },
        [buttonWidth, buttonHeight]
    );

    const animatedGradientStyle = useAnimatedStyle(() => {
        return {
            background: `radial-gradient(circle ${buttonHeight.value * 2}px at ${gradientX.value}% ${gradientY.value}%, rgba(240, 212, 35,${
                hoverGradientOpacity.value
            }) 0%,rgba(0,0,0,0) 100%)`
        };
    });

    return (
        <Animated.View
            nativeID={'hover-gradient'}
            onLayout={handleLayout}
            style={[{ ...StyleSheet.absoluteFill }, animatedGradientStyle, style]}
        />
    );
};

export default HoverGradient;
