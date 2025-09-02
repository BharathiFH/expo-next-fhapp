import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

const RadioButton = ({ onPress, checked, disabled, color = 'primary', style, screenName, id, children }) => {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const buttonTheme = theme?.component?.button;
    const radioColor = Colors[buttonTheme?.colors[color]?.backgroundColor];
    const spacing = theme?.spacing.sm;
    const borderRadius = theme?.borderRadius.sm;
    const disableOpacity = disabled ? 0.7 : 1;
    const scale = useSharedValue(checked ? 0.7 : 0);
    const opacity = useSharedValue(checked ? 1 : 0);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                button: {
                    flexDirection: 'row',
                    padding: spacing,
                    marginHorizontal: -spacing,
                    alignItems: 'center',
                    borderRadius: borderRadius,
                    opacity: disableOpacity,
                    ...style
                },
                radio: {
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: radioColor,
                    height: 20,
                    width: 20,
                    borderRadius: 20,
                    marginVertical: 4,
                    marginRight: spacing
                },
                radioCheck: {
                    ...StyleSheet.absoluteFill,
                    borderRadius: 20,
                    backgroundColor: radioColor
                }
            }),
        [borderRadius, disableOpacity, radioColor, spacing, style]
    );

    const checkStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value
                }
            ],
            opacity: opacity.value
        };
    });

    useEffect(() => {
        if (checked) {
            scale.value = withSpring(0.7);
            opacity.value = withSpring(1);
        } else {
            scale.value = withSpring(0);
            opacity.value = withSpring(0);
        }
    }, [scale, checked, opacity]);

    const renderRadioBtn = () => (
        <View style={styles.radio}>
            <Animated.View style={[checkStyle, styles.radioCheck]} />
        </View>
    );

    return (
        <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.button}
            {...setTestId(`btn_${screenName}`, id)}>
            {renderRadioBtn()}
            {children}
        </TouchableOpacity>
    );
};

export default RadioButton;
