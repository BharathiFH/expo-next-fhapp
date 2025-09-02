import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { setFont } from '../../../Utils/ResponsiveFont';
import { mergeWebTabletMobileStyle } from '../../../Utils/helpers';
let deviceWidth = Dimensions.get('window').width - 50;

const mobileStyle = StyleSheet.create({
    buttonViewStyle: {
        paddingVertical: 5,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth / 1.9
    },
    buttonTextStyle: {
        color: Colors.primaryColor,
        paddingVertical: 10
    },
    btnBottomText: { textAlign: 'center', fontSize: setFont(10), padding: 5, color: Colors.textGrey }
});

const webStyle = {
    buttonViewStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 5
    }
};

export const chatButtonStyle = StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, webStyle));
