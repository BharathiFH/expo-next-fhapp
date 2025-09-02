import React, { useMemo } from 'react';
import { Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import { isValidElement } from '../../Utils/helpers';
import { TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types';
import { isValidString } from '../../Utils/helpers';
import { Colors } from '../../Themes';
/**
 * contentStyle - Styles of button's inner content. Use this prop to apply custom height and width.
 * buttonStyle - Actual style properties
 * @param props
 * @returns {*}
 * @constructor
 */
const T2SButton = ({
    icon,
    onPress,
    disabled,
    buttonTextStyle,
    buttonStyle,
    contentStyle,
    id,
    title,
    screenName,
    style,
    mode,
    opacity,
    uppercase,
    iconStyle,
    loading,
    color = Colors.primaryColor, // to set primaryColor dynamic ,set color here instead of default params,
    showAsDisabled = true
}) => {
    const T2SButtonStyles = useMemo(
        () => [
            styles.contentStyle,
            { borderColor: Colors.primaryColor },
            contentStyle,
            isValidElement(style) ? style : buttonStyle,
            isValidString(color) && mode !== 'outlined' && { backgroundColor: color },
            isValidElement(opacity) && { opacity: opacity }
        ],
        [style, contentStyle, mode, opacity, color, buttonStyle]
    );
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[T2SButtonStyles, disabled && showAsDisabled && styles.disabledStyle]}
            {...setTestId(screenName, id)}>
            {isValidElement(icon) && <Image style={StyleSheet.flatten([styles.buttonIconStyle, iconStyle])} source={icon} />}
            <Text style={[styles.textStyle, buttonTextStyle]}>{uppercase ? title.toUpperCase() : title}</Text>
            {loading ? <ActivityIndicator style={styles.loader} color={Colors.defaultWhite} size={15} /> : null}
        </TouchableOpacity>
    );
};
T2SButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.string,
    buttonStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
    buttonTextStyle: TextPropTypes.style,
    uppercase: PropTypes.bool,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string,
    title: PropTypes.string.isRequired
};
T2SButton.defaultProps = {
    icon: null,
    disabled: false,
    uppercase: false,
    buttonTextStyle: {},
    buttonStyle: {},
    contentStyle: {},
    id: '',
    title: '',
    screenName: '',
    style: null,
    mode: 'contained',
    opacity: 1,
    textAllCaps: true
};
export default T2SButton;
