import React, { useMemo } from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { scaleFont } from './Utils/helpers';
import { FONT_FAMILY } from '../Utils/Constants';

const Typography = (props) => {
    const {
        variant = 'body1',
        color = 'textMain',
        spacing = 'none',
        fontWeight = 'regular',
        align,
        style,
        screenName,
        id,
        children
    } = props;
    const theme = useTheme();
    const typoTheme = theme.typography;
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const fontSize = scaleFont(typoTheme[variant].fontSize);
    const lineHeight = typoTheme[variant].lineHeight;
    const textColor = Colors[color];
    const outerSpacing = theme.spacing[spacing];
    const weight = fontWeight.toUpperCase();

    // Define styles for the heading element
    const styles = useMemo(() => {
        return StyleSheet.create({
            text: {
                fontSize: fontSize,
                lineHeight: lineHeight,
                color: textColor,
                textAlign: align,
                marginBottom: outerSpacing,
                fontFamily: FONT_FAMILY[weight],
                ...style
            }
        });
    }, [align, fontSize, lineHeight, outerSpacing, style, textColor, weight]);

    return (
        <Text {...props} style={styles.text} {...setTestId(screenName, id)}>
            {children}
        </Text>
    );
};

export default Typography;
