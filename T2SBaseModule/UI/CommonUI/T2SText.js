import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';
import { setNoSnippet } from '../../Utils/helpers';

const isWebView = Platform.OS === 'web';
const T2SText = ({ accessibilityRole, ...props }) => {
    if (isWebView) {
        props.accessibilityRole = accessibilityRole;
    }
    return (
        <Text
            numberOfLines={props.numberOfLines}
            style={[Styles.style, props.style]}
            {...props}
            {...setTestId(props.screenName, props.id, props.webID)}
            {...setNoSnippet(props?.isNoSnippet)}>
            {props.children}
        </Text>
    );
};

const Styles = StyleSheet.create({
    style: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textMain
    }
});

T2SText.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SText;
