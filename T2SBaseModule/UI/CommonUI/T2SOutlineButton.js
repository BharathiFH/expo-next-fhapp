import React from 'react';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SButton from './T2SButton';
import { TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types';

const T2SOutlineButton = (props) => {
    const { outlineButtonStyle, textStyleBlack } = styles;
    return (
        <T2SButton
            {...props}
            {...setTestId(props.screenName, props.id)}
            buttonStyle={[outlineButtonStyle, props.buttonStyle]}
            buttonTextStyle={[textStyleBlack, props.buttonTextStyle]}
            onPress={props.onPress}
            title={props.title}
            mode={'outlined'}
            disabled={props.disabled}
            icon={props.icon}
            uppercase={props.uppercase}
        />
    );
};

T2SOutlineButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.string,
    buttonStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
    buttonTextStyle: TextPropTypes.style,
    uppercase: PropTypes.bool,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};
T2SOutlineButton.defaultProps = {
    textAllCaps: true,
    screenName: '',
    id: '',
    buttonStyle: {},
    buttonTextStyle: {},
    onPress: () => {},
    title: '',
    disabled: false,
    icon: null,
    uppercase: false
};
export default T2SOutlineButton;
