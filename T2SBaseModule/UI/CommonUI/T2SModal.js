import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Style/DialogModalStyle';
import { isEmpty, isNonEmptyString, isValidElement, isValidFunction, isValidString } from '../../Utils/helpers';
import T2SButton from './T2SButton';
import Colors from '../../Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types';
import { bodyScroll } from '../../Utils/StyleHelper';
import T2SStatusBar from './T2SStatusBar';
import Modal from 'react-native-modal';

const T2SModal = ({
    isVisible,
    requestClose,
    title,
    description,
    negativeButtonClicked,
    positiveButtonClicked,
    positiveButtonText,
    negativeButtonText,
    positiveButtonStyle,
    negativeButtonStyle,
    descriptionTextStyle,
    positiveButtonTextStyle,
    negativeButtonTextStyle,
    positiveButtonDisabled = false,
    titleTextStyle,
    customView,
    onModalHide,
    dialogCancelable = true,
    titleCenter = false,
    textAllCaps = true,
    negativeButtonId = 'negativeButton',
    positiveButtonId = 'positiveButton',
    titleId = 'title',
    descriptionId = 'description',
    screenName = 'Modal',
    isTitleVisible = true,
    backdropColor = null,
    modalContainerStyle = {},
    allergyModalStyle,
    backdropOpacity = 0.7
}) => {
    const onClose = () => {
        if (isValidFunction(requestClose)) {
            requestClose();
        }
    };
    useEffect(() => {
        isVisible && bodyScroll('hidden');
        return () => {
            isVisible && bodyScroll('unset');
        };
        //eslint-disable-next-line
    }, []);
    const allergyModalStyles = allergyModalStyle ? allergyModalStyle : styles.modalContentContainerStyle;
    return (
        <Modal
            backdropOpacity={backdropOpacity}
            isVisible={isVisible}
            style={modalContainerStyle}
            onBackdropPress={() => (dialogCancelable ? onClose() : {})}
            onRequestClose={onClose}
            backdropColor={isValidElement(backdropColor) ? backdropColor : Colors.overlay}
            onModalHide={() => (isValidElement(onModalHide) ? onModalHide() : {})}>
            {isVisible && <T2SStatusBar isModal={true} isDark={true} />}
            <View style={StyleSheet.flatten([styles.modalContentContainerStyle, allergyModalStyles])}>
                {!isEmpty(title) && isTitleVisible ? (
                    <T2SText
                        id={titleId}
                        screenName={screenName}
                        style={[
                            styles.modalHeaderStyle,
                            titleCenter ? styles.modalHeaderTitleCenter : styles.modalHeaderStyle,
                            titleTextStyle
                        ]}>
                        {title}
                    </T2SText>
                ) : null}

                {isValidElement(customView) ? (
                    customView()
                ) : isValidString(description) ? (
                    <T2SText id={descriptionId} screenName={screenName} style={[styles.modalDescriptionStyle, descriptionTextStyle]}>
                        {description}
                    </T2SText>
                ) : null}
                <View accessible={false} style={styles.modalButtonContainer}>
                    {isNonEmptyString(negativeButtonText) ? (
                        <T2SButton
                            buttonTextStyle={[styles.negativeButtonTextStyle, negativeButtonTextStyle]}
                            mode={'outlined'}
                            buttonStyle={[styles.negativeButtonStyle, negativeButtonStyle]}
                            onPress={negativeButtonClicked}
                            screenName={screenName}
                            id={negativeButtonId}
                            uppercase={textAllCaps}
                            color={Colors.white}
                            title={negativeButtonText}
                        />
                    ) : null}

                    {isNonEmptyString(positiveButtonText) && (
                        <>
                            {isNonEmptyString(negativeButtonText) ? <View style={styles.buttonSpaceStyle} /> : null}
                            <T2SButton
                                buttonTextStyle={[styles.buttonTextStyle, positiveButtonTextStyle]}
                                //to set primaryColor dynamic ,set color here instead of stylesheet
                                buttonStyle={StyleSheet.flatten([
                                    styles.positiveButtonStyle,
                                    { backgroundColor: Colors.primaryColor },
                                    positiveButtonStyle
                                ])}
                                disabled={positiveButtonDisabled}
                                onPress={positiveButtonClicked}
                                screenName={screenName}
                                id={positiveButtonId}
                                uppercase={textAllCaps}
                                title={positiveButtonText}
                                color={positiveButtonStyle && positiveButtonStyle.backgroundColor}
                            />
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};
T2SModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    negativeButtonText: PropTypes.string,
    positiveButtonText: PropTypes.string.isRequired,
    positiveButtonClicked: PropTypes.func.isRequired,
    negativeButtonClicked: PropTypes.func,
    requestClose: PropTypes.func.isRequired,
    positiveButtonStyle: ViewPropTypes.style,
    negativeButtonStyle: ViewPropTypes.style,
    positiveButtonTextStyle: TextPropTypes.style,
    negativeButtonTextStyle: TextPropTypes.style,
    descriptionTextStyle: TextPropTypes.style,
    titleTextStyle: TextPropTypes.style,
    dialogCancelable: PropTypes.bool,
    titleCenter: PropTypes.bool,
    textAllCaps: PropTypes.bool,
    positiveButtonDisabled: PropTypes.bool,
    customView: PropTypes.func,
    isTitleVisible: PropTypes.bool,
    negativeButtonId: PropTypes.string,
    positiveButtonId: PropTypes.string,
    titleId: PropTypes.string,
    descriptionId: PropTypes.string,
    modalContainerStyle: PropTypes.object
};

export default React.memo(T2SModal);
