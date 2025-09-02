import React, { useMemo } from 'react';
import { View, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { setTestId } from '../Utils/AutomationHelper';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Image from './Image';
import FlexBox from './FlexBox';
import Typography from './Typography';
import ProgressLoader from './ProgressLoader';
import Box from './Box';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

/**
 * SocialButton component to display a social media button with optional text and loading state.
 *
 * @param {Object} props - Props for SocialButton component.
 * @param {Object} props.icon - The icon to display in the button.
 * @param {Function} props.onPress - Function to call when the button is pressed.
 * @param {string} props.screenName - Name of the screen, used for testing purposes.
 * @param {string} props.id - Unique identifier for the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.loading=false] - Whether to show a loading indicator.
 * @param {number} [props.iconSize=20] - Size of the icon.
 * @param {string} [props.variant='circle'] - The variant of the button. One of:
 *  - 'circle' (default)
 *  - 'bar'
 * @param {string} [props.size='md'] - The size of the button ('sm', 'md', 'lg').
 * @param {React.ReactNode} [props.children] - Optional children to display inside the button.
 */

const SocialButton = (props) => {
    const {
        icon,
        onPress,
        screenName,
        id = 'social_button',
        disabled = false,
        loading = false,
        iconSize = 20,
        variant = 'button',
        size = 'md',
        onLayoutText,
        minTextWidth,
        children
    } = props;

    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);

    const componentStyles = useMemo(() => {
        return theme?.component?.socialButton?.[variant]?.[size] ?? {};
    }, [size, theme, variant]);

    const style = useMemo(() => {
        return StyleSheet.create({
            btnWrapper: {
                ...componentStyles,
                overflow: 'hidden',
                borderWidth: 0,
                marginHorizontal: 20
            },
            button: {
                ...componentStyles,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Colors.borderColor
            },
            loader: {
                position: 'absolute',
                left: 0,
                bottom: 0
            },
            textStyle: { fontSize: setFont(14) }
        });
    }, [Colors, componentStyles]);

    const renderText = useMemo(() => {
        if (!!children && variant === 'button') {
            return (
                <Box minWidth={minTextWidth} onLayout={onLayoutText} pl={'sm'}>
                    <Typography style={style.textStyle} variant="subtitle2">
                        {children}
                    </Typography>
                </Box>
            );
        }
        return null;
    }, [children, minTextWidth, onLayoutText, variant]);

    const renderLoader = useMemo(() => {
        if (loading && variant === 'button') {
            return <ProgressLoader style={style.loader} />;
        }
        return null;
    }, [loading, style, variant]);

    return (
        <View style={style.btnWrapper}>
            <TouchableOpacity
                style={style.button}
                activeOpacity={1}
                onPress={onPress}
                disabled={disabled || loading}
                {...setTestId(screenName, id)}>
                <FlexBox justifyContent={'center'} alignItems={'center'}>
                    <Image width={iconSize} height={iconSize} source={icon} />
                    {renderText}
                </FlexBox>
            </TouchableOpacity>
            {renderLoader}
        </View>
    );
};

export default SocialButton;
