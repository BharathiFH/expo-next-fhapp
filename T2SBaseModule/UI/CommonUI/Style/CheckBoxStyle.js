import { StyleSheet } from 'react-native';
import Colors from '../../../Themes/Colors';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const CheckBoxStyle = StyleSheet.create({
    orderTypeViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5
    },
    checkBoxFillStyle: {
        color: Colors.primaryColor
    },
    checkBoxTextStyle: {
        color: Colors.black,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingLeft: 8
    },
    checkBoxUnFillStyle: {
        color: Colors.textGrey
    }
});
