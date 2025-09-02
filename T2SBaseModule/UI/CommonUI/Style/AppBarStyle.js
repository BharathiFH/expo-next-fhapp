import { Dimensions, StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { Colors } from '../../../Themes';
import { setFont } from '../../../Utils/ResponsiveFont';
import { isWeb } from '../../../../AppModules/BaseModule/GlobalAppHelper';

let SCREEN_HEIGHT = Dimensions.get('window').height;

let takeawayHeight = SCREEN_HEIGHT * (7.5 / 100);
export default StyleSheet.create({
    headerStyle: isWeb()
        ? {
              paddingHorizontal: 10,
              elevation: 0,
              height: takeawayHeight,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: 10,
              backgroundColor: Colors.white
          }
        : {
              paddingHorizontal: 10,
              paddingVertical: 15,
              elevation: 0,
              height: takeawayHeight,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: 10,
              backgroundColor: Colors.white
          },
    logoWrapper: {
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: -24
    },
    logoImage: {
        width: 170,
        height: 25,
        marginHorizontal: 'auto'
    },
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    headerIconStyle: {
        // increased zIndex for icon to make sure it stays on top, so that touch area will work
        zIndex: 16,
        flexDirection: 'row'
    },
    headerLeftIconStyle: {
        padding: 6
    },

    elevation: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.62,
        elevation: 5
    },
    noElevation: {
        paddingHorizontal: 10,
        elevation: 0,
        height: 60,
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    contentStyle: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        marginLeft: 0
    },
    titleStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: customerAppTheme.colors.text
    },
    headerTextStyle: {
        fontSize: setFont(18),
        marginLeft: 8,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        maxWidth: '70%',
        color: Colors.textMain
    },
    backHeaderTextStyle: {
        fontSize: setFont(17),
        marginLeft: 8,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.textMain
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        flex: 1
    },
    customViewStyle: {
        paddingLeft: 10,
        flex: 1
    },
    additionalInfoContainer: { backgroundColor: Colors.defaulGrey },
    headerLogo: {
        aspectRatio: 3.5,
        height: 45,
        marginTop: 4
    },
    mainLogoView: {
        flexDirection: 'row'
    },
    mainLogoSubView: {
        flex: 0.9
    },
    loginStyle: { justifyContent: 'center', marginLeft: 'auto', marginRight: 10 }
});
