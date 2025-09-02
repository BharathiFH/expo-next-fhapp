import React, { useContext, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID, WALLET_IMAGE } from './Utils/TotalSavingsConstant';
import styles from './TotalSavingsStyle';
import { getRoundedAmount, isFoodHubApp, MyResponsiveContext } from '../../../Utils/helpers';
import Colors from '../../../Themes/Colors';
import { LARGE_SCREEN_WIDTH } from '../../../Utils/Constants';
import { isWeb } from '../../../../AppModules/BaseModule/GlobalAppHelper';
/**
 * How to use this widget?
 * Step 1: Import TotalSavings.js in your code
 * Step 2: Add widget Component in JSX and Sent below params as props
 * @param {totalSavingsAmount:string, currencySymbol:string, screenName:string} props
 * Sample Code:
 * import import TotalSavingsWidget from 't2sbasemodule/UI/CustomUI/TotalSavings/TotalSavings';
 * JSX: <TotalSavingsWidget currencySymbol={'£'} totalSavingsAmount={'2000'} screenName={SCREEN_NAME.HOME_SCREEN} />
 */

const isWebDevice = isWeb();
const TotalSavings = (props) => {
    const { totalSavingsAmount, currencySymbol, screenName, color = Colors.primaryColor } = props;
    const mode = useContext(MyResponsiveContext);
    const [screenWidth, setScreenWidth] = useState(LARGE_SCREEN_WIDTH * 1.5);
    useEffect(() => {
        function handleResize() {
            if (screenWidth !== window?.innerWidth) {
                setScreenWidth(window?.innerWidth);
            }
        }

        if (isWebDevice) {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [screenWidth]);

    return (
        <View style={styles.totalSavingsContainerFoodhub}>
            <View style={styles.walletImagContainer}>
                <Image
                    source={WALLET_IMAGE}
                    style={
                        isFoodHubApp()
                            ? [
                                  styles.walletImageFoodhub,
                                  isWebDevice && {
                                      width: screenWidth * (mode?.isTabletLandscapeMode ? 0.22 : 0.15)
                                  }
                              ]
                            : styles.walletImage
                    }
                />
            </View>
            <View style={styles.amountViewContainer}>
                <View style={[styles.digitBgViewFoodHUb, { backgroundColor: color }]}>
                    <T2SText screenName={screenName} id={VIEW_ID.TOTAL_SAVING_TEXT} style={styles.foodhubTextStyle}>
                        {currencySymbol} {getRoundedAmount(totalSavingsAmount)}
                    </T2SText>
                </View>
            </View>
        </View>
    );
};

TotalSavings.propType = {
    totalSavingsAmount: PropTypes.string.isRequired,
    currencySymbol: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired
};

export default TotalSavings;
