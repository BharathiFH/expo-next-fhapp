import React, { useMemo, useContext } from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, Keyboard } from 'react-native';
import { isTabletLandscape, isTabletPortrait, isValidString, MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { isLandscapeScreen, isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { useTheme } from '../Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Box from '../Box';
import FlexBox from '../FlexBox';
import Heading from '../Heading';
import T2SStatusBar from 't2sbasemodule/UI/CommonUI/T2SStatusBar';
import Button from '../Button';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { handleSafeGoBack } from '../../../CustomerApp/Navigation/Helper';
import { defaultTouchArea } from 't2sbasemodule/Utils/helpers';
import ModalWrapper from '../../../CustomerApp/Navigation/ModalWrapper';
import { MODAL_TYPES } from '../../../CustomerApp/Utils/ModalConstants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const ModalLayout = (props) => {
    const {
        size = 'md',
        title,
        align,
        showClose = true,
        showScrollView = true,
        onRequestClose,
        footer,
        navigation,
        children,
        scrollViewRef = null,
        container = false,
        webType = MODAL_TYPES.OTHERS,
        mobileType = MODAL_TYPES.BOTTOM_SHEET,
        onBackdropPress
    } = props;
    const mode = useContext(MyResponsiveContext);
    const isDesktop = isLandscapeScreen(mode) || isTabletLandscape(mode) || isTabletPortrait(mode);
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const componentStyles = useMemo(() => {
        const modalStyles = theme?.pages?.modal?.[size] ?? {};
        return {
            modalStyles
        };
    }, [size, theme]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                modalContent: {
                    ...componentStyles.modalStyles,
                    backgroundColor: Colors.white,
                    borderBottomRightRadius: isDesktop ? 16 : 0,
                    borderBottomLeftRadius: isDesktop ? 16 : 0,
                    width: '100%'
                },
                closeBtn: {
                    position: 'absolute',
                    padding: 16,
                    top: 0,
                    right: 0
                }
            }),
        [Colors, componentStyles, isDesktop]
    );

    const handleClosePress = () => {
        Keyboard.dismiss();
        if (onRequestClose) {
            onRequestClose();
        } else {
            handleSafeGoBack(navigation);
        }
    };

    const renderClose = showClose ? (
        <TouchableOpacity style={styles.closeBtn} activeOpacity={1} hitSlop={defaultTouchArea(120)} onPress={handleClosePress}>
            <Button
                size="md"
                color={'default'}
                hitSlop={defaultTouchArea(120)}
                onPress={handleClosePress}
                type="icon"
                icon={FONT_ICON.CLOSE}
            />
        </TouchableOpacity>
    ) : null;

    const renderModalContent = (
        <FlexBox flexShrink={1} flexGrow={1} flexDirection={'column'}>
            <KeyboardAwareScrollView
                ref={scrollViewRef}
                enableAutomaticScroll={true}
                behavior={'padding'}
                bottomOffset={100}
                keyboardShouldPersistTaps={'handled'}
                enableOnAndroid={true}>
                <Box py={'md'} px={'md'}>
                    {children}
                </Box>
            </KeyboardAwareScrollView>
        </FlexBox>
    );

    const renderFooter = footer ? (
        <FlexBox flexGrow={0} flexDirection={'column'} px={'md'} py={'lg'}>
            {footer}
        </FlexBox>
    ) : null;

    const onBackClick = () => {
        handleClosePress();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ModalWrapper
                webType={webType}
                mobileType={mobileType}
                container={container}
                onBackdropPress={onBackdropPress}
                customBackDropPress={true}
                backDropPressAction={onBackClick}>
                <T2SStatusBar isModal={true} />
                <FlexBox
                    style={{ overflow: 'hidden' }}
                    id={'modalDilogue'}
                    justifyContent={'center'}
                    flexGrow={isDesktop ? 0 : 1}
                    flexShrink={1}
                    flexBasis={'auto'}
                    zIndex={9}>
                    <Box id={'modalContent'} mt={!isDesktop && isWeb() ? 'lg' : 'none'} style={styles.modalContent}>
                        {isValidString(title) || renderClose ? (
                            <FlexBox flexGrow={0} flexDirection={'column'} py={'lg'}>
                                <Heading size={'h5'} align={align} spacing={'none'}>
                                    {title}
                                </Heading>
                                {renderClose}
                            </FlexBox>
                        ) : null}
                        {showScrollView ? renderModalContent : children}
                        {renderFooter}
                    </Box>
                </FlexBox>
            </ModalWrapper>
        </SafeAreaView>
    );
};

export default ModalLayout;
