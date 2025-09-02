import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Style/AppBarStyle';
import CustomIcon from '../CustomUI/CustomIcon';
import {
    MyResponsiveContext,
    defaultTouchArea,
    isValidElement,
    headerLocationParams,
    isCustomerApp,
    isValidString,
    isNonCustomerApp
} from '../../Utils/helpers';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from 'appmodules/BaseModule/BaseConstants';
import T2STouchableOpacity from './T2STouchableOpacity';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { T2SText, T2SView } from '../index';
import { handleNavigation, handleReplace, handleSafeGoBack } from '../../../CustomerApp/Navigation/Helper';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../Themes';
// import T2SImage from './T2SImage';
import { isLandscapeScreen, isUKApp, isWeb, replaceWindowRoute } from '../../../AppModules/BaseModule/GlobalAppHelper';
import { useDispatch, useSelector } from 'react-redux';
import Image from '../../MUI/Image';
import T2SLinkButton from './T2SLinkButton';
import { selectGroupParticipant } from '../../../AppModules/BasketModule/Redux/BasketSelectors';
import { selectSelectedEventOrderFlow } from '../../../AppModules/EventOrder/Redux/EventOrderSelector';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { getTakeawayListAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { redirectRouteAction } from '../../../CustomerApp/Redux/Actions';
import { LOCALIZATION_STRINGS } from '../../../AppModules/LocalizationModule/Utils/Strings';
import { selectHasUserLoggedIn } from '../../Utils/AppSelectors';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';

const isWebView = isWeb();
const customerApp = isCustomerApp();

const T2SAppBar = ({
    title,
    icon,
    actions = undefined,
    customView = undefined,
    screenName = '',
    id = '',
    handleLeftActionPress,
    headerStyle,
    showElevation = true,
    customViewStyle,
    customActionContainerStyle,
    showLeftIcon,
    alongBackButton = true,
    additionalFieldsView,
    logoURL,
    showLogo = false,
    showLogin = true,
    hideTitle = false
}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const mode = useContext(MyResponsiveContext);
    const isLandScapeMode = isLandscapeScreen(mode);
    const initialConfigWeb = useSelector((state) => state.appState.initialConfigWeb);
    const groupParticipant = useSelector(selectGroupParticipant);
    const selectEventOrderFlow = useSelector(selectSelectedEventOrderFlow);
    const selectedPostcode = useSelector((state) => state.takeawayListReducer?.selectedPostcode);
    const userSearchedAddress = useSelector((state) => state.takeawayListReducer?.searchedAddressData);
    const searchedAddressData = useMemo(() => {
        let addressData = headerLocationParams(userSearchedAddress, isNonUkCountry, selectedPostcode);
        return addressData;
    }, [userSearchedAddress, selectedPostcode, isNonUkCountry]);
    const isCustomerWeb = customerApp && isWebView;
    const countryInfo = useSelector((state) => state.appState.s3ConfigResponse?.country);
    const isNonUkCountry = useMemo(() => !isUKApp(countryInfo?.id), [countryInfo]);
    const takeawayList = useSelector((state) => state.takeawayListReducer?.takeawayList);
    const isUserLoggedIn = useSelector(selectHasUserLoggedIn);

    function navigationBack() {
        handleSafeGoBack(navigation);
    }
    const renderTitle = () => {
        return (
            <T2SText
                id={id}
                screenName={screenName}
                numberOfLines={1}
                style={alongBackButton ? styles.backHeaderTextStyle : styles.headerTextStyle}>
                {title}
            </T2SText>
        );
    };

    // Commented in 10.36
    // const renderLogo = () => {
    //     return isValidString(logoURL) && isFoodHubApp() ? (
    //         <View style={styles.logoWrapper}>
    //             <T2SImage style={styles.logoImage} resizeMode={'contain'} source={logoURL} />
    //         </View>
    //     ) : null;
    // };

    const onGoHomeClick = useCallback(
        (loginAction = false) => {
            if (!groupParticipant) {
                if (!loginAction) {
                    if (selectEventOrderFlow) {
                        navigation.navigate(SCREEN_OPTIONS.EVENT_ORDER.route_name);
                    } else if (isValidElement(searchedAddressData) && !customerApp) {
                        if (isValidString(searchedAddressData?.postcode) && !isValidString(searchedAddressData?.postCode)) {
                            searchedAddressData.postCode = searchedAddressData?.postcode;
                        }
                        if (
                            !isValidElement(selectedPostcode) ||
                            (isValidElement(selectedPostcode) && selectedPostcode !== searchedAddressData?.postCode) ||
                            (!isValidElement(takeawayList) && isValidElement(searchedAddressData))
                        ) {
                            dispatch(getTakeawayListAction(searchedAddressData));
                        }

                        dispatch(redirectRouteAction(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name));
                        screenName === SCREEN_OPTIONS.OFFERS.route_name
                            ? handleReplace(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name, {
                                  screen: SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name,
                                  ...searchedAddressData
                              })
                            : navigation.navigate(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name, {
                                  ...searchedAddressData
                              });
                    } else {
                        if (isNonCustomerApp() || isCustomerWeb) {
                            replaceWindowRoute();
                            navigation.navigate(SCREEN_OPTIONS.HOME_SCREEN.route_name);
                        } else {
                            navigation.navigate(SCREEN_OPTIONS.MENU_SCREEN.route_name);
                        }
                    }
                } else {
                    const currentRoute = NavigationService?.navigationRef?.current?.getCurrentRoute();
                    if (!isUserLoggedIn) {
                        dispatch(redirectRouteAction(currentRoute?.name));
                        handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
                    } else {
                        handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name, { screen: SCREEN_OPTIONS.ACCOUNT.route_name });
                    }
                }
            }
        },
        [
            groupParticipant,
            selectEventOrderFlow,
            searchedAddressData,
            navigation,
            selectedPostcode,
            takeawayList,
            dispatch,
            isCustomerWeb,
            isUserLoggedIn,
            screenName
        ]
    );

    const options = {
        login: {
            title: LOCALIZATION_STRINGS.LOGIN,
            icon: FONT_ICON.USER,
            selectedIcon: FONT_ICON.USER,
            routeName: SCREEN_OPTIONS.SOCIAL_LOGIN.route_name
        },
        account: {
            title: LOCALIZATION_STRINGS.MY_ACCOUNT,
            icon: FONT_ICON.USER,
            selectedIcon: FONT_ICON.USER,
            routeName: SCREEN_OPTIONS.ACCOUNT.route_name
        }
    };

    const linkOptions = isUserLoggedIn ? options.login : options.account;
    const showLogoMobile = isWebView && showLogo;

    return (
        <View style={[{ overflow: 'hidden', paddingBottom: isLandScapeMode ? 0 : 5 }, showLogoMobile && styles.mainLogoView]}>
            <View
                style={
                    showElevation
                        ? [styles.headerStyle, styles.elevation, headerStyle, showLogoMobile && styles.mainLogoSubView]
                        : [styles.noElevation, headerStyle, showLogoMobile && styles.mainLogoSubView]
                }>
                <View style={styles.mainView}>
                    {showLeftIcon ? (
                        <T2STouchableOpacity
                            style={styles.headerIconStyle}
                            screenName={screenName}
                            id={VIEW_ID.LEFT_BUTTON}
                            onPress={isValidElement(handleLeftActionPress) ? handleLeftActionPress : navigationBack}
                            hitSlop={defaultTouchArea(24)}>
                            <CustomIcon name={icon} size={24} color={Colors.textMain} />
                            {alongBackButton ? renderTitle() : null}
                        </T2STouchableOpacity>
                    ) : null}

                    {showLogoMobile ? (
                        <>
                            <T2SLinkButton
                                action={() => onGoHomeClick(false)}
                                to={
                                    selectEventOrderFlow
                                        ? { screen: SCREEN_OPTIONS.EVENT_ORDER.route_name }
                                        : isValidElement(searchedAddressData?.postcode) || isValidString(searchedAddressData?.town)
                                        ? {
                                              screen: SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name,
                                              params: {
                                                  postcode: searchedAddressData.postcode ?? '',
                                                  town: searchedAddressData.town ?? '-'
                                              }
                                          }
                                        : isValidString(searchedAddressData?.lat) && isValidString(searchedAddressData?.lng)
                                        ? {
                                              screen: SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name,
                                              params: { lat: searchedAddressData.lat, lng: searchedAddressData.lng }
                                          }
                                        : '/'
                                }>
                                <Image
                                    style={styles.headerLogo}
                                    source={initialConfigWeb?.images?.websiteLogoUrl}
                                    resizeMode="contain"
                                    nativeID="header_logo_img"
                                />
                            </T2SLinkButton>
                        </>
                    ) : null}

                    {isValidElement(customView) ? (
                        <View style={isValidElement(customViewStyle) ? customViewStyle : styles.customViewStyle}>{customView}</View>
                    ) : !alongBackButton && !hideTitle ? (
                        renderTitle()
                    ) : null}
                    {isValidElement(actions) ? (
                        <T2SView style={isValidElement(customActionContainerStyle) ? customActionContainerStyle : styles.actionContainer}>
                            {actions}
                        </T2SView>
                    ) : null}
                </View>
            </View>
            {isValidElement(additionalFieldsView) ? <View style={styles.additionalInfoContainer}>{additionalFieldsView}</View> : null}
            {showLogoMobile && showLogin ? (
                <T2STouchableOpacity
                    id={VIEW_ID.LOGIN_BUTTON}
                    screenName={screenName}
                    onPress={() => onGoHomeClick(true)}
                    style={styles.loginStyle}
                    hitSlop={defaultTouchArea(40)}>
                    <CustomIcon name={linkOptions.selectedIcon} size={30} color={Colors.textMain} />
                </T2STouchableOpacity>
            ) : null}
        </View>
    );
};
T2SAppBar.propTypes = {
    screenName: PropTypes.string,
    id: PropTypes.string,
    actions: PropTypes.node, //AppBar RightAction Buttons
    title: PropTypes.string, // AppBar Title
    icon: PropTypes.string, // Font icon for LeftAction Button
    customView: PropTypes.node, //used to render custom view on Parent Component
    handleLeftActionPress: PropTypes.func, // callback function to override for LeftAction Button
    useDefault: PropTypes.bool, // Default Navigation which will take care of scene,previous,
    headerStyle: ViewPropTypes.style,
    showElevation: PropTypes.bool
};

function propCheck(prevProps, nextProps) {
    return (
        prevProps.screenName === nextProps.screenName &&
        prevProps.id === nextProps.id &&
        prevProps.title === nextProps.title &&
        prevProps.icon === nextProps.icon &&
        prevProps.customView === nextProps.customView &&
        prevProps.useDefault === nextProps.useDefault &&
        prevProps.showElevation === nextProps.showElevation &&
        prevProps.actions === nextProps.actions &&
        prevProps.showLogo === nextProps.showLogo
    );
}
T2SAppBar.defaultProps = {
    actions: undefined,
    customView: null,
    showElevation: true,
    icon: FONT_ICON.BACK,
    showLeftIcon: true,
    hideTitle: false
};
export default React.memo(T2SAppBar, propCheck);
