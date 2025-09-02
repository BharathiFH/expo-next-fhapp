import React from 'react';
import { View } from 'react-native';

import styles from './styles/DividerStyle';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';

const Separator = ({ color }) => {
    return <View style={[styles.divider, { borderBottomColor: color }]} />;
};

Separator.defaultProps = {
    color: Colors.borderColor
};

Separator.propTypes = {
    color: PropTypes.string
};

export default Separator;
