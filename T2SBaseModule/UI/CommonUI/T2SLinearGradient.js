import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { setTestId } from '../../Utils/AutomationHelper';

const T2SLinearGradient = ({ screenName, id, webID, ...props }) => {
    return <LinearGradient {...setTestId(screenName, id, webID)} {...props} />;
};

export default T2SLinearGradient;
