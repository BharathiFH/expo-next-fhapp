import React from 'react';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { isValidString, isValidURL } from '../../Utils/helpers';
import { View, StyleSheet } from 'react-native';
import Colors from '../../Themes/Colors';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { styles } from './Style/T2SWebContainerStyle';

const T2SFastImage = (props) => {
    const {
        screenName,
        id,
        webID,
        source,
        style,
        defaultImage,
        defaultImageStyle,
        accessibilityLabel = null,
        visibleByDefault,
        width,
        resizeMode,
        loadEarly = false
    } = props;
    const accessibilityProps = {};
    if (isValidString(accessibilityLabel)) {
        accessibilityProps.alt = accessibilityLabel;
    }
    if (isValidURL(source?.uri)) {
        return (
            <View style={StyleSheet.flatten([style, styles.fastImageStyle])}>
                <LazyLoadImage
                    height={'100%'}
                    src={source.uri} // use normal <img> attributes as props
                    width={width ?? '100%'}
                    visibleByDefault={visibleByDefault}
                    delayTime={loadEarly ? 0 : 300}
                    threshold={loadEarly ? 0 : 100}
                    fetchPriority={loadEarly ? 'high' : 'normal'}
                    {...setTestId(screenName, id, webID)}
                    {...accessibilityProps}
                    style={StyleSheet.flatten([style, { objectFit: resizeMode }])}
                    effect="blur"
                />
            </View>
        );
    } else if (isValidString(defaultImage)) {
        return (
            <LazyLoadImage
                src={defaultImage}
                style={defaultImageStyle || style}
                visibleByDefault={true}
                {...accessibilityProps}
                delayTime={loadEarly ? 0 : 300}
                threshold={loadEarly ? 0 : 100}
                fetchPriority={loadEarly ? 'high' : 'normal'}
                effect="blur"
            />
        );
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
    accessible: true,
    visibleByDefault: false
};
export default T2SFastImage;
