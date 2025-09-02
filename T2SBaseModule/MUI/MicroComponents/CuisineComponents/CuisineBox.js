import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useColorScheme, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { useTheme } from 't2sbasemodule/MUI/Utils/context';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import Heading from '../../Heading';
import Box from '../../Box';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from 'appmodules/TakeawayDetailsModule/Utils/TakeawayDetailsConstants';
import FlexBox from '../../FlexBox';

const CuisineBox = (props) => {
    const {
        image,
        icon,
        screenName,
        imageHeight,
        itemName,
        onError,
        errorImage = true,
        isSelected,
        fixedWidth,
        style,
        onPress,
        automationId,
        viewId = null,
        isGrocery = false
    } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const componentTheme = theme?.microComponents?.cuisine?.cuisineBox;
    const titleProps = componentTheme?.text;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1
        }).start();
    }, [isSelected, scale]);

    // Define styles for the button element
    const componentStyles = useMemo(() => {
        const boxBackground = isSelected ? Colors[componentTheme.selectionBackground] : Colors.transparent;
        const imgHeight = imageHeight ? imageHeight : componentTheme?.image;
        const borderRadius = componentTheme?.borderRadius;
        const selectBackground = Colors.white;
        const maxWidth = fixedWidth ? componentTheme?.maxWidth : null;
        return {
            boxBackground,
            imgHeight,
            borderRadius,
            selectBackground,
            maxWidth
        };
    }, [Colors, componentTheme, imageHeight, isSelected, fixedWidth]);

    // Define styles for the button element using StyleSheet
    const styles = useMemo(
        () =>
            StyleSheet.create({
                box: {
                    borderRadius: componentStyles.borderRadius,
                    backgroundColor: componentStyles.boxBackground,
                    width: componentStyles.maxWidth
                },
                cuisineImageWrapper: {
                    ...componentStyles.imgHeight,
                    justifyContent: 'center'
                },
                cuisineImage: {
                    width: '100%',
                    height: '100%'
                },
                selectIcon: {
                    position: 'absolute',
                    zIndex: 2,
                    right: 2,
                    top: 2,
                    backgroundColor: componentStyles.selectBackground,
                    borderRadius: 30,
                    padding: 2
                }
            }),
        [componentStyles]
    );

    const renderImage = useMemo(() => {
        if (isValidElement(image) && errorImage) {
            return (
                <T2SFastImage
                    source={{ uri: isValidString(image) && errorImage ? encodeURI(image) : null }}
                    style={styles.cuisineImage}
                    resizeMode={'contain'}
                    id={automationId}
                    nativeID={'' + itemName}
                    onError={onError}
                    screenName={screenName}
                    accessibilityLabel={`${itemName}`}
                />
            );
        } else {
            return (
                !isValidString(icon) && (
                    <T2SImage
                        id={automationId}
                        style={styles.cuisineImage}
                        screenName={screenName}
                        source={
                            isGrocery
                                ? require('t2sbasemodule/Images/common/grocery.png')
                                : require('t2sbasemodule/Images/common/no-image.png')
                        }
                        resizeMode={'contain'}
                        accessibilityLabel={`${itemName}`}
                    />
                )
            );
        }
    }, [image, errorImage, styles.cuisineImage, automationId, itemName, onError, screenName, icon, isGrocery]);

    const renderTitle = useMemo(() => {
        return (
            <Heading
                id={VIEW_ID.CUISINE_NAME + itemName}
                screenName={screenName}
                {...titleProps}
                color={'textMain'}
                fontSize={12}
                fontWeight={isSelected ? 'bold' : 'regular'}>
                {itemName}
            </Heading>
        );
    }, [isSelected, itemName, screenName, titleProps]);

    const renderSelectIcon = useMemo(() => {
        if (isSelected) {
            return <CustomIcon style={styles.selectIcon} color={Colors.foodhubPrimaryColor} name={FONT_ICON.NOTIFY_SUCCESS} size={26} />;
        }
        return null;
    }, [Colors, isSelected, styles]);

    const renderIcon = useMemo(() => {
        if (isValidString(icon)) {
            return (
                <FlexBox alignItems="center" justifyContent="center" style={styles.cuisineImage}>
                    <CustomIcon color={Colors.textMain} name={icon} size={48} />
                </FlexBox>
            );
        }
        return null;
    }, [Colors, styles, icon]);

    let testId = viewId === VIEW_ID.SEE_MORE_TOUCHABLE ? {} : { testID: VIEW_ID.CUISINE_VIEW };
    return (
        <Box px={'xs'} style={style}>
            <Box
                {...props}
                {...componentTheme}
                style={styles.box}
                activeOpacity={0.8}
                onPress={onPress}
                id={viewId ?? VIEW_ID.CUISINE_VIEW}>
                {renderSelectIcon}
                <Animated.View style={[styles.cuisineImageWrapper, { transform: [{ scale }] }]} {...testId}>
                    {renderIcon}
                    {renderImage}
                </Animated.View>
                {renderTitle}
            </Box>
        </Box>
    );
};

// PropTypes
CuisineBox.propTypes = {
    itemName: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object
};

// This function checks if specific props have not changed between renders
function propCheck(prevProps, nextProps) {
    return (
        prevProps.itemName === nextProps.itemName && prevProps.isSelected === nextProps.isSelected && prevProps.image === nextProps.image
    );
}

export default React.memo(CuisineBox, propCheck);
