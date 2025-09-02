import React from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';

const isWebView = Platform.OS === 'web';
const T2SAnimatedText = ({ accessibilityRole, ...props }) => {
    if (isWebView) {
        props.accessibilityRole = accessibilityRole;
    }
    return (
        <Animated.Text
            numberOfLines={props.numberOfLines}
            style={[Styles.style, props.style]}
            {...props}
            {...setTestId(props.screenName, props.id)}>
            {props.children}
        </Animated.Text>
    );
};

const Styles = StyleSheet.create({
    style: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textMain
    }
});

T2SAnimatedText.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SAnimatedText;
