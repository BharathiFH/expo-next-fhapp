import React from 'react';
import { TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import Colors from '../../Themes/Colors';
import { isAndroid } from '../../../AppModules/BaseModule/Helper';
const T2STouchableNativeFeedback = (props) => {
    if (isAndroid()) {
        return (
            <View style={props.viewStyle}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    {...props}
                    {...setTestId(props.screenName, props.id, props.webID)}>
                    {props.children}
                </TouchableNativeFeedback>
            </View>
        );
    } else {
        return (
            <View style={props.viewStyle}>
                <TouchableHighlight {...props} {...setTestId(props.screenName, props.id, props.webID)}>
                    {props.children}
                </TouchableHighlight>
            </View>
        );
    }
};

T2STouchableNativeFeedback.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
T2STouchableNativeFeedback.defaultProps = {
    activeOpacity: 0.7,
    underlayColor: Colors.grey,
    viewStyle: {}
};

export default T2STouchableNativeFeedback;
