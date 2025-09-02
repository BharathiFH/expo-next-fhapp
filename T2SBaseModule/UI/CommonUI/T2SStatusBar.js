import React from 'react';
import { StatusBar } from 'react-native';
import { isDarkTheme } from '../../../AppModules/BaseModule/ColorsHelper';
import { Colors } from '../../Themes';
import { useIsFocused } from '@react-navigation/native';

/**
 * Modifies the statusbar
 * if you need customization, use isDark or isModal. Dark is on transparent and isModal will add black bg
 *
 * @param isDark
 * @param isModal
 * @returns {JSX.Element}
 * @constructor
 */
const T2SStatusBar = ({ isDark, isModal }) => {
    const darkTheme = isDarkTheme();
    return (
        <StatusBar
            translucent={true}
            backgroundColor={isModal === true ? Colors.defaultBlack : Colors.transparent}
            barStyle={isModal === true || isDark === true || darkTheme === true ? 'light-content' : 'dark-content'}
        />
    );
};

export const T2SCustomStatusBar = ({ isDark, isModal }) => {
    const isFocused = useIsFocused();
    return <T2SStatusBar isDark={isDark === true && isFocused} isModal={isModal === true && isFocused} />;
};

export default T2SStatusBar;
