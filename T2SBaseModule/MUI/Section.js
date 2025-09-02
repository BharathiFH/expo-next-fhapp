import React, { useMemo, useContext } from 'react';
import { View, ImageBackground, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from './Utils/context';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { isWebLargeScreenMode } from '../../AppModules/BaseModule/GlobalAppHelper';
import Box from 't2sbasemodule/MUI/Box';

const Section = (props) => {
    const { fullHeight = false, fullWidth = false, bgColor = 'white', bgImage, verticalAign, horizontalAlign, children } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const mode = useContext(MyResponsiveContext);
    const largeScreen = isWebLargeScreenMode(mode);
    const backgroundColor = Colors[bgColor];
    const containerWidth = theme.containerWidth;
    const containerPadding = largeScreen ? theme?.containerPadding : 0;

    // Define styles for the section element
    const styles = useMemo(() => {
        return StyleSheet.create({
            section: {
                backgroundColor: backgroundColor,
                height: fullHeight ? '100%' : 'auto',
                alignItems: horizontalAlign,
                justifyContent: verticalAign
            },
            bgImage: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                right: 0
            },
            container: {
                width: '100%',
                marginHorizontal: 'auto',
                height: fullHeight ? '100%' : 'auto',
                maxWidth: fullWidth ? '100%' : containerWidth,
                paddingHorizontal: containerPadding
            }
        });
    }, [backgroundColor, containerWidth, containerPadding, fullHeight, fullWidth, horizontalAlign, verticalAign]);

    return (
        <ImageBackground source={bgImage}>
            <Box style={styles.section} {...props}>
                <View style={styles.container}>{children}</View>
            </Box>
        </ImageBackground>
    );
};

export default React.memo(Section);
