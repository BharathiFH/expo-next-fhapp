import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SForwardTouchableOpacity = forwardRef((props, ref) => {
    return (
        <TouchableOpacity ref={ref} {...props} {...setTestId(props.screenName, props.id)}>
            {props.children}
        </TouchableOpacity>
    );
});

T2SForwardTouchableOpacity.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
T2SForwardTouchableOpacity.defaultProps = {
    activeOpacity: 0.5
};

export default T2SForwardTouchableOpacity;
