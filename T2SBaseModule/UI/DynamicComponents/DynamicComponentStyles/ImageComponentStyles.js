import T2SResponsiveStyle from '../../CommonUI/Style/T2SResponsiveStyle';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';

export const styles = new T2SResponsiveStyle({
    defaultStyle: {
        viewStyle: {
            borderRadius: 12,
            overflow: 'hidden',
            marginVertical: 10
        },
        imageStyle: {
            height: 180,
            borderRadius: 12,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10
        },
        textStyle: {
            color: Colors.black,
            fontSize: 16,
            fontFamily: FONT_FAMILY.SEMI_BOLD
        }
    }
});
