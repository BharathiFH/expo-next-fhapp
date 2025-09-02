import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';
import T2SResponsiveStyle from './T2SResponsiveStyle';
export const appDownloadStyle = new T2SResponsiveStyle({
    defaultStyle: {
        downloadAppText: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(15),
            textAlign: 'center'
        },
        brandPageDownloadAppText: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(14),
            textAlign: 'center',
            color: Colors.white
        },
        downloadBoldText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(15),
            color: Colors.black
        },
        brandPagedownloadBoldText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(18),
            color: Colors.white
        },
        downloadAppContainer: {
            borderRadius: 12,
            backgroundColor: Colors.white,
            alignItems: 'center',
            paddingVertical: 25,
            borderTopWidth: 10,
            borderColor: Colors.borderColor
        },
        storeDownloadView: {
            flexDirection: 'row',
            marginTop: 20,
            marginBottom: 20,
            marginHorizontal: -5
        },
        downloadButtonView: {
            flexGrow: 1,
            alignItems: 'center'
        },
        downloadContainerInnerView: {
            width: '65%'
        },
        downloadAppImage: {
            width: 130,
            borderRadius: 5,
            aspectRatio: 3 / 0.9,
            height: 38
        },
        flexStart: { alignItems: 'flex-start' },
        downloadAppTextFooter: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(15),
            textAlign: 'left',
            color: Colors.black
        },
        downloadButtonContainer: {
            flexBasis: 140,
            paddingHorizontal: 5
        },
        downloadImgContainer: {
            marginTop: 20,
            marginHorizontal: -5
        },
        downloadImg: {
            width: 140,
            paddingHorizontal: 5
        },
        downloadImageStyle: {
            height: 150,
            width: 120,
            marginTop: 20
        }
    },

    tabletLandscapeStyle: {
        downloadAppContainer: {
            borderRadius: 12,
            marginTop: 15,
            backgroundColor: Colors.white,
            alignItems: 'center',
            paddingVertical: 25
        },
        downloadContainerInnerView: {
            width: '85%'
        },
        downloadAppImage: {
            borderRadius: 5,
            aspectRatio: 3 / 0.9
        },
        downloadButtonView: {
            flexGrow: 1
        },
        zeroTopRadius: {
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0
        },
        zeroBottomRadius: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        }
    },
    webStyle: {
        downloadAppText: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(15),
            textAlign: 'left',
            color: Colors.black
        },
        brandPageDownloadAppText: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(18),
            textAlign: 'left',
            color: Colors.white
        },
        brandPagedownloadBoldText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(24),
            color: Colors.white
        },
        downloadContainerInnerView: { width: '50%' }
    }
});
