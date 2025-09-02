import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const SwiperStyle = StyleSheet.create({
    mainContainer: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: Colors.white,
        borderRadius: 5,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 2,
            height: 1
        },
        shadowOpacity: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowRadius: 3,
        elevation: 2
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    imageView: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: Colors.foodhubPrimaryColor,
        alignItems: 'center'
    },
    textContainer: {
        flexDirection: 'column'
    },
    titleText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.BOLD,
        marginBottom: 5,
        color: Colors.textMain
    },
    descriptionText: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR,
        marginBottom: 5,
        color: Colors.textGrey
    },
    dotStyle: {
        backgroundColor: 'transparent'
    },
    countViewStyle: {
        position: 'absolute',
        top: 10,
        right: -3
    },
    countLessViewStyle: {
        position: 'absolute',
        top: 10,
        right: 3
    },
    countTextStyle: {
        color: Colors.white,
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR
    },
    mainDotViewStyle: {
        flexDirection: 'row'
    },
    dotFirstViewStyle: {
        height: 6,
        width: 6,
        borderRadius: 3,
        marginHorizontal: 1.4
    },
    dotSecondViewStyle: {
        top: 40,
        right: 52,
        height: 6,
        width: 6,
        borderRadius: 3
    },
    dotThirdViewStyle: {
        top: 40,
        right: 49,
        height: 6,
        width: 6,
        borderRadius: 3
    },
    selectedViewStyle: {
        backgroundColor: Colors.foodhubPrimaryColor
    },
    unSelectedViewStyle: {
        backgroundColor: Colors.borderColor
    },
    orderLengthMainView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderLengthTextView: {
        backgroundColor: Colors.black,
        paddingHorizontal: 6,
        paddingTop: 2,
        paddingBottom: 3,
        borderRadius: 8
    },
    container1: {
        backgroundColor: Colors.greenLight,
        margin: 5,
        paddingHorizontal: 13.5,
        paddingVertical: 15,
        borderColor: Colors.green,
        borderWidth: 1,
        borderRadius: 6,
        marginHorizontal: 8
    },
    container2: { paddingBottom: 10 },
    titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontFamily: FONT_FAMILY.BOLD, color: Colors.black, fontSize: setFont(15), capitalize: true, marginBottom: 5, width: '90%' },
    subtitle: { fontFamily: FONT_FAMILY.REGULAR, fontSize: setFont(12.5), color: Colors.black }
});
