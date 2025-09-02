import React, { useMemo, useEffect } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Card from '../../Card';
import Heading from '../../Heading';
import FlexBox from '../../FlexBox';
import LinearGradient from 'react-native-linear-gradient';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

/**
 * PendingOrderCard Component
 * A card component to display information about a pending order with an animated gradient background.
 *
 * @param {object} props - Props passed to the component
 * @param {string} [props.storeName] - The store name text displayed in the card
 * @param {object} [props.order] - The order details passed to the OrderTracking component
 * @param {string} [props.gradientColor='green'] - The color used for the gradient background
 * @param {string} [props.screenName] - The screen name where this component is used (for tracking purposes)
 * @param {object} [props.style] - Additional style properties passed to the Card component
 */

const PendingOrderCard = ({ storeName, children, gradientColor = 'green', screenName, style }) => {
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const gradientStart = Colors[gradientColor];
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(0.1, { duration: 1000 });
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));
    return (
        <Card elevation={'sm'} borderColor={'green'} shadowColor={'green'} headerBorder bordered {...style}>
            <Animated.View style={[styles.gradientWrapper, animatedStyle]}>
                <LinearGradient
                    style={styles.gradientWrapper}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 0.5, y: 0.5 }}
                    colors={[gradientStart, 'transparent', 'transparent']}
                    locations={[0, 0.5, 1]}
                    useAngle={true}
                    angle={150}
                />
            </Animated.View>
            <FlexBox justifyContent="space-between">
                <Heading numberOfLines={1} size={'subtitle2'} spacing={'none'}>
                    {storeName}
                </Heading>
            </FlexBox>
            {children}
        </Card>
    );
};

const styles = StyleSheet.create({
    gradientWrapper: {
        ...StyleSheet.absoluteFill,
        top: -8,
        right: -8,
        left: -8,
        bottom: -8
    }
});

export default PendingOrderCard;
