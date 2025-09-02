import React, { useMemo } from 'react';
import { TextInput, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import Box from './Box';

const SearchBar = (props) => {
    const { size = 'sm', screenName, id, style } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const iconColor = Colors.textGrey;

    const inputStyles = useMemo(() => {
        const searchBarTheme = theme?.component.searchBar;
        const borderColor = Colors[searchBarTheme.borderColor];
        const color = Colors[searchBarTheme.color];
        const elevation = searchBarTheme?.elevation;
        const inputProps = searchBarTheme?.size[size];
        const left = searchBarTheme?.size[size]?.paddingRight;
        return {
            inputProps,
            borderColor,
            color,
            left,
            elevation
        };
    }, [Colors, size, theme]);

    // Memoize styles to optimize performance
    const styles = useMemo(() => {
        return StyleSheet.create({
            inputWrapper: {
                position: inputStyles.position,
                backgroundColor: Colors.white,
                zIndex: 9
            },
            icon: {
                position: 'absolute',
                height: '100%',
                left: inputStyles.left,
                justifyContent: 'center'
            },
            input: {
                borderWidth: 1,
                borderColor: inputStyles.borderColor,
                borderBottomColor: inputStyles.borderColor,
                color: inputStyles.color,
                outlineStyle: 'none',
                ...inputStyles.elevation,
                ...inputStyles.inputProps,
                ...style
            }
        });
    }, [Colors, inputStyles, style]);

    return (
        <Box style={styles.inputWrapper}>
            <Box>
                <Box style={styles.icon}>
                    <CustomIcon color={iconColor} name={FONT_ICON.SEARCH} size={24} />
                </Box>
                <TextInput {...props} style={styles.input} {...setTestId(screenName, id)} />
            </Box>
        </Box>
    );
};

export default React.memo(SearchBar);
