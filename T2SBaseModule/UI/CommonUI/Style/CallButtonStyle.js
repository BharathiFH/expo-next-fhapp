import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from '../../../Themes';
import { setFont, setFontWeb } from '../../../Utils/ResponsiveFont';
import { mergeWebTabletMobileStyle } from '../../../Utils/helpers';
let deviceWidth = Dimensions.get('window').width - 50;

const mobileStyle = {
    buttonMainContainer: { alignSelf: 'flex-start' },
    buttonViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth / 2.1
    },
    buttonTextStyle: {
        color: Colors.primaryColor,
        paddingVertical: 10
    },
    btnBottomText: { textAlign: 'center', fontSize: setFont(10), padding: 5, color: Colors.textGrey },
    customBottomMargin: { marginBottom: Platform.OS === 'ios' ? 15 : 30 }
};
const tabletStyle = {
    buttonMainContainer: { alignSelf: 'flex-start' },
    buttonViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    }
};

const webStyle = {
    buttonMainContainer: { alignSelf: 'flex-start' },
    buttonViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 5
    },
    btnBottomText: { textAlign: 'center', fontSize: setFontWeb(10), padding: 5, color: Colors.textGrey }
};

export const CallButtonStyle = StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, tabletStyle, webStyle));
