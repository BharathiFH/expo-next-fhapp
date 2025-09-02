import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const addButtonWidth = 26;
export const addButtonHeight = 30;

export default StyleSheet.create({
    itemAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: addButtonHeight,
        borderWidth: 1.5,
        borderRadius: 2,
        borderColor: Colors.primaryColor,
        backgroundColor: Colors.white
    },
    buttonBgView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButtonBgView: {
        justifyContent: 'center',
        width: addButtonWidth * 2.95,
        alignItems: 'center',
        height: '100%'
    },
    countTextView: {
        justifyContent: 'center',
        width: addButtonWidth,
        alignItems: 'center'
    },
    textStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    quantityTextStyle: {
        color: Colors.textMain,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    disableOpacityStyle: {
        opacity: 0.8
    },
    buttonMinusContainer: {
        width: addButtonWidth,
        height: addButtonHeight,
        borderRightWidth: 1,
        borderColor: Colors.primaryColor,
        justifyContent: 'center'
    },
    buttonAddContainer: {
        width: addButtonWidth,
        height: addButtonHeight,
        borderLeftWidth: 1,
        borderColor: Colors.primaryColor,
        justifyContent: 'center'
    }
});
