import React from 'react';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SButton from './T2SButton';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import { TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types';

const T2SFlatButton = ({
    icon,
    onPress,
    disabled,
    uppercase,
    buttonTextStyle,
    buttonStyle,
    contentStyle,
    color,
    id,
    title,
    screenName,
    style,
    mode,
    opacity,
    accessible,
    compact
}) => {
    return (
        <T2SButton
            theme={customerAppTheme.colors.primaryButton}
            icon={icon}
            accessible={accessible}
            disabled={disabled}
            uppercase={uppercase}
            contentStyle={contentStyle}
            style={style}
            opacity={opacity}
            {...setTestId(screenName, id)}
            buttonStyle={buttonStyle}
            color={color ?? 'transparent'}
            buttonTextStyle={[styles.flatButtonTextStyle, buttonTextStyle]}
            onPress={onPress}
            title={title}
            mode={mode}
            compact={compact}
        />
    );
};

T2SFlatButton.propTypes = {
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
T2SFlatButton.defaultProps = {
    icon: null,
    disabled: false,
    uppercase: false,
    buttonTextStyle: {},
    buttonStyle: {},
    contentStyle: {},
    color: null,
    id: '',
    title: '',
    screenName: '',
    style: null,
    mode: 'text',
    opacity: 1,
    textAllCaps: true,
    compact: true
};
export default T2SFlatButton;
