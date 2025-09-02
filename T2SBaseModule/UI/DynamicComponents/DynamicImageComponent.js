import React, { useCallback, useState, useContext } from 'react';
import { View, Linking, TouchableOpacity, Image } from 'react-native';
import { MyResponsiveContext, isValidString, isValidElement } from 't2sbasemodule/Utils/helpers';
import { styles } from './DynamicComponentStyles/ImageComponentStyles';
import useResponsiveStyle from '../CommonUI/Style/UseResponsiveStyle';
import { isLandscapeScreen } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';

const DynamicImageComponent = (props) => {
    const {
        imageUrl,
        linkingUrl = '',
        webImageUrl = '',
        customImageStyle,
        resizeMode,
        handleOnPress,
        deepLinkParams,
        customImageViewStyle,
        trackOnClick = false
    } = props;
    const style = useResponsiveStyle(styles);
    const [imageHeight, setImageHeight] = useState(null);
    const mode = useContext(MyResponsiveContext);
    const isLandscapeWebMode = isLandscapeScreen(mode);

    let url = isLandscapeWebMode && isValidString(webImageUrl) ? webImageUrl : imageUrl;
    const isDisabled = !isValidElement(handleOnPress) && !isValidString(linkingUrl) && !isValidElement(deepLinkParams);
    const onPress = () => {
        if (trackOnClick) {
            Segment.trackEvent(SEGMENT_EVENTS.ORDER_TRACKING_PROMOTION_BANNER_CLIKED);
        }
        if (handleOnPress) {
            handleOnPress();
        } else if (linkingUrl) {
            Linking.openURL(linkingUrl);
        } else if (deepLinkParams) {
            handleDeeplinkNavigation(deepLinkParams);
        }
    };

    const handleDeeplinkNavigation = (params) => {
        let navigationParams = null;
        const { landscape, potrait, defaults } = params || {};
        if (isLandscapeWebMode && landscape) {
            navigationParams = landscape;
            navigateToScreen(navigationParams);
        } else if (potrait) {
            navigationParams = potrait;
            navigateToScreen(navigationParams);
        } else if (defaults) {
            navigationParams = defaults;
            navigateToScreen(navigationParams);
        } else {
            return navigationParams;
        }
    };

    const navigateToScreen = (params) => {
        const { nestedScreen, routeParams, screen } = params || {};
        if (nestedScreen) {
            handleNavigation(screen, {
                screen: nestedScreen,
                params: routeParams
            });
        } else {
            handleNavigation(screen, routeParams);
        }
    };

    const getDynamicWidth = useCallback(
        (layout) => {
            let viewWidth = layout.width;
            Image.getSize(
                imageUrl,
                (width, height) => {
                    const aspectRatio = height / width;
                    const calculatedHeight = viewWidth * aspectRatio;
                    setImageHeight(calculatedHeight);
                },
                (error) => {
                    console.log('error', error);
                }
            );
        },
        [imageUrl]
    );

    return (
        <View
            onLayout={(event) => {
                getDynamicWidth(event.nativeEvent.layout);
            }}
            style={{ ...(customImageViewStyle || {}) }}>
            <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.8} style={style.viewStyle}>
                <Image
                    source={{ uri: url }}
                    resizeMode={resizeMode ? resizeMode : 'cover'}
                    style={[style.imageStyle, !isLandscapeWebMode && { height: imageHeight }, customImageStyle]}
                />
            </TouchableOpacity>
        </View>
    );
};

export default DynamicImageComponent;
