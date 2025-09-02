import React from 'react';
import { View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';

const CardView = (props) => {
    return <View style={props.cardStyle}>{props.children}</View>;
};

CardView.propTypes = {
    children: PropTypes.any,
    cardStyle: ViewPropTypes.style
};
export default CardView;
