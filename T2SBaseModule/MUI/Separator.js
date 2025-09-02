import React, { useMemo } from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { useTheme } from './Utils/context';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import Typography from './Typography';
import Box from './Box';

const Separator = (props) => {
    const { color = 'borderColor', height, screenName, id, style, text } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const separatorHeight = isValidString(height) ? theme?.spacing[height] : StyleSheet.hairlineWidth;
    const separatorColor = Colors[color];
    const textPadding = theme.spacing.sm;

    const styles = useMemo(() => {
        return StyleSheet.create({
            seperator: {
                flexDirection: 'row',
                alignItems: 'center',
                ...style
            },
            line: {
                height: separatorHeight,
                backgroundColor: separatorColor,
                flexGrow: 1,
                flexBasis: 0
            },
            text: {
                backgroundColor: Colors.white,
                paddingHorizontal: textPadding
            }
        });
    }, [Colors, separatorColor, separatorHeight, style, textPadding]);

    const renderText = isValidString(text) ? (
        <>
            <Typography style={styles.text} variant={'caption'} color={'textGrey'}>
                {text}
            </Typography>
            <View style={styles.line} />
        </>
    ) : null;

    return (
        <Box {...props} style={styles.seperator} {...setTestId(screenName, id)}>
            <View style={styles.line} />
            {renderText}
        </Box>
    );
};

export default Separator;
