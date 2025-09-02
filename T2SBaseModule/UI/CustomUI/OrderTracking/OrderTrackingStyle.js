import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from '../../../Themes';
import { isFoodHubApp } from '../../../Utils/helpers';

export default StyleSheet.create({
    orderTrackingContainer: {
        paddingVertical: 20,
        paddingBottom: 10,
        paddingHorizontal: 15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    orderStatusContainer: {
        paddingBottom: 0,
        paddingTop: 0
    },
    statusPointContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: -6
    },
    dummyView: {
        flex: 1,
        height: 2,
        alignSelf: 'center'
    },
    statusPoint: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 2,
        alignSelf: 'center'
    },
    lineViewHorizontal: {
        height: 1,
        flex: 1,
        backgroundColor: Colors.green
    },
    isDeliveredStyle: {
        flex: 1,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: Colors.greenLight,
        borderColor: Colors.borderColor
    },
    statusTextContainer: {
        flexDirection: 'row',
        marginTop: 0
    },
    statusTextView: {
        minWidth: 54,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        letterSpacing: 0
    },
    statusTextViewHorizontal: {
        flex: 1,
        marginHorizontal: 5
    },
    statusIcon: {
        paddingHorizontal: 5,
        alignSelf: 'center'
    },
    statusText: {
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        fontSize: 10,
        marginTop: -4,
        textTransform: 'uppercase'
    },
    lottieAnimationStyle: { width: 30, height: 30 },
    dashedView: {
        borderStyle: 'dashed',
        flex: 1
    },
    dashedStyle: {
        borderTopWidth: 1,
        borderTopRadius: 5,
        borderColor: Colors.borderColor
    },
    dashedStyleIOS: {
        // Since dashed borderstyle is not woking in IOS as it is in AOS
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.borderColor
    },
    dotedChildView: {
        position: 'absolute',
        flex: 1,
        height: 1,
        borderRadius: 5,
        backgroundColor: isFoodHubApp() ? Colors.greenLight : Colors.white,
        zIndex: 1,
        width: '120%',
        left: -5
    }
});
