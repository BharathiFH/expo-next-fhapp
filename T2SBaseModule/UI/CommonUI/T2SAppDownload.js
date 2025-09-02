import React, { useMemo } from 'react';
import { getStoreURL, handleDownloadAppClick } from '../../../AppModules/OrderManagementModule/Utils/OrderManagementHelper';
import { Linking, View } from 'react-native';
import T2STouchableOpacity from './T2STouchableOpacity';
import { VIEW_ID } from '../../../AppModules/OrderManagementModule/Utils/OrderManagementConstants';
import T2SText from './T2SText';
import { LOCALIZATION_STRINGS } from '../../../AppModules/LocalizationModule/Utils/Strings';
import { connect, useSelector } from 'react-redux';
import { appDownloadStyle } from './Style/T2SAppDownloadStyle';
import useResponsiveStyle from './Style/UseResponsiveStyle';
import { isCustomerApp, isValidString } from '../../Utils/helpers';
import { OS_PLATFORM } from '../../Utils/Constants';
import { isFoodhubDomain } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import T2SImage, { LOADING_TYPE } from './T2SImage';
const T2SAppDownload = (props) => {
    const { androidStoreUrl, iosStoreUrl } = useSelector((state) => state?.appState?.initialConfigWeb?.appUrl ?? {});
    const appDownloadStyles = useResponsiveStyle(appDownloadStyle);
    const { storeResponse, isFromFooter, storeConfigResponse, appUrl } = props;
    const isValidAndroidLink = isCustomerApp() ? isValidString(storeResponse?.android_link) : isValidString(androidStoreUrl);
    const isValidiosLink = isCustomerApp() ? isValidString(storeResponse?.ios_link) : isValidString(iosStoreUrl);
    const isAppUrlAvailable = isValidAndroidLink || isValidiosLink;
    const handleAppLink = (platform) => {
        if (isFoodhubDomain()) {
            Linking.openURL(AppConfig.TRACKIER_APP_DOWNLOAD_LINK);
        } else {
            handleDownloadAppClick(platform, getStoreURL(storeConfigResponse, appUrl));
        }
    };

    const downloadLink = useMemo(() => {
        if (isCustomerApp()) {
            return {
                androidStoreUrl: storeResponse?.android_link,
                iosStoreUrl: storeResponse?.ios_link
            };
        } else if (isFoodhubDomain()) {
            return {
                androidStoreUrl: AppConfig.TRACKIER_APP_DOWNLOAD_LINK,
                iosStoreUrl: AppConfig.TRACKIER_APP_DOWNLOAD_LINK
            };
        } else {
            return appUrl;
        }
    }, [storeResponse, appUrl]);

    const renderDownloadButtons = () => {
        return (
            <View style={appDownloadStyles.storeDownloadView}>
                {isValidiosLink ? (
                    <View style={appDownloadStyles.downloadButtonContainer} nativeID={VIEW_ID.DOWNLOAD_ON_APPSTORE_BUTTON}>
                        <T2STouchableOpacity
                            id={VIEW_ID.DOWNLOAD_ON_APPSTORE_BUTTON}
                            style={appDownloadStyles.downloadButtonView}
                            onPress={(e) => {
                                e.preventDefault();
                                handleAppLink(OS_PLATFORM.iOS);
                            }}
                            href={downloadLink?.iosStoreUrl || ''}>
                            <T2SImage
                                source={{ uri: 'https://nativesites.touch2success.com/compressed_images/Appstore.svg' }}
                                style={appDownloadStyles.downloadAppImage}
                                loading={LOADING_TYPE.LAZY}
                            />
                        </T2STouchableOpacity>
                    </View>
                ) : null}
                {isValidAndroidLink ? (
                    <View style={appDownloadStyles.downloadButtonContainer} nativeID={VIEW_ID.DOWNLOAD_ON_PLAYSTORE_BUTTON}>
                        <T2STouchableOpacity
                            id={VIEW_ID.DOWNLOAD_ON_PLAYSTORE_BUTTON}
                            style={appDownloadStyles.downloadButtonView}
                            onPress={(e) => {
                                e.preventDefault();
                                handleAppLink(OS_PLATFORM.ANDROID);
                            }}
                            href={downloadLink?.androidStoreUrl || ''}>
                            <T2SImage
                                source={{ uri: 'https://nativesites.touch2success.com/compressed_images/Playstore.svg' }}
                                style={appDownloadStyles.downloadAppImage}
                                loading={LOADING_TYPE.LAZY}
                            />
                        </T2STouchableOpacity>
                    </View>
                ) : null}
            </View>
        );
    };
    if (isAppUrlAvailable) {
        return (
            <View style={isFromFooter ? appDownloadStyles.downloadAppBannerView : appDownloadStyles.downloadContainerInnerView}>
                <T2SText
                    id={VIEW_ID.DOWNLOAD_APP_TEXT}
                    style={isFromFooter ? appDownloadStyles.downloadAppTextFooter : appDownloadStyles.downloadAppText}>
                    {LOCALIZATION_STRINGS.DOWNLOAD}
                </T2SText>
                <T2SText id={VIEW_ID.DOWNLOAD_APP_TEXT} style={appDownloadStyles.downloadBoldText}>
                    {LOCALIZATION_STRINGS.GET_EXCLUSIVE_DISCOUNTS}
                </T2SText>
                {renderDownloadButtons()}
            </View>
        );
    } else {
        null;
    }
};
const mapStateToProps = (state) => ({
    storeResponse: state.appState.storeConfigResponse,
    appUrl: state.appState?.initialConfigWeb?.appUrl,
    storeConfigResponse: state.appState?.storeConfigResponse
});
export default connect(mapStateToProps, null)(T2SAppDownload);
