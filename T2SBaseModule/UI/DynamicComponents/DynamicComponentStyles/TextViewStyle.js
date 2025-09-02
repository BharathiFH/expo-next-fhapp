import T2SResponsiveStyle from '../../CommonUI/Style/T2SResponsiveStyle';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { Colors } from '../../../Themes';

export const TextViewStyle = new T2SResponsiveStyle({
    defaultStyle: {
        textStyle: { fontSize: 16, fontFamily: FONT_FAMILY.MEDIUM, color: Colors.black },
        iconStyle: { marginRight: 7 },
        flexRow: { flexDirection: 'row', alignItems: 'center' },
        viewStyle: {
            paddingVertical: 5,
            marginHorizontal: 10
        }
    }
});
