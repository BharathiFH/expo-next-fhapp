import React, { forwardRef, useMemo } from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import { isValidElement, isValidStringType } from '../../Utils/helpers';
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
const T2SForwardButton = forwardRef(
    (
        {
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
            color = Colors.primaryColor // to set primaryColor dynamic ,set color here instead of default params
        },
        ref
    ) => {
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
                ref={ref}
                disabled={disabled}
                activeOpacity={0.8}
                style={T2SButtonStyles}
                {...setTestId(screenName, id)}>
                {isValidElement(icon) && <Image style={styles.buttonIconStyle} source={icon} />}
                {uppercase && isValidStringType(title) ? (
                    <Text style={[styles.textStyle, buttonTextStyle]}>{title.toUpperCase()}</Text>
                ) : (
                    <View style={[buttonTextStyle]}>{title}</View>
                )}
            </TouchableOpacity>
        );
    }
);
T2SForwardButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    buttonStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
    buttonTextStyle: TextPropTypes.style,
    uppercase: PropTypes.bool,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string,
    title: PropTypes.node.isRequired
};
T2SForwardButton.defaultProps = {
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
export default T2SForwardButton;
