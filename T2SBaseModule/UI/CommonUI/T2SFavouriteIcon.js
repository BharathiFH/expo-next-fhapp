import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, Extrapolate, interpolate } from 'react-native-reanimated';

const T2SFavouriteIcon = ({ screenName, id, size, isFavorite, style }) => {
    const favourite = useSharedValue(isFavorite ? 1 : 0);

    const outlineStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(favourite.value, [0, 1], [1, 0], Extrapolate.CLAMP)
                }
            ]
        };
    });

    const fillStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            transform: [
                {
                    scale: favourite.value
                }
            ],
            opacity: favourite.value
        };
    });

    useEffect(() => {
        favourite.value = withSpring(isFavorite ? 1 : 0);
    }, [favourite, isFavorite]);

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                width: size,
                height: size
            }
        });
    }, [size]);

    return (
        <View style={styles.container}>
            <Animated.View style={outlineStyle}>
                <T2SIcon name={FONT_ICON.HEART_STROKE} screenName={screenName} id={id} size={size} style={style} color={Colors.textMain} />
            </Animated.View>
            <Animated.View style={fillStyle}>
                <T2SIcon name={FONT_ICON.HEART_FILL} screenName={screenName} id={id} size={size} style={style} color={Colors.red} />
            </Animated.View>
        </View>
    );
};

export default T2SFavouriteIcon;
