import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
import { mergeWebTabletMobileStyle } from 't2sbasemodule/Utils/helpers';

const mobileStyle = {
    dateTimePickerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    dateTimePickerContainer: {
        flexGrow: 0.1,
        backgroundColor: Colors.grey,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    buttonsParentViewStyle: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButtonViewStyle: {
        flex: 1,
        marginRight: 5
    },
    cancelButtonStyle: {
        backgroundColor: Colors.redLight,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.borderColor
    },
    cancelButtonTextStyle: {
        color: Colors.textGrey,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        letterSpacing: 1
    },
    saveButtonViewStyle: {
        flex: 1,
        marginLeft: 5
    },
    saveButtonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        letterSpacing: 1,
        color: Colors.buttonTextColor
    }
};
const tabStyle = {
    dateTimePickerContainer: {
        flexGrow: 0.1,
        backgroundColor: Colors.grey,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    cancelButtonViewStyle: {
        flexGrow: 0.2,
        marginRight: 5
    },
    saveButtonViewStyle: {
        flexGrow: 0.5,
        marginLeft: 5
    }
};

const webStyle = {
    cancelButtonStyle: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.borderColor
    },
    cancelButtonViewStyle: {
        flexGrow: 0.15,
        marginRight: 6
    },
    saveButtonViewStyle: {
        flexGrow: 0.3
    }
};

export default StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, tabStyle, webStyle));
