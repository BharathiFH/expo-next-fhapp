import * as React from 'react';
import { View } from 'react-native';
import { Colors } from '../../Themes';

const T2SDivider = ({ style, color = Colors.borderColor }) => {
    return <View style={[{ backgroundColor: color, height: 1 }, style]} />;
};

export default T2SDivider;
