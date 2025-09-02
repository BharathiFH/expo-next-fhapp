import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';

export const TextColorStyle = StyleSheet.create({
    black: {
        color: Colors.black
    },
    blue: {
        color: Colors.blue
    },
    bold: { fontFamily: FONT_FAMILY.BOLD }
});
