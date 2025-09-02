import React, { useContext, useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Box from 't2sbasemodule/MUI/Box';
import Footer from '../../FoodHubApp/FooterComponent/View/Footer';
import { MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { isLandscapeScreen, isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';

const Page = (props) => {
    const { fullHeight = false, bgColor = 'white', showFooter, children } = props;
    const dynamicHeaderHeight = useSelector((state) => state?.appState?.dynamicHeaderHeight);
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const backgroundColor = Colors[bgColor];
    const mode = useContext(MyResponsiveContext);
    const isLandscapeDevice = isLandscapeScreen(mode);
    const headerHeight = isWeb() && isLandscapeDevice ? dynamicHeaderHeight : 0;

    // Define styles for the section element
    const styles = useMemo(() => {
        return StyleSheet.create({
            page: {
                paddingTop: headerHeight,
                backgroundColor: backgroundColor,
                height: fullHeight ? '100%' : 'auto'
            }
        });
    }, [backgroundColor, fullHeight, headerHeight]);

    return (
        <Box style={styles.page} {...props}>
            {children}
            {showFooter ? <Footer /> : null}
        </Box>
    );
};

export default React.memo(Page);
