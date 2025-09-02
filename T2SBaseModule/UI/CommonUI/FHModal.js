import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Style/ModalStyle';
import { isEmpty } from '../../Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { bodyScroll } from '../../Utils/StyleHelper';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { isAndroid, isIOS } from '../../../AppModules/BaseModule/Helper';
import { isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { Colors } from '../../Themes';
import T2SModalWrapper from './T2SModalWrapper';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const isMobileDevice = isAndroid() || isIOS();
const isWebDevice = isWeb();
const FHModal = ({
    isVisible,
    requestClose,
    closeId,
    screenName,
    title,
    titleId = 'title',
    children,
    dialogCancelable = true,
    mobileBottomPosition = false,
    bottomPosition = false,
    showClose = true,
    style
}) => {
    useEffect(() => {
        isVisible && bodyScroll('hidden', true);
        return () => {
            isVisible && bodyScroll('unset', true);
        };
        //eslint-disable-next-line
    }, []);

    const mobileBottom = (mobileBottomPosition && isMobileDevice) || bottomPosition;
    const headerHeight = StatusBar.currentHeight + 30 ?? 0;
    return (
        <T2SModalWrapper
            backdropColor={Colors.overlay}
            isVisible={isVisible}
            animationIn={mobileBottom ? 'fadeInUp' : 'zoomIn'}
            customBackdrop={
                <TouchableWithoutFeedback onPress={() => requestClose()}>
                    <View style={StyleSheet.flatten([styles.customBackdrop, isWebDevice ? styles.customBackdropWeb : {}])} />
                </TouchableWithoutFeedback>
            }
            style={StyleSheet.flatten([
                styles.modal,
                isWebDevice ? styles.modalWeb : {},
                mobileBottom ? styles.mobileBottomPosition : {},
                style
            ])}
            onBackdropPress={() => (dialogCancelable ? requestClose() : {})}
            onRequestClose={() => requestClose()}>
            <KeyboardAvoidingView
                style={[StyleSheet.flatten([styles.keyboardAvoidingViewContainer])]}
                behavior={'padding'}
                keyboardVerticalOffset={headerHeight}>
                <View style={[StyleSheet.flatten([styles.modalContainer])]} screenName={screenName}>
                    {showClose ? (
                        <T2STouchableOpacity style={styles.closeBtn} onPress={() => requestClose()} screenName={screenName} id={closeId}>
                            <CustomIcon name={FONT_ICON.CLOSE} size={styles.iconSize.iconSize} color={Colors.textMain} />
                        </T2STouchableOpacity>
                    ) : null}
                    {!isEmpty(title) ? (
                        <T2SText screenName={screenName} id={titleId} style={styles.modalTitle}>
                            {title}
                        </T2SText>
                    ) : null}
                    <SafeAreaView style={styles.mainContainer}>{children}</SafeAreaView>
                </View>
            </KeyboardAvoidingView>
        </T2SModalWrapper>
    );
};
FHModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    style: PropTypes.object,
    requestClose: PropTypes.func.isRequired
};

export default React.memo(FHModal);
