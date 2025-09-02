import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import Colors from '../../../Themes/Colors';
import { setFont } from '../../../Utils/ResponsiveFont';

const timerComponentStyle = StyleSheet.create({
    timerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingStart: 5,
        paddingEnd: 4,
        color: Colors.green,
        fontSize: setFont(14),
        letterSpacing: 0.5
    }
});
export default timerComponentStyle;
