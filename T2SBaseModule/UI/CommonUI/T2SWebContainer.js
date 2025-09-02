import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Footer from '../../../FoodHubApp/FooterComponent/View/Footer';
import { isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { styles } from './Style/T2SWebContainerStyle';
import propType from 'prop-types';
import { MyResponsiveContext } from '../../Utils/helpers';
import { useSelector } from 'react-redux';
import { featureGateCSSEnabled, selectCustomerWebCSS } from '../../Utils/AppSelectors';

const isWebDevice = isWeb();

const T2SWebContainer = (props) => {
    const mode = useContext(MyResponsiveContext);
    const { isSmallScreenMode, isTabletPortraitMode } = mode;
    const { children, fullWidth } = props;
    const [headerHeight, setHeaderHeight] = useState(styles?.content?.paddingTop);
    const handleHeaderLayout = (event) => setHeaderHeight(event.nativeEvent.layout.height);
    const cssTemplate = useSelector((state) => selectCustomerWebCSS(state));
    const isfeatureGateCSSEnabled = useSelector((state) => featureGateCSSEnabled(state));

    let footerStyle = useMemo(() => {
        return isSmallScreenMode || isTabletPortraitMode ? styles.mobileBrowserContainer : styles.container;
    }, [isSmallScreenMode, isTabletPortraitMode]);

    if (isWebDevice) {
        return (
            <>
                {props.renderHeader && (
                    <View
                        style={{
                            height: headerHeight
                        }}>
                        <View style={StyleSheet.flatten([props.headerStyle, styles.header])} onLayout={handleHeaderLayout}>
                            {props.renderHeader()}
                        </View>
                    </View>
                )}
                <View
                    style={StyleSheet.flatten([
                        footerStyle,
                        props.setMinimumHeight && styles.content,
                        { paddingTop: isfeatureGateCSSEnabled && cssTemplate?.navbarHeight ? cssTemplate?.navbarHeight : headerHeight },
                        (isSmallScreenMode || isTabletPortraitMode) && styles.smallScreen,
                        props.contentStyle,
                        fullWidth && styles.containerFullWidth
                    ])}>
                    {children}
                </View>
                {props.showFooter ? (
                    <View style={styles.footerContainer}>
                        <Footer />
                    </View>
                ) : null}
            </>
        );
    }
    return children;
};

T2SWebContainer.defaultProps = {
    showFooter: true,
    setMinimumHeight: true,
    fullWidth: false
};
T2SWebContainer.propType = {
    showFooter: propType.bool,
    setMinimumHeight: propType.bool,
    contentStyle: propType.object,
    renderHeader: propType.func,
    headerStyle: propType.object
};

export default T2SWebContainer;
