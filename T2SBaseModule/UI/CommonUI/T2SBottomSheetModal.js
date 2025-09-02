import React from 'react';
import { Text, View } from 'react-native';
import T2SText from './T2SText';
import T2STouchableOpacity from './T2STouchableOpacity';
import styles from './Style/T2SBottomSheetModalStyles';
import { isValidElement, isValidString } from '../../Utils/helpers';
import { VIEW_ID } from '../../Utils/Constants';
import CustomIcon from '../CustomUI/CustomIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SModalWrapper from './T2SModalWrapper';
import { Colors } from '../../Themes';

const T2SBottomSheetModal = ({
    isVisible,
    requestClose = () => {},
    negativeButtonClicked,
    positiveButtonClicked,
    negativeButtonId = VIEW_ID.MODAL_NEGATIVE_BUTTON,
    positiveButtonId = VIEW_ID.MODAL_POSITIVE_BUTTON,
    positiveButtonText,
    negativeButtonText,
    title,
    description,
    screenName = 'Modal',
    customView,
    descriptionTextStyle,
    onModalHide = () => {},
    descriptioWrapperStyle,
    titleWrapperStyle
}) => {
    return (
        <T2SModalWrapper
            style={styles.container}
            hasBackdrop
            animationInTiming={250}
            animationOutTiming={250}
            animationIn={'slideInUp'}
            visible={isVisible}
            onBackdropPress={requestClose}
            onModalHide={onModalHide}>
            <View style={styles.modalContainer}>
                {title ? (
                    <View style={[styles.tileDescriptionWrapper, titleWrapperStyle]}>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.MODAL_TITLE_TEXT}
                            style={[styles.title, isValidString(description) && [{ paddingBottom: 5 }]]}>
                            {title}
                        </T2SText>
                        <RenderCloseIcon requestClose={requestClose} screenName={screenName} />
                    </View>
                ) : null}
                <View style={[styles.tileDescriptionWrapper, descriptioWrapperStyle]}>
                    {isValidElement(customView) ? (
                        customView
                    ) : isValidString(description) ? (
                        <T2SText
                            id={VIEW_ID.MODAL_DESCRIPTION_TEXT}
                            screenName={screenName}
                            style={[styles.description, descriptionTextStyle]}>
                            {description}
                        </T2SText>
                    ) : null}
                    {!title ? <RenderCloseIcon requestClose={requestClose} screenName={screenName} /> : null}
                </View>
                <View style={styles.buttonView}>
                    <T2STouchableOpacity
                        screenName={screenName}
                        id={negativeButtonId}
                        style={[styles.button, styles.negativeButton]}
                        onPress={negativeButtonClicked}>
                        <Text style={[styles.buttonLabel, styles.negativeButtonLabel]}>{negativeButtonText}</Text>
                    </T2STouchableOpacity>
                    <T2STouchableOpacity
                        screenName={screenName}
                        id={positiveButtonId}
                        style={[styles.button, styles.positiveButton]}
                        onPress={positiveButtonClicked}>
                        <Text style={[styles.buttonLabel, styles.positiveButtonLabel]}>{positiveButtonText}</Text>
                    </T2STouchableOpacity>
                </View>
            </View>
        </T2SModalWrapper>
    );
};

const RenderCloseIcon = ({ screenName, requestClose }) => {
    return (
        <T2STouchableOpacity
            style={styles.closeIconView}
            onPress={requestClose}
            screenName={screenName}
            id={VIEW_ID.DELETE_POPUP_MODAL_CLOSE_ICON}>
            <CustomIcon name={FONT_ICON.CLOSE} size={20} color={Colors.textMain} />
        </T2STouchableOpacity>
    );
};

export default React.memo(T2SBottomSheetModal);
