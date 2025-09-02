import React from 'react';
import Modal from 'react-native-modal';
import { T2SCustomStatusBar } from './T2SStatusBar';
import { Colors } from '../../Themes';

export default function T2SModalWrapper(props) {
    return (
        <>
            {props?.isVisible === true && <T2SCustomStatusBar isModal={true} />}
            <Modal backdropColor={props?.backdropColor ? props?.backdropColor : Colors.overlay} {...props} />
        </>
    );
}
