import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';
const alpha = '1a';
export const styles = StyleSheet.create({
    addOnContainer: {
        flexDirection: 'row'
    },
    wrapText: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4
    },
    plus: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGrey,
        margin: 3,
        alignSelf: 'center'
    },
    addOn: {
        color: Colors.textMain,
        borderWidth: 1.3,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginBottom: 8,
        marginHorizontal: 6,
        borderRadius: 4,
        backgroundColor: Colors.blue + alpha,
        borderColor: Colors.blue
    },
    addOnTransparent: {
        color: Colors.transparent,
        borderWidth: 1.3,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginBottom: 8,
        marginHorizontal: 6,
        borderRadius: 4,
        backgroundColor: Colors.transparent,
        borderColor: Colors.transparent
    },
    addOnTransparentContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.transparent
    }
});
