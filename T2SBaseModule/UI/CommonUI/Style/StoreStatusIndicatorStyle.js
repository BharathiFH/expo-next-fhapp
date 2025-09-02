import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
import T2SResponsiveStyle from './T2SResponsiveStyle';

export const StoreStatusIndicatorStyles = new T2SResponsiveStyle({
    defaultStyle: {
        StoreStatusIndicatorView: {
            backgroundColor: 'rgba(0, 154, 144,0.1)',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            flexDirection: 'row'
        },
        StoreStatusIndicatorIconView: {
            backgroundColor: 'rgba(0, 154, 144,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            borderRadius: 30,
            flexDirection: 'row',
            width: 110
        },
        statusText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(12),
            color: Colors.green,
            letterSpacing: 0,
            paddingLeft: 5,
            textAlign: 'center'
        },
        timeText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(10),
            color: Colors.green,
            letterSpacing: 0,
            paddingLeft: 10
        }
    },
    webLargeScreenStyle: {
        StoreStatusIndicatorView: {
            backgroundColor: 'rgba(0, 154, 144,0.1)',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            flexDirection: 'row',
            height: 45
        },
        statusText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(11),
            color: Colors.green,
            letterSpacing: 0
        },
        timeText: {
            fontFamily: FONT_FAMILY.BOLD,
            fontSize: setFont(8),
            color: Colors.green,
            letterSpacing: 0,
            paddingLeft: 10
        }
    }
});
