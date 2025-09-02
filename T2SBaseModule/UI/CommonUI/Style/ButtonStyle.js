import { StyleSheet } from 'react-native';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
import { isWeb, isLandscapeDevice } from '../../../../AppModules/BaseModule/GlobalAppHelper';

//This is not the best way to handle this method but for the time being we are keeping it this way and will change it later
export const mergeWebTabletMobileStyle = (mobileStyle, tabStyle, webStyle = {}) => {
    return isWeb() && isLandscapeDevice
        ? { ...mobileStyle, ...tabStyle, ...webStyle }
        : isLandscapeDevice
        ? { ...mobileStyle, ...tabStyle }
        : mobileStyle;
};

const mobileStyle = {
    textStyle: {
        color: Colors.buttonTextColor,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center'
    },
    textStyleBlack: {
        color: customerAppTheme.colors.text,
        fontSize: setFont(16)
    },
    contentStyle: {
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        borderColor: Colors.primaryColor
    },
    outlineButtonStyle: {
        // borderColor: '#EEEEEE',
    },
    flatButtonTextStyle: {
        color: customerAppTheme.colors.link
    },
    buttonIconStyle: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    loader: {
        marginLeft: 5
    },
    disabledStyle: {
        opacity: 0.5
    }
};

const tabStyle = {
    buttonIconStyle: {
        width: 20,
        height: 20,
        marginRight: 5
    }
};

const webStyle = {
    buttonIconStyle: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    textStyleBlack: {
        color: Colors.textMain,
        fontSize: setFont(16)
    }
};

export default StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, tabStyle, webStyle));
