import React, { useEffect } from 'react';

import { LOCALIZATION_STRINGS } from '../../../../AppModules/LocalizationModule/Utils/Strings';
import Prompt from './Prompt';
import T2SButton from '../../CommonUI/T2SButton';
import { ConfirmModalStyle } from './style';
import useResponsiveStyle from '../../CommonUI/Style/UseResponsiveStyle';
import { View } from 'react-native';
import { removeLegalItems, setIsLegalAgeModalOpen, setLegalAgeConsent } from '../../../../AppModules/BasketModule/Redux/BasketAction';
import { useDispatch } from 'react-redux';
import { Colors } from '../../../Themes';
import ModalWrapper from '../../../../CustomerApp/Navigation/ModalWrapper';
import { MODAL_TYPES } from '../../../../CustomerApp/Utils/ModalConstants';

const ConfirmModal = (props) => {
    const confirmStyle = useResponsiveStyle(ConfirmModalStyle);
    const dispatch = useDispatch();

    const handleLegalAgeModal = (value) => {
        dispatch(setIsLegalAgeModalOpen(value));
    };

    useEffect(() => {
        handleLegalAgeModal(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClose = () => {
        const { legalItems, cartID, storeID, isFromReOrder } = props?.route?.params || {};
        if (isFromReOrder) {
            dispatch(removeLegalItems(legalItems, cartID, storeID));
        }
        props?.navigation?.goBack();
        handleLegalAgeModal(false);
    };

    const onAccept = () => {
        props?.route?.params?.onAccept();
        dispatch(setLegalAgeConsent(true));
        handleLegalAgeModal(false);
    };

    return (
        <ModalWrapper webType={MODAL_TYPES.AUTO} mobileType={MODAL_TYPES.BOTTOM_SHEET}>
            <View style={confirmStyle.modalWrapper}>
                <Prompt style={confirmStyle.promptContainer}>
                    <Prompt.Header onClose={onClose} styles={confirmStyle}>
                        <Prompt.Title style={confirmStyle.title}>{LOCALIZATION_STRINGS.AGE_RESTRICTED_ITEM}</Prompt.Title>
                    </Prompt.Header>
                    <Prompt.Describtion style={confirmStyle.desc}>{LOCALIZATION_STRINGS.AGE_RESTRICTED_ITEM_CONTENT}</Prompt.Describtion>
                    <Prompt.Footer style={confirmStyle.footer}>
                        <T2SButton
                            style={confirmStyle.cancelButton}
                            buttonTextStyle={[confirmStyle.buttonTxt, { color: Colors.primaryColor }]}
                            mode={'outlined'}
                            title={LOCALIZATION_STRINGS.CANCEL}
                            onPress={onClose}
                        />
                        <T2SButton
                            style={confirmStyle.acceptButton}
                            buttonTextStyle={[confirmStyle.buttonTxt, confirmStyle.confirmBtnText]}
                            title={LOCALIZATION_STRINGS.AGREE}
                            onPress={onAccept}
                        />
                    </Prompt.Footer>
                </Prompt>
            </View>
        </ModalWrapper>
    );
};

export default ConfirmModal;
