import React, { useMemo } from 'react';
import { View, StyleSheet, useColorScheme, ImageBackground, StatusBar } from 'react-native';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Box from './Box';
import { defaultTouchArea, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import Button from './Button';
import Heading from './Heading';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { handleSafeGoBack } from '../../CustomerApp/Navigation/Helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '../../AppModules/BaseModule/Helper';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
const Card = (props) => {
    const {
        radius = 'lg',
        elevation = 'none',
        color = 'white',
        borderColor = 'borderColor',
        shadowColor = 'black',
        title,
        header = null,
        footer,
        showClose = false,
        closeElevation = false,
        showBack = false,
        p = 'md',
        onRequestClose,
        disableBottomRadius = false,
        disableTopRadius = false,
        showHeader = true,
        headerBorder = false,
        headerButton,
        bgImage = '',
        bordered = false,
        searchComponent = null,
        style,
        children,
        navigation,
        onRequestBack,
        safeAreaInsets = false,
        footerTopComponent = null,
        footerPadding = null,
        stickyViewEnabled = false
    } = props;
    const theme = useTheme();
    const cardTheme = theme?.component?.card;
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const borderRadius = theme?.borderRadius[radius];
    const boxShadow = theme?.elevation[elevation].shadow1;
    const boxShadowLayer = theme?.elevation[elevation].shadow2;
    const backgroundColor = Colors[color];
    const bottomRadius = disableBottomRadius ? 0 : borderRadius;
    const topRadius = disableTopRadius ? 0 : borderRadius;
    const showCardHead = showHeader && (showBack || isValidString(title) || isValidElement(headerButton));
    const closeShadow = closeElevation ? cardTheme.closeElevation : null;
    const borderWidth = bordered ? 1 : 0;
    const bColor = Colors[borderColor];
    const boxShadowColor = Colors[shadowColor];
    const headerBorderWidth = headerBorder ? 1 : 0;
    const { top, bottom } = useSafeAreaInsets();
    const statusBarHeight = useMemo(() => (safeAreaInsets ? (isAndroid() ? StatusBar.currentHeight : top) : 0), [top, safeAreaInsets]);
    const handleBackPress = () => {
        onRequestBack ? onRequestBack() : handleSafeGoBack(navigation);
    };

    // Define styles for the heading element
    const styles = useMemo(() => {
        return StyleSheet.create({
            card: {
                ...boxShadow,
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                borderBottomRightRadius: bottomRadius,
                borderBottomLeftRadius: bottomRadius,
                borderTopLeftRadius: topRadius,
                borderTopRightRadius: topRadius,
                borderWidth: borderWidth,
                borderColor: bColor,
                shadowColor: boxShadowColor,
                paddingTop: statusBarHeight,
                overflow: 'hidden',
                zIndex: 1,
                ...style
            },
            backBtn: {
                marginRight: 4,
                marginLeft: -8
            },
            cardTitle: {
                backgroundColor: Colors.white,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: headerBorderWidth,
                borderBottomColor: bColor,
                height: 56
            },
            cardTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
            closeBtn: {
                position: 'absolute',
                right: 16,
                top: 8,
                ...closeShadow
            },
            cardHeader: {
                flexGrow: 0
            },
            cardContent: {
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 'auto',
                overflowY: 'auto',
                borderRadius: borderRadius
            },
            cardContentInner: {
                flexGrow: 1
            },
            cardFooter: {
                backgroundColor: Colors.white,
                flexGrow: 0,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 15,
                elevation: 10,
                zIndex: 9,
                ...footerPadding
            },
            shadowLayer: {
                ...boxShadowLayer,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: -1
            },
            bgImage: {
                ...StyleSheet.absoluteFillObject
            }
        });
    }, [
        Colors,
        backgroundColor,
        bColor,
        borderRadius,
        borderWidth,
        bottomRadius,
        topRadius,
        boxShadow,
        boxShadowLayer,
        closeShadow,
        boxShadowColor,
        headerBorderWidth,
        statusBarHeight,
        style,
        footerPadding
    ]);

    const renderTitle = showCardHead ? (
        <Box p={p} style={styles.cardTitle}>
            {showBack ? (
                <Button
                    color="white"
                    style={styles.backBtn}
                    hitSlop={defaultTouchArea(120)}
                    onPress={handleBackPress}
                    type="icon"
                    icon={FONT_ICON.BACK}
                />
            ) : null}
            {isValidString(title) ? (
                <Heading size={'h5'} spacing={'none'} onPress={showBack ? handleBackPress : () => {}}>
                    {title}
                </Heading>
            ) : null}
            <Box ml={'auto'}>{isValidElement(headerButton) ? headerButton : null}</Box>
        </Box>
    ) : null;

    const renderSearchComponent = isValidElement(searchComponent) ? <Box px={p}>{searchComponent}</Box> : null;

    const renderClose = showClose ? (
        <Button color={'default'} size={'md'} style={styles.closeBtn} onPress={onRequestClose} type="icon" icon={FONT_ICON.CLOSE} />
    ) : null;

    const renderHeader = isValidElement(header) ? <Box style={styles.cardHeader}>{header()}</Box> : null;

    const renderContent = (
        <Box px={p} style={styles.cardContent}>
            <Box my={p} style={styles.cardContentInner}>
                {children}
            </Box>
        </Box>
    );

    const renderFooter = isValidElement(footer) ? (
        <>
            {footerTopComponent}
            <KeyboardStickyView enabled={stickyViewEnabled} offset={{ opened: bottom }}>
                <Box webID={'card_footer'} p={'md'} style={styles.cardFooter}>
                    {footer}
                </Box>
            </KeyboardStickyView>
        </>
    ) : null;

    const renderBg = isValidString(bgImage) ? <ImageBackground source={{ uri: bgImage }} style={styles.bgImage} /> : null;

    return (
        <Box {...props} style={styles.card} p={'none'}>
            {renderBg}
            {renderClose}
            {renderTitle}
            {renderHeader}
            {renderSearchComponent}
            {renderContent}
            {renderFooter}
            <View style={styles.shadowLayer} />
        </Box>
    );
};

export default Card;
