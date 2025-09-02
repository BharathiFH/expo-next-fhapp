import React from 'react';
import { Switch } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';
import { isIOS } from '../../../AppModules/BaseModule/Helper';

const T2SSwitch = ({
    thumbPositiveColor = Colors.primaryColor,
    trackColorIOS = Colors.primaryColor,
    trackColorAndroid = Colors.primaryColor,
    ...props
}) => {
    const { screenName, id, value } = props;

    return (
        <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            color={props.color}
            {...props}
            {...setTestId(screenName, id)}
            trackColor={{
                false: isIOS() ? Colors.grey : Colors.borderColor,
                true: isIOS() ? trackColorIOS : trackColorAndroid
            }}
            thumbColor={isIOS() ? Colors.white : value ? thumbPositiveColor : Colors.grey}
            activeThumbColor={Colors.grey}
        />
    );
};
T2SSwitch.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onValueChange: PropTypes.func.isRequired,
    color: PropTypes.string
};
export default T2SSwitch;
