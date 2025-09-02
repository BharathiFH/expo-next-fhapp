import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { isLandscapeScreen, isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { theme } from '../../Utils/StyleHelper';
import { MyResponsiveContext } from '../../Utils/helpers';
import useResponsiveStyle from 't2sbasemodule/UI/CommonUI/Style/UseResponsiveStyle';
import T2SResponsiveStyle from 't2sbasemodule/UI/CommonUI/Style/T2SResponsiveStyle';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 't2sbasemodule/Themes';

const T2SContainer = (props) => {
    const mode = useContext(MyResponsiveContext);
    const isLandscapeTabletWebDevice = isLandscapeScreen(mode);
    const isWebDevice = isWeb();
    const styles = useResponsiveStyle(containerStyles);
    const { children, style, containerStyle, hasBackGround, ...rest } = props;
    if (isLandscapeTabletWebDevice && isWebDevice) {
        return (
            <View style={StyleSheet.flatten([styles.section, style])} {...(rest?.nativeID ? { nativeID: rest?.nativeID } : {})}>
                {hasBackGround ? <LinearGradient colors={[Colors.white, Colors.transparent]} style={styles.overlay} /> : null}
                <View style={StyleSheet.flatten([styles.container, containerStyle])}>{children}</View>
            </View>
        );
    }
    return children;
};

const containerStyles = new T2SResponsiveStyle({
    defaultStyle: {
        section: {
            paddingVertical: theme.spacing[3],
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
        },
        container: {
            maxWidth: theme.containerWidth,
            width: '100%',
            paddingHorizontal: theme.spacing[5],
            marginHorizontal: 'auto'
        }
    },
    webStyle: {
        overlay: {
            ...StyleSheet.absoluteFill,
            height: '50vh'
        }
    }
});

export default T2SContainer;
