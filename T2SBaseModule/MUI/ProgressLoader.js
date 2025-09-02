/**
 * ProgressLoader Component
 *
 * A component for rendering a smoothly animated progress bar.
 *
 * @component
 *
 * @param {Object} props - The properties of the ProgressLoader component.
 * @param {string} [props.color='#333'] - The color of the progress bar.
 * @param {Object} [props.style] - Additional styles to apply to the progress bar container.
 *
 * @returns {ReactElement} A React component representing the progress loader.
 */
import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const ProgressLoader = (props) => {
    const { color = '#333', duration = 1000, style } = props;
    const easing = Easing.bezier(0.42, 0, 0.58, 1);
    const sv = useSharedValue(0);

    useEffect(() => {
        sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        left: `${sv.value * 100}%`,
        width: `${sv.value * 100}%`
    }));

    // useMemo hook to memoize styles for performance optimization
    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                width: '100%',
                height: 2,
                backgroundColor: 'rgb(204, 204, 204)',
                overflow: 'hidden',
                ...style
            },
            progressBar: {
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: color
            }
        });
    }, [color, style]);

    // Render
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};

export default ProgressLoader;
