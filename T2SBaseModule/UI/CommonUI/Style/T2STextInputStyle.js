import { StyleSheet, Platform } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
import { Colors } from '../../../Themes';
import { isIOS } from '../../../../AppModules/BaseModule/Helper';
import { mergeWebStyle } from '../../../../AppModules/BaseModule/GlobalAppHelper';

const mobileStyle = {
    labelWrapper: { paddingBottom: isIOS() ? 5 : 0 },
    labelStyle: {
        color: Colors.textGrey,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(12),
        ...Platform.select({
            web: {
                marginBottom: 3
            }
        })
    },
    requiredStyle: {
        color: Colors.primaryColor
    },
    textInputWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        marginBottom: 3
    },
    textInputStyle: {
        color: Colors.textMain,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    errorStyle: {
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12)
    },
    errorBorder: {
        borderBottomColor: Colors.primaryColor
    },
    textInputWrapperWithValue: {
        borderBottomColor: Colors.textMain
    }
};

const webStyle = {
    textInputStyle: {
        outlineStyle: 'none'
    }
};

export default StyleSheet.create(mergeWebStyle(mobileStyle, webStyle));
