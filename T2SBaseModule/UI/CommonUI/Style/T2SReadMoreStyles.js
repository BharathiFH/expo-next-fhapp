import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
import T2SResponsiveStyle from './T2SResponsiveStyle';

export const readMoreStyles = new T2SResponsiveStyle({
    defaultStyle: {
        readMoreStyle: {
            fontFamily: FONT_FAMILY.MEDIUM,
            fontSize: setFont(12),
            color: Colors.blue
        }
    }
});
