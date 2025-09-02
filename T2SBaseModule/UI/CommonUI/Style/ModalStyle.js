import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
import { mergeWebTabletMobileStyle } from 't2sbasemodule/Utils/helpers';

const mobileStyle = {
    modal: {
        margin: 0,
        paddingHorizontal: 15,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    modalWeb: {
        position: 'fixed',
        touchAction: 'none',
        overflowY: 'auto'
    },
    customBackdrop: {
        backgroundColor: Colors.overlay,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute'
    },
    customBackdropWeb: {
        position: 'fixed',
        width: '100vw',
        // fallback for dynamic viewport height for mobile browser
        height: '100vh',
        // eslint-disable-next-line no-dupe-keys
        height: '100dvh'
    },
    keyboardAvoidingViewContainer: {
        width: '100%'
    },
    modalContainer: {
        backgroundColor: Colors.white,
        width: '100%',
        maxWidth: 445,
        borderRadius: 18,
        paddingVertical: 30,
        paddingHorizontal: 15,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 11
        },
        shadowRadius: 15,
        // Ensure modal is properly positioned and doesn't affect background
        alignSelf: 'center',
        elevation: 5
    },
    modalTitle: {
        color: Colors.black,
        fontSize: setFont(20),
        fontFamily: FONT_FAMILY.BOLD,
        paddingRight: 16,
        bottom: 10,
        width: '95%'
    },
    closeBtn: {
        backgroundColor: Colors.grey,
        position: 'absolute',
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        right: 8,
        top: 10,
        borderRadius: 38,
        zIndex: 1
    },
    iconSize: {
        iconSize: 18
    },
    mobileBottomPosition: {
        justifyContent: 'flex-end',
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    bottomRadius: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    mainContainer: { paddingTop: 10 }
};
const webStyle = {
    modalContainer: {
        backgroundColor: Colors.white,
        width: '100%',
        maxWidth: 445,
        borderRadius: 10,
        paddingVertical: 25,
        paddingHorizontal: 20,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 11
        },
        shadowRadius: 15,
        marginVertical: 'auto'
    },
    keyboardContentContainer: {
        flex: 1,
        justifyContent: 'center'
    }
};
export default StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, webStyle));
