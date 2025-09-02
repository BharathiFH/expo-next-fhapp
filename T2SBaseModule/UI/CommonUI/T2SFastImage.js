import React from 'react';
import FastImage from 'react-native-fast-image';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { isValidString, isValidURL } from '../../Utils/helpers';
import { Image } from 'react-native';
import Colors from '../../Themes/Colors';

const T2SFastImage = ({ screenName, id, webID, source, style, defaultImage, defaultImageStyle, resizeMode, accessible, onError }) => {
    if (isValidURL(source?.uri)) {
        return (
            <FastImage
                source={source}
                style={style}
                resizeMode={resizeMode}
                accessible={accessible}
                onError={onError}
                {...setTestId(screenName, id, webID)}
            />
        );
    } else if (isValidString(defaultImage)) {
        return <Image source={defaultImage} style={defaultImageStyle || style} resizeMode={resizeMode} />;
    } else {
        return null;
    }
};
T2SFastImage.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
T2SFastImage.defaultProps = {
    screenName: '',
    id: '',
    color: Colors.primaryColor,
    style: {},
    defaultImage: null,
    defaultImageStyle: null,
    resizeMode: 'cover',
    accessible: true
};
export default T2SFastImage;
