import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '../../Themes';

const T2SStatusBarAndroid = ({ backgroundColor, barStyle }) => {
    return Platform.OS === 'android' ? (
        <View>
            <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
        </View>
    ) : null;
};

T2SStatusBarAndroid.propTypes = {
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.string
};

T2SStatusBarAndroid.defaultProps = {
    backgroundColor: Colors.black,
    barStyle: 'ligh-content'
};

export default T2SStatusBarAndroid;
