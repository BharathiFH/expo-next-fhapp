import { Colors } from 't2sbasemodule/Themes';
import T2SResponsiveStyle from 't2sbasemodule/UI/CommonUI/Style/T2SResponsiveStyle';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const ConfirmModalStyle = new T2SResponsiveStyle({
    defaultStyle: {
        promptContainer: {
            width: '100%',
            backgroundColor: Colors.white,
            paddingVertical: 12,
            paddingHorizontal: 10
        },
        modalWrapper: { flex: 1, justifyContent: 'flex-end' },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        title: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(18),
            color: Colors.textMain
        },
        desc: {
            fontFamily: FONT_FAMILY.REGULAR,
            fontSize: setFont(15),
            color: Colors.textGrey,
            textAlign: 'left',
            marginRight: 20,
            marginVertical: 10
        },
        closeIconStyle: {
            backgroundColor: Colors.grey,
            borderRadius: 45,
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: 40,
            margin: 5
        },
        footer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20
        },
        cancelButton: {
            flex: 1,
            borderWidth: 2,
            backgroundColor: 'transparent'
        },
        acceptButton: {
            flex: 1,
            backgroundColor: Colors.primaryColor,
            marginHorizontal: 10
        },
        buttonTxt: {
            color: Colors.primaryColor,
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(14),
            letterSpacing: 1,
            textTransform: 'uppercase'
        },
        confirmBtnText: {
            color: Colors.white,
            textTransform: 'uppercase'
        }
    },
    webLargeScreenStyle: {
        promptContainer: {
            backgroundColor: Colors.white,
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 12
        },
        modalWrapper: {
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
});
