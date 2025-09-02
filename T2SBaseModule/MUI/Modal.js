import React, { useMemo, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { bodyScroll } from 't2sbasemodule/Utils/StyleHelper';
import Card from './Card';
import Box from './Box';
import T2SStatusBar from '../UI/CommonUI/T2SStatusBar';
import T2SModalWrapper from '../UI/CommonUI/T2SModalWrapper';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from './Utils/context';
import { isValidElement } from '../Utils/helpers';

const screenHeight = Dimensions.get('window').height;
const Modal = (props) => {
    const {
        size = 'sm',
        p = 'md',
        withCard = true,
        showClose = false,
        closeElevation = false,
        children,
        color,
        visible = false,
        requestClose,
        disablebackDrop = false,
        height = null,
        animationIn = 'slideInUp'
    } = props;
    const theme = useTheme();
    const isFocused = useIsFocused();
    const modalTheme = theme?.component.modal;
    const modalSize = modalTheme?.size[size]?.width;
    const maxHeight = modalTheme?.size[size]?.height ?? 767;
    const margin = modalTheme?.size[size]?.margin ?? 'xxl';
    const borderRadius = size === 'fullScreen' ? 'none' : size;
    const dialogHeight = isValidElement(height) ? height : screenHeight - theme?.spacing[margin] * 2;

    useEffect(() => {
        props.visible && bodyScroll('hidden', true);
        return () => {
            props.visible && bodyScroll('unset', true);
        };
        //eslint-disable-next-line
    }, []);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                modalDialog: {
                    maxHeight: maxHeight,
                    height: dialogHeight,
                    width: '100%',
                    maxWidth: modalSize,
                    overflow: 'hidden',
                    marginHorizontal: 'auto'
                },
                card: {
                    height: '100%',
                    overflow: 'hidden'
                }
            }),
        [dialogHeight, modalSize, maxHeight]
    );

    const renderContent = withCard ? (
        <Card
            style={styles.card}
            onRequestClose={requestClose}
            closeElevation={closeElevation}
            radius={borderRadius}
            showClose={showClose}
            color={color}
            p={p}
            {...props}>
            {children}
        </Card>
    ) : (
        children
    );

    const handleBackDropPress = () => {
        !disablebackDrop && requestClose();
    };

    return (
        <T2SModalWrapper
            style={{ margin: 0 }}
            isVisible={visible && isFocused}
            animationIn={animationIn}
            useNativeDriverForBackdrop={true}
            onBackdropPress={() => handleBackDropPress()}
            onRequestClose={() => requestClose()}
            {...props}>
            <T2SStatusBar isModal={true} />
            <Box my={margin} style={styles.modalDialog}>
                {renderContent}
            </Box>
        </T2SModalWrapper>
    );
};

export default Modal;
