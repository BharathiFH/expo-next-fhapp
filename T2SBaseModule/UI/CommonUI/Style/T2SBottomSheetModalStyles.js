import { StyleSheet } from 'react-native';
import Colors from '../../../Themes/Colors';
import { setFont } from '../../../Utils/ResponsiveFont';
import { FONT_FAMILY } from '../../../Utils/Constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end'
    },
    modalContainer: {
        justifyContent: 'center',
        backgroundColor: Colors.white,
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 21,
        paddingBottom: 28
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 7,
        paddingVertical: 12,
        borderRadius: 5
    },
    negativeButton: {
        borderColor: Colors.primaryColor,
        borderWidth: 1
    },
    positiveButton: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1
    },
    title: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.BOLD,
        textAlign: 'center',
        color: Colors.textMain
    },
    buttonLabel: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.BOLD,
        textAlign: 'center'
    },
    positiveButtonLabel: {
        color: Colors.buttonTextColor
    },
    negativeButtonLabel: {
        color: Colors.primaryColor
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    description: {
        flex: 1,
        color: Colors.black,
        fontSize: setFont(14),
        marginVertical: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'left'
    },
    closeIconView: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: Colors.grey
    },
    tileDescriptionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15
    }
});

export default styles;
