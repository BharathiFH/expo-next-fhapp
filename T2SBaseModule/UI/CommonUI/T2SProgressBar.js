import React, { useEffect, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import tinycolor from 'tinycolor2';
import { Colors } from '../../Themes';

const T2SProgressBar = ({ color = Colors.primaryColor, style }) => {
    const { width } = Dimensions.get('window');
    const FOREGROUND_BAR_WIDTH = width / 2;
    const DURATION = 1200;
    const translateX = useSharedValue(-FOREGROUND_BAR_WIDTH);

    const { backgroundColor, foregroundColor } = useMemo(() => {
        return {
            backgroundColor: tinycolor(color).lighten(30).toHexString(),
            foregroundColor: color
        };
    }, [color]);

    useEffect(() => {
        // withRepeat to repeat the animation
        translateX.value = withRepeat(
            // withDelay to add a delay to our animation
            withDelay(
                DURATION / 2,
                withTiming(width, {
                    duration: DURATION
                })
            ),
            // Set number of repetitions to -1 to loop indefinitely
            -1
        );
    }, [translateX, width]);

    const foregroundBarAnimation = useAnimatedStyle(() => {
        return {
            width: FOREGROUND_BAR_WIDTH,
            height: '100%',
            transform: [{ translateX: translateX.value }]
        };
    });

    return (
        <View
            style={[
                style,
                {
                    backgroundColor: style?.backgroundColor ? style.backgroundColor : backgroundColor,
                    overflow: 'hidden',
                    height: style?.height ? style.height : 3
                }
            ]}>
            <Animated.View style={[foregroundBarAnimation, style, { backgroundColor: foregroundColor }]} />
        </View>
    );
};

export default T2SProgressBar;
