import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    openHoursContainer: {
        margin: 0
    },
    openHoursRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderLeftColor: Colors.borderColor,
        borderLeftWidth: 1
    },
    backgroundWhite: {
        backgroundColor: Colors.white
    },
    flexPointTwo: {
        flex: 0.2
    },
    flexPointFour: {
        flex: 0.4
    },
    flexPointEight: {
        flex: 0.8
    },
    paddingVerticalEight: {
        paddingVertical: 8
    },
    openHoursCellContainer: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 5,
        borderRightColor: Colors.borderColor,
        borderRightWidth: 1
    },
    headerBorderStyle: {
        backgroundColor: Colors.textGrey
    },
    headerTextStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        paddingVertical: 5
    },
    borderTopRadius: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    borderBottomRadius: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    cellTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGrey,
        paddingVertical: 5
    },
    closedTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.red,
        paddingVertical: 5
    },
    amPmTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR
    },
    cellTodayTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.textMain,
        paddingVertical: 5,
        fontWeight: '500'
    },
    amPmTodayTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.textMain
    },
    closedTodayTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.red,
        paddingVertical: 5
    }
});
