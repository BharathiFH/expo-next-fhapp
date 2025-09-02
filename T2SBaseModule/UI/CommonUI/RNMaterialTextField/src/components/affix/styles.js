import { StyleSheet } from 'react-native';
import { isIOS } from 'appmodules/BaseModule/Helper';
export default StyleSheet.create({
    container: {
        top: isIOS() ? 2.5 : 2,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    }
});
