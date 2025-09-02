import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';

const { height } = Dimensions.get('window');

export const CENTER_WIDTH = '88%';
export const MARGIN_WIDTH = '6%';

export const styles = StyleSheet.create({
    fastImageStyle: {
        overflow: 'hidden'
    },
    content: {
        minHeight: height,
        paddingTop: 60
    },
    mobileBrowserContainer: {
        alignSelf: 'center',
        width: '100%'
    },
    container: {
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: '4%',
        backgroundColor: Colors.white
    },
    containerFullWidth: {
        width: '100%',
        backgroundColor: Colors.white,
        paddingHorizontal: 0
    },
    header: {
        position: 'fixed',
        left: 0,
        right: 0
    },
    footerContainer: {
        elevation: 5,
        paddingTop: 15,
        backgroundColor: Colors.white,
        zIndex: 2,
        alignSelf: 'center',
        width: '100%'
    },
    smallScreen: { flex: 1, paddingTop: 0 }
});
