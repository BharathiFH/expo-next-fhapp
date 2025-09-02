import { T2SConfig } from './T2SConfig';
import {
    boolValue,
    getFranchiseIdBasedOnURL,
    isArrayNonEmpty,
    isBoolean,
    isCustomerApp,
    isFoodHubApp,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement,
    isValidNotEmptyString,
    isValidString,
    seoFriendlyUrl
} from './helpers';
import { AppConfig, getGiftCardPurchaseUrl } from '../../CustomerApp/Utils/AppConfig';
import { addTimeDeviceMoment, getDeviceTimeZone } from './DateUtil';
import { SESSION_EXPIRE_BEFORE_CHECK } from '../Network/SessionManager/Utils/SessionManagerConstants';
import { createSelector } from 'reselect';
import { BOOL_CONSTANT, MENU_V3_5_VERSION } from 'appmodules/AddressModule/Utils/AddressConstants';
import { getCurrencyFromStore, getPrerenderData } from 'appmodules/BaseModule/GlobalAppHelper';
import { getISOFromStore } from 'appmodules/BaseModule/GlobalAppHelper';
import {
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { getStoreStatusCollection, getStoreStatusDelivery } from '../../FoodHubApp/TakeawayListModule/Utils/Helper';
import Config from 'react-native-config';
import { getCurrencyFromBasketResponse } from 'appmodules/BaseModule/GlobalAppHelper';
import { TAKEAWAY_OPEN_STATUS } from 'appmodules/HomeModule/Utils/HomeConstants';
import { safeFloatRoundedValue } from './helpers';
import { selectBasketViewResponse } from '../../AppModules/BasketModule/Redux/BasketSelectors';
import { getWebHost, isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
import { Constants, STORE_TYPE } from './Constants';
import { UI_STATE_TYPES } from '../../AppModules/UIModule/Utils/UIStateConstants';
import { MENU_V3_VERSION } from '../../AppModules/AddressModule/Utils/AddressConstants';
import { ORDER_TYPE_STATUS, TOGGLE_STATUS } from '../../AppModules/BaseModule/BaseConstants';
import { CHECKBOX_STATUS } from '../../AppModules/HomeModule/Utils/HomeConstants';
import {
    COUNTRY_ID,
    MAGIC_LINK_EXPIRY_DURATION,
    MAGIC_LINK_EXPIRY_TIME,
    MAGIC_LINK_POLLING_GAP,
    MAGIC_LINK_RESEND_COUNT,
    MAGIC_LINK_RESEND_GAP
} from '../../AppModules/BaseModule/GlobalAppConstants';
import { FRANCHISE_NAME } from '../../AppModules/ConfiguratorModule/Utils/ConfiguratorAutomationConstants';
import { CONSTANTS } from '../../AppModules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { getConfiguration, selectRefreshToken } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { getFranchiseHost } from 'AppModules/ConfiguratorModule/Utils/ConfiguratorHelper';
import { IsDineInEnabled } from 'appmodules/DineInModule/Redux/DineInSelectors';
import { selectOrderType } from 'appmodules/OrderManagementModule/Redux/OrderManagementSelectors';
import { isDineInOrderType } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';

export const selectCountryBaseFeatureGateSelector = (state) => state.appState.countryBaseFeatureGateResponse;
export const selectUserResponse = (state) => state.profileState?.profileResponse;
export const selectUserResponseWithoutConsent = (state) => state.authState.profileResponseWithoutConsent;
export const selectAccessToken = (state) => state.userSessionState.access_token;
export const selectAccountVerified = (state) => state.authState.accountVerified;
export const selectS3Response = (state) => state.appState.s3ConfigResponse;
export const selectWalletToCardFlag = (state) =>
    (state.appState.s3ConfigResponse?.enable_datman_wallet_to_card?.status === Constants.ENABLED && isFoodHubApp()) ?? false;
export const selectCountryId = (state) => state.appState.s3ConfigResponse?.country?.id || null;
export const selectIsSnappyEnabled = (state) =>
    (state.appState.s3ConfigResponse?.snappy_integration_check?.status === Constants.ENABLED && isFoodHubApp()) ?? false;
export const selectRedirectScreen = (state) => state.appState.redirectRoute;
export const selectRedirectParams = (state) => state.appState.redirectParams;
export const selectSwitchCountryLocale = (state) => state.appState.manualSwitchedCountry;
export const selectLanguage = (state) => state.appState.language;
export const selectStoreConfigResponse = (state) => state.appState?.storeConfigResponse;
export const selectReOrderStoreConfigResponse = (state) => state.orderManagementState.reOrderStoreConfiguration;
export const selectPolicyLookupResponse = (state) => state.appState.policyLookupResponse;
export const getNetworkStatus = (state) => state.offlineNoticeManagerState.connectionStatus;
export const selectOtpPhoneNumber = (state) => state.authState.otpPhoneNumber;
export const selectAddressResponse = (state) => state.addressState.addressResponse;
export const selectedOrderType = (state) => state.addressState.selectedOrderType;
export const selectWalletBalance = (state) => state.walletState.walletBalance;
export const selectWalletTransactionList = (state) => state.walletState.walletTransactionList;
export const selectPushNotificationToken = (state) => state.pushNotificationState.deviceToken;
export const selectTakeawayListReducer = (state) => state.takeawayListReducer;
export const selectBasketStoreConfig = (state) => state.appState?.prevStoreConfigResponse;
export const selectBasketStoreID = (state) => state.basketState?.storeID;
export const selectCountryList = (state) => state.landingState.countryList;
export const selectEnvConfig = (state) => state.envConfigState.envConfigData;
export const selectInitialConfigWeb = (state) => state.appState.initialConfigWeb;
export const selectSearchedPostcode = (state) => state.appState.selectedPostcode;
export const selectBrazeNotificationList = (state) => state.pushNotificationState.brazeNotificationList;
export const selectLatestMoeNotificationId = (state) => state.notificationState.moeNotificationId;
export const selectBasketCreatedAt = (state) => state.basketState.basketCreatedAt;
export const selectGoogleSessionToken = (state) => state.appState.googleSessionToken;
export const selectDeviceUniqueId = (state) => state.appState.deviceUniqueID;
export const selectCollectionTime = (state) => state.appState?.storeConfigResponse?.collection_time;
export const selectDeliveryTime = (state) => state.appState?.storeConfigResponse?.delivery_time;
export const selectBestMatchResponse = (state) => state.appState?.bestMatchResponse;
export const selectSelectedTAOrderType = (state) => state.addressState.selectedTAOrderType;
export const selectAppConfig = (state) => state.appState?.initialConfigWeb?.franchise?.name;
export const selectTrustPilotUrl = (state) => state.appState?.initialConfigWeb?.trustPilotUrl;
export const selectAppOrderExperienceRedirectURL = (state) => state?.appConfiguratorState?.order_experience_redirect_url_app ?? null;
export const selectWebOrderExperienceRedirectURL = (state) => state?.appConfiguratorState?.order_experience_redirect_url_web ?? null;
export const selectRestrictedStoreIds = (state) => state?.appConfiguratorState?.show_approval_list_for_stores ?? [];
export const selectClientType = (state) => state.appState?.initialConfigWeb?.franchise?.clientType;
export const selectBusinessType = (state) => state.appState?.initialConfigWeb?.franchise?.businessType;
export const selectPrevRouteURLName = (state) => state.appState?.redirectRouteFromScoialLogin;
export const selectCustomerWebCSS = (state) => state.appState?.cssTemplate;
export const selectOldCSS = (state) => state.appState?.oldCss;
export const selectCustomerStoreHost = (state) => state.appState?.storeConfigResponse?.host;
export const selectInitialConfigWebHost = (state) => state.appState.initialConfigWeb?.franchise?.domain;
export const selectCountryIso = (state) => state.appState.s3ConfigResponse?.country?.iso;
export const selectHygieneRating = (state) => state.takeawayDetailsState?.rating;
export const selectCountryDateFormat = (state) => state.appState.s3ConfigResponse?.date_format;
export const selectThemeEnabled = (state) => state.appState?.themeEnabled;
export const selectIsOrderWaitingTimeUpdated = (state) => state.basketState?.isOrderWaitingTimeUpdated;
export const selectIsNewChatBot = ({ appConfiguratorState }) => appConfiguratorState?.show_new_chatbot ?? false;
export const selectSkipLocationWithSearch = (state) => state?.appConfiguratorState?.skip_location_with_search && isWeb();
export const selectSkipLocationWithTemplate = (state) => state?.appConfiguratorState?.skip_location_with_template && isWeb();
export const selectHomePageMapZoom = (state) => state?.appConfiguratorState?.home_page_map_zoom;
export const selectHelpOption = (state) => state.appConfiguratorState?.show_help_option ?? true;

export const selectAllergyRedirectLink = (state) => state?.appState?.storeConfigResponse?.allergens_content ?? null;

//To Do We are making this as true for default. We will update this after POC on featuregateway response for WEB
export const featureGateCSSEnabled = (state) => state.appState?.countryBaseFeatureGateResponse?.css_toggle?.enable || true;
export const featureGateMicrosoftEnabled = (state) => state.appState?.countryBaseFeatureGateResponse?.microsoft_login?.enable || false;
export const selectCartItemValidatorToggle = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.cart_item_validator?.enable || false;
export const selectCartItemValidatorFrequency = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.cart_item_validator?.frequency || 30000;
export const advanceHomeScreen = (state) => state?.appConfiguratorState?.show_advance_home_screen;
export const preOrderSelectDateOnly = (state) =>
    state.appState?.storeConfigResponse?.set_preorder_to_select_date_only === CONSTANTS.ENABLED;
export const selectAppHost = (state) => state.appState.s3ConfigResponse?.franchise?.id;
export const selectTAListMilesRestrictionConfig = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.TA_list_miles_restriction ?? null;

export const selectGroupOrderConfig = (_state_) => {
    const isStoreAccessible = selectIsStoreAccessible(_state_);
    return (
        boolValue(_state_.appState?.countryBaseFeatureGateResponse?.group_ordering?.enable) &&
        _state_?.appConfiguratorState?.show_group_order &&
        boolValue(isStoreAccessible)
    );
};

export const selectReviewManagement = (state) => state.appState?.countryBaseFeatureGateResponse?.review_management?.enable || false;
export const selectReviewEditDay = (state) => state.appState?.countryBaseFeatureGateResponse?.review_management?.noOfDays || 14;
export const selectIsAppleSiginEnableWeb = (state) => {
    const appleSignIn = state.appState?.countryBaseFeatureGateResponse?.apple_siginin_web?.enable;
    return appleSignIn === false ? false : true;
};
export const selectHideSnappyOptions = (state) => state.appState?.countryBaseFeatureGateResponse?.hide_snappy_options?.enable || false;
export const selectFranchiseId = (state) => state.appState.s3ConfigResponse?.config?.franchise?.id;
export const selectAdvanceLoyaltySchemeStatus = (state) => state.appState.storeConfigResponse?.ADVANCED_LOYALTY_SCHEME;
export const selectAdvanceLoyaltySchemeForceMigrationStatus = (state) =>
    state.appState.storeConfigResponse?.ADVANCED_LOYALTY_SCHEME_FORCE_MIGRATION;

const isWebDevice = isWeb();
const isCustomer = isCustomerApp();
const isFoodhub = isFoodHubApp();
const isFranchise = isFranchiseApp();
export const selectCurrencyFromBasket = (state) => {
    const basketCurrency = state.basketState?.viewBasketResponse?.currency_symbol ?? '';
    return isValidString(basketCurrency) ? basketCurrency : selectCurrencyFromStore(state);
};

export const selectRegion = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.region)) {
        return s3Response.region.id;
    } else if (!isWebDevice) {
        return Config.DEFAULT_REGION;
    }
};

export const selectCountry = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.country)) {
        return s3Response.country.id;
    } else if (!isWebDevice) {
        return Config.DEFAULT_REGION;
    }
};

export const selectCountryForTabNavigation = (state) => {
    const { result } = getPrerenderData({ skipHostValidation: true }) || {};
    if (isWebDevice && isValidElement(result?.country?.code)) {
        return result?.country?.code;
    }
    return selectCountry(state);
};

export const selectLocale = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.country) && isValidString(s3Response.country.name)) {
        return s3Response.country.name.toLocaleLowerCase();
    } else if (!isWebDevice) {
        return Config.DEFAULT_LOCALE;
    }
};

export const selectSwitchLocale = (state) => {
    const locale = selectSwitchCountryLocale(state);
    if (isValidElement(locale)) {
        return locale;
    } else if (!isWebDevice) {
        return Config.DEFAULT_LOCALE;
    }
};

export const selectAPIVersion = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.api_version;
    } else {
        return AppConfig.API_VERSION;
    }
};

export const selectLanguageKey = (state) => {
    const language = selectLanguage(state);
    if (isValidElement(language) && isValidString(language.code)) {
        return language.code;
    } else {
        return 'en-gb';
    }
};

export const selectCurrencySymbol = (state) => {
    if (isNonCustomerApp()) {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response) && isValidElement(s3Response.currency) && isValidString(s3Response.currency.symbol)) {
            return s3Response.currency.symbol;
        } else {
            return T2SConfig.default.currency;
        }
    } else {
        const storeConfigResponse = selectStoreConfigResponse(state);
        return getCurrencyFromBasketResponse(getCurrencyFromStore(storeConfigResponse));
    }
};

export const selectCurrencyISO = (state) => {
    if (isNonCustomerApp()) {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response) && isValidElement(s3Response.currency) && isValidString(s3Response.currency.iso)) {
            return s3Response.currency.iso;
        } else {
            return T2SConfig.default.iso;
        }
    } else {
        const storeConfigResponse = selectStoreConfigResponse(state);
        return getISOFromStore(storeConfigResponse);
    }
};

export const selectCurrencyISOForLog = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidString(s3Response?.currency?.iso)) {
        return s3Response.currency.iso;
    } else {
        return T2SConfig.default.iso;
    }
};

export const selectCurrencyFromStore = (state) => {
    const storeResponse = selectStoreConfigResponse(state);
    const s3Response = selectS3Response(state);
    if (isValidString(s3Response?.currency?.symbol)) {
        return s3Response.currency.symbol;
    } else if (isValidElement(storeResponse?.currency)) {
        return getCurrencyFromStore(storeResponse);
    } else {
        return '';
    }
};

export const selectPhoneRegex = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.phone) && isValidString(s3Response.phone.reg_ex)) {
        return s3Response.phone.reg_ex;
    } else {
        return T2SConfig.default.phoneRegex.UK;
    }
};

export const selectPhoneLength = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.phone.max_length;
    } else {
        return T2SConfig.default.phoneLength.UK;
    }
};

export const selectPostcodeRegex = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        if (isValidElement(s3Response.post_code)) {
            return s3Response.post_code.reg_ex;
        } else if (isValidElement(s3Response.postcode)) {
            return s3Response.postcode.reg_ex;
        }
    }
    return T2SConfig.default.postcodeRegex.UK;
};

export const selectPostcodeLength = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.postcode.max_length;
    } else {
        return T2SConfig.default.postcodeLength.UK;
    }
};

// We are usin this for the restriction for the password field min and max length
export const getPasswordMaxLength = (state) => {
    const s3Response = isValidElement(state) ? selectS3Response(state) : null;
    if (isValidString(s3Response?.password?.max_length)) {
        return s3Response.password.max_length;
    } else {
        return isValidString(T2SConfig?.password?.max_length) ? T2SConfig.password.max_length : null;
    }
};
export const getPasswordMinLength = (state) => {
    const s3Response = isValidElement(state) ? selectS3Response(state) : null;
    if (isValidString(s3Response?.password?.min_length)) {
        return s3Response.password.min_length;
    } else {
        return isValidString(T2SConfig?.password?.min_length) ? T2SConfig.password.min_length : null;
    }
};

/**
 * Only you need to use if app is Customer app. & Pre Order widget.
 * @param state
 * @param storeConfigResponse
 * @returns {string|*}
 */
export const selectTimeZone = (state, storeConfigResponse) => {
    if (isValidElement(storeConfigResponse)) {
        let timezone = getTimeZoneFromConfig(storeConfigResponse);
        if (isValidElement(timezone)) {
            return timezone;
        }
    }
    const storeResponse = selectStoreConfigResponse(state);
    let timezone = getTimeZoneFromConfig(storeResponse);
    if (isValidElement(timezone)) {
        return timezone;
    } else {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response?.region?.time_zone)) {
            return s3Response.region.time_zone;
        } else {
            return getDeviceTimeZone();
        }
    }
};

const getTimeZoneFromConfig = (storeResponse) => {
    if (isValidElement(storeResponse) && isValidElement(storeResponse.time_zone)) {
        return storeResponse.time_zone;
    } else if (isArrayNonEmpty(storeResponse?.region) && isValidElement(storeResponse.region[0]?.time_zone)) {
        return storeResponse.region[0].time_zone;
    } else {
        return null;
    }
};

export const selectUserToken = (state) => {
    const userResponse = selectUserResponse(state);
    const userResponseWithoutConsent = selectUserResponseWithoutConsent(state);
    if (isValidElement(userResponseWithoutConsent)) {
        return userResponseWithoutConsent.api_token;
    } else if (isValidElement(userResponse)) {
        return userResponse.api_token;
    } else {
        return '';
    }
};

export const getUserLoggedIn = (state) => {
    const userResponse = selectUserResponse(state);
    const refreshToken = selectRefreshToken(state);
    return isValidElement(userResponse) && isValidString(refreshToken);
};

export const selectHasUserLoggedIn = createSelector(getUserLoggedIn, (userLoggedIn) => userLoggedIn);

export const selectHost = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isWebDevice) {
        return getWebHost();
    } else if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.host;
    } else {
        return '';
    }
};
export const selectPushNotificationHost = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isWebDevice) {
        return getWebHost();
    } else if (isFranchiseApp()) {
        const configData = getConfiguration(state);
        const host = getFranchiseHost(configData);
        return host ? host : AppConfig.FRANCHISE_HOST;
    } else if (isValidElement(storeConfigResponse) && isCustomerApp()) {
        return storeConfigResponse.host;
    }
};

export const selectPhone = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.phone;
    } else {
        return '';
    }
};

export const selectStoreId = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse?.id)) {
        return storeConfigResponse.id;
    } else {
        return AppConfig.STORE_ID;
    }
};

export const selectStoreV3Status = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state) || {};
    const { menu_version } = storeConfigResponse || {};
    if (isValidElement(menu_version?.status)) {
        return MENU_V3_VERSION?.includes(menu_version?.value?.version?.toString()) ||
            MENU_V3_VERSION?.includes(menu_version?.data?.version?.toString())
            ? menu_version?.status
            : '';
    }
};
export const selectStoreV3_5Status = (state, basketStoreConfig) => {
    const storeConfigResponse = basketStoreConfig || selectStoreConfigResponse(state) || {};
    const is3_5FeatureEnabled = state.appConfiguratorState?.isV3_5FeatureEnabled;
    const { menu_version } = storeConfigResponse || {};
    if (is3_5FeatureEnabled && menu_version?.status) {
        return (
            menu_version?.new_value?.version?.toString() === MENU_V3_5_VERSION ||
            menu_version?.data?.new_version?.toString() === MENU_V3_5_VERSION
        );
    }
    return false;
};

export const selectStoreMenuVersion = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state) || {};
    const { menu_version = {} } = storeConfigResponse || {};
    if (isValidElement(menu_version?.status)) {
        if (
            menu_version?.new_value?.version?.toString() === MENU_V3_5_VERSION ||
            menu_version?.data?.new_version?.toString() === MENU_V3_5_VERSION
        ) {
            return '3';
        }
        return menu_version?.value?.version?.toString() ?? menu_version?.data?.version?.toString();
    }
};

export const isAccessTokenExpired = (state) => {
    return (
        isValidElement(state.userSessionState.access_token) &&
        state.userSessionState.access_token.length > 0 &&
        state.userSessionState.access_token_expires_in < addTimeDeviceMoment(SESSION_EXPIRE_BEFORE_CHECK)
    );
};

export const selectMobileAuthRedirection = (state) => {
    let redirection = selectRedirectScreen(state);
    let redirectionParams = selectRedirectParams(state);
    return { redirectScreen: redirection, redirectParams: redirectionParams };
};
export const selectPrevRouteURLData = (state) => {
    let prevRouteURLData = selectPrevRouteURLName(state);
    return { prevRouteURLName: prevRouteURLData?.name, prevRouteURLparams: prevRouteURLData?.params };
};

export const isTakeAwayOpenSelector = (state) => {
    return isDeliveryAvailableSelector(state) || isCollectionAvailableSelector(state);
};

export const isPreOrderAvailableForCollectionSelector = (state) => {
    const preOrderHours = selectPreorderCollectionStatus(state);
    return preOrderHours.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};

export const isPreOrderAvailableForDeliverySelector = (state) => {
    const preOrderHours = selectPreorderDeliveryStatus(state);
    return preOrderHours.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};

export const isPreOrderAvailableSelector = (state) => {
    return isPreOrderAvailableForCollectionSelector(state) || isPreOrderAvailableForDeliverySelector(state);
};

export const isCollectionAvailableSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    return isCollectionAvailableForStore(storeConfigResponse?.show_collection, getStoreStatusCollection(storeConfigResponse));
};
export const isCollectionAvailableForStore = (storeConfigShowCollection, storeStatusCollection) => {
    if (isValidElement(storeStatusCollection) && isValidElement(storeConfigShowCollection)) {
        return (
            storeStatusCollection.toLowerCase() === TAKEAWAY_OPEN_STATUS.OPEN &&
            storeConfigShowCollection.toString() === TAKEAWAY_OPEN_STATUS.AVAILABLE
        );
    }
    return false;
};

export const isDeliveryAvailableSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    return isDeliveryAvailableForStore(storeConfigResponse?.show_delivery, getStoreStatusDelivery(storeConfigResponse));
};
export const isDeliveryAvailableForStore = (storeConfigShowDelivery, storeStatusDelivery) => {
    if (isValidElement(storeStatusDelivery) && isValidElement(storeConfigShowDelivery)) {
        return (
            storeStatusDelivery.toLowerCase() === TAKEAWAY_OPEN_STATUS.OPEN &&
            storeConfigShowDelivery.toString() === TAKEAWAY_OPEN_STATUS.AVAILABLE
        );
    }
    return false;
};
export const selectPrimaryAddressSelector = (state) => {
    let addressResponse = selectAddressResponse(state);
    if (isArrayNonEmpty(addressResponse?.data)) {
        for (let i = 0; i < addressResponse.data.length; i++) {
            if (addressResponse.data[i].is_primary === 'YES') {
                return addressResponse.data[i];
            }
        }
    }
    return null;
};
export const selectTakeawayAddressSelector = (state) => {
    let storeResponse = selectStoreConfigResponse(state);
    let takeAwayAddress = '';
    if (isValidNotEmptyString(storeResponse?.number)) {
        takeAwayAddress = `${storeResponse.number} `;
    }
    if (isValidNotEmptyString(storeResponse?.street)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.street}, `;
    }
    if (isValidNotEmptyString(storeResponse?.city)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.city}, `;
    }
    if (isValidNotEmptyString(storeResponse?.town)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.town}, `;
    }
    if (isValidNotEmptyString(storeResponse?.postcode)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.postcode}, `;
    }
    return takeAwayAddress;
};

export const selectAskPostCode = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse?.ask_postcode_first)) {
        return storeConfigResponse.ask_postcode_first;
    }
};

export const selectTakeawayName = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse) && isValidString(storeConfigResponse.name)) {
        return storeConfigResponse.name;
    } else {
        return '';
    }
};
export const selectUserPhoneNumber = (state) => {
    const userResponse = selectUserResponse(state);
    if (isValidElement(userResponse) && isValidString(userResponse.phone)) {
        return userResponse.phone;
    } else {
        return '';
    }
};

const getInitAPIStatus = (state) => {
    return state.appState.initAPIStatus;
};
export const selectInitAPIStatus = createSelector(getInitAPIStatus, (status) => {
    return status;
});

export const getSpanishLanguage = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code === 'es';
    }
    return false;
};

export const getLanguageCode = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code;
    }
    return 'en';
};

export const selectIsSpanishLanguage = createSelector(getSpanishLanguage, (isSpanish) => isSpanish);

export const getEnglishLanguage = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code.includes('en');
    }
    return false;
};
export const selectIsEnglishLanguage = createSelector(getEnglishLanguage, (isEnglish) => isEnglish);
export const selectNetworkStatus = createSelector(getNetworkStatus, (networkStatus) => networkStatus);

export const getIsPreOrderASAP = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.pre_order_asap)) {
        return storeConfigResponse.pre_order_asap === 'ENABLED';
    } else {
        return false;
    }
};

export const isBasketTakeAwayOpenSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    const basketStoreConfigResponse = selectBasketStoreConfig(state);
    const basketStoreID = selectBasketStoreID(state);
    if (isValidElement(basketStoreID) && isValidElement(storeConfigResponse) && basketStoreID === storeConfigResponse.id) {
        return (
            isDeliveryAvailableForStore(storeConfigResponse?.show_delivery, getStoreStatusDelivery(storeConfigResponse)) ||
            isCollectionAvailableForStore(storeConfigResponse?.show_collection, getStoreStatusCollection(storeConfigResponse))
        );
    } else if (isValidElement(basketStoreConfigResponse)) {
        return (
            isDeliveryAvailableForStore(basketStoreConfigResponse?.show_delivery, getStoreStatusDelivery(basketStoreConfigResponse)) ||
            isCollectionAvailableForStore(basketStoreConfigResponse?.show_collection, getStoreStatusCollection(basketStoreConfigResponse))
        );
    }
};

export const selectCurrencyFromS3Config = (state) => {
    return state.appState.s3ConfigResponse?.currency?.symbol;
};

export const selectTotalWithoutDiscount = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse)) {
        const { total, card_service_fee, driver_tip } = basketResponse;
        let totalvalue = 0;
        totalvalue += parseFloat(total?.value ?? 0);
        totalvalue -= parseFloat(card_service_fee?.value ?? 0);
        totalvalue -= parseFloat(driver_tip?.value ?? 0);
        totalvalue = safeFloatRoundedValue(totalvalue) / 10000; // stick driver tip logic with api side
        return totalvalue;
    }
    return 0;
};

export const selectAppThem = (state) => {
    return state.appState?.initialConfigWeb?.colors;
};

export const selectOrderId = (state) => state.basketState.createBasketResponse?.resource_id;
export const selectGuestUserProfile = (state) => state.profileState?.guestUserProfile;
export const selectIsGuestUser = (state) => state.authState?.guestUser;
export const selectGuestUserToken = (state) => {
    let guestTokenFromApi = state.authState?.guestUserToken;
    let guestTokenFromRoute = state.authState?.guestUserTokenFromRoute;
    return guestTokenFromRoute ?? guestTokenFromApi ?? null;
};

export const selectDefaultPaymentMode = (state) => state?.profileState?.profileResponse?.default_payment_mode;

export const selectIsMenuLoading = (state) =>
    state.uiState.menuUIState === UI_STATE_TYPES.LOADING || state.uiState.takeawayDetailsUIState === UI_STATE_TYPES.LOADING;

export const selectIsMenuEmpty = (state) => state.uiState.menuUIState === UI_STATE_TYPES.EMPTY;

export const selectIsMenuFailed = (state) => state.uiState.menuUIState === UI_STATE_TYPES.FAILURE;

export const isDeliveryOrCollectionOnlyAvailable = (storeConfigDelivery, storeConfigCollection) => {
    let deliveryAvailabe = boolValue(storeConfigDelivery);
    let collectionAvailable = boolValue(storeConfigCollection);

    if (deliveryAvailabe && collectionAvailable) {
        return false;
    } else if (!deliveryAvailabe && !collectionAvailable) {
        return ORDER_TYPE_STATUS.CLOSED;
    } else if (deliveryAvailabe) {
        return CHECKBOX_STATUS.DELIVERY;
    } else if (collectionAvailable) {
        return CHECKBOX_STATUS.COLLECTION;
    }
};

export const cookiesConsentEnabled = (state) => state.appState?.countryBaseFeatureGateResponse?.site_cookies?.enable;

export const currentUrlRoute = (state) => state.appState?.currentUrlRoute;

export const isCookiesAcceptedFlag = (state) => state.appState?.isCookiesAccepted;

export const selectIsLoginWithEmailEnabled = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.enable || (state?.appConfiguratorState?.show_magic_link ?? false);

export const selectFranchiseLoyaltyPointsEnabled = (state) => state?.appConfiguratorState?.franchise_loyalty_points ?? false;
export const disableRecapthaForMagicLink = (state) => state.appConfiguratorState?.disable_recaptcha_magic_link !== true;

export const selectmagicLinkButtonTapTime = (state) => state.authState.magicLinkButtonTapTime;

export const selectTakeawayStatusCheckOnViewBasket = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.takeaway_status_check_on_view_basket?.enable ?? true;

export const selectEnteredEmail = (state) => state.appState?.enteredEmail;

export const selectGetCustomFieldsData = (state) => state.basketState?.custom_fields;

export const selectGetCustomFieldErrors = (state) => state.basketState?.customFieldErrors;

export const selectGetCustomFieldResponse = (state) => state.basketState?.customFieldsResponse;

export const selectGetShowCustomFieldErrors = (state) => state.basketState?.showCustomFieldErrors;

export const selectGetCalledFromOutsideAdditionInfo = (state) => state.basketState?.calledFromOutsideAdditionInfo;

export const selectGetTemplateFieldsData = (state) => state.basketState?.template_fields;

export const selectGetCustomFieldsErrors = (state) => state.basketState?.customFieldsError;

export const selectIsCustomFieldsUpdated = (state) => state.basketState?.isCustomFieldsUpdated;

export const selectIsCustomFieldsMandatory = (state) => state.basketState?.isFieldsMandatory;

export const selectCustomFieldsPayload = (state) => state.basketState?.customFieldsPayload;

export const selectCustomFieldsResponse = (state) => state.basketState?.customFieldsResponse;

export const SELECT_MAGIC_LINK_RESEND_GAP = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.magic_link_configs?.magic_link_resend_gap || MAGIC_LINK_RESEND_GAP;

export const SELECT_MAGIC_LINK_EXPIRY_TIME = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.magic_link_configs?.magic_link_expiry_time || MAGIC_LINK_EXPIRY_TIME;

export const SELECT_MAGIC_LINK_RESEND_COUNT = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.magic_link_configs?.magic_link_resend_count || MAGIC_LINK_RESEND_COUNT;

export const SELECT_MAGIC_LINK_EXPIRY_DURATION = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.magic_link_configs?.magic_link_expiry_duration ||
    MAGIC_LINK_EXPIRY_DURATION;

export const SELECT_MAGIC_LINK_POLLING_GAP = (state) =>
    state.appState?.countryBaseFeatureGateResponse?.magic_link?.magic_link_configs?.magic_link_polling_gap || MAGIC_LINK_POLLING_GAP;

export const isPasswordLoginEnabled = (state) =>
    selectGlobalRecaptchaEnable(state) && state?.appConfiguratorState?.disable_password_login !== true;

export const selectHomeSchedulePopup = (state) => state?.appConfiguratorState?.home_schedule_popup ?? false;

export const selectShowBasketPreorderText = (state) => state?.appConfiguratorState?.show_basket_preorder_text ?? false;
export const selectShowAddtionalInfoIntoComments = (state) => state?.appConfiguratorState?.show_additionalInfo_into_comments ?? false;

export const showWeatherAnimation = (state) => {
    try {
        const showWeather = state.appConfiguratorState?.show_weather_animation_in_order_tracking;
        const isUserLoggedIn = selectHasUserLoggedIn(state);
        return isUserLoggedIn && boolValue(showWeather);
    } catch (e) {
        return false;
    }
};

export const showStoreStatusIndicator = (storeConfigShowDelivery, storeConfigShowCollection, menuAvailableObject = {}) => {
    const isDeliveryMenuAvailable = isValidElement(menuAvailableObject?.delivery) ? menuAvailableObject.delivery : true;
    const isCollectionMenuAvailable = isValidElement(menuAvailableObject?.collection) ? menuAvailableObject.collection : true;
    try {
        const result =
            isDeliveryOrCollectionOnlyAvailable(storeConfigShowDelivery, storeConfigShowCollection) ||
            (isDeliveryMenuAvailable && !isCollectionMenuAvailable) ||
            (!isDeliveryMenuAvailable && isCollectionMenuAvailable);
        return isBoolean(result) ? result : isValidElement(result);
    } catch (e) {
        return false;
    }
};
export const selectCustomerStoreConfigResponse = (state) => (isCustomerApp() ? state.appState.storeConfigResponse : null);

export const selectStoreType = (state) => {
    const countryId = selectCountryId(state);
    const storeConfigResponse = selectCustomerStoreConfigResponse(state);
    const initialConfigWebHost = getWebHost();
    const iniCountrytId = selectInitialConfigWeb(state);
    const getCountryId = countryId ? countryId : isCustomer ? storeConfigResponse?.country_id : iniCountrytId?.country?.code;
    if (getCountryId === COUNTRY_ID.US) {
        return STORE_TYPE.TAKEOUT;
    } else if (
        (isCustomer && isValidElement(storeConfigResponse) && storeConfigResponse?.businessType === STORE_TYPE.GIFT) ||
        (!isCustomer && isValidString(initialConfigWebHost) && initialConfigWebHost?.includes(FRANCHISE_NAME.FLOWERS_2_YOU))
    ) {
        return STORE_TYPE.GIFT;
    }
    return STORE_TYPE.TAKEAWAY;
};

export const selectFranchiseGuestLginEnabled = (state) => state?.appConfiguratorState?.show_guest_login ?? false;
export const selectShowGroupOrderGuestOption = (state) => state?.appConfiguratorState?.show_group_order_guest_option ?? false;
export const selectIsGiftCardAvailable = (state) => {
    const initialConfigWeb = selectInitialConfigWeb(state);
    let gift_card_status = state?.appConfiguratorState?.gift_card ?? (isWebDevice ? initialConfigWeb?.features?.gift_card : false);
    if (gift_card_status && isFoodhub) {
        gift_card_status = state?.appConfiguratorState?.store_specific_gift_card_redemption ?? false;
    }
    return gift_card_status;
};

export const selectStoreSpecificGiftCardRedemption = (state) => state?.appConfiguratorState?.store_specific_gift_card_redemption ?? false;

export const selectEnableMfeOnGiftCard = (state) => (isWebDevice && state?.appConfiguratorState?.enable_mfe_on_gift_card) || false; //Toggle for giftcard web mfe

export const selectEnableWebviewOnGiftCard = (state) => (!isWebDevice && state?.appConfiguratorState?.enable_webview_on_gift_card) ?? false; //Toggle for giftcard webview

export const showGiftCardRedeem = (state) => {
    return selectIsGiftCardAvailable(state) || state?.appConfiguratorState?.show_gift_card_in_basket;
};
export const giftCardUrlBuilder = (state) => {
    const s3Response = selectS3Response(state);
    const countryId = selectCountryId(state);
    const storeData = selectCustomerStoreConfigResponse(state);
    const configEnvType = selectEnvConfig(state);
    const isGiftCardAvailable = selectIsGiftCardAvailable(state);
    let url = getGiftCardPurchaseUrl(configEnvType);

    if (isGiftCardAvailable) {
        const generateUrl = (path) => `${url}/${path}`;

        if (isCustomer && isValidElement(storeData)) {
            const { id, slug_name } = storeData || {};
            url = generateUrl(`store/${seoFriendlyUrl(slug_name, true)}/${id}`);
        } else if (isFoodhub && !isWebDevice) {
            const id = getFranchiseIdBasedOnURL(countryId, configEnvType);
            const slug_name = seoFriendlyUrl(AppConfig.APP_NAME, true);
            url = generateUrl(`franchise/${slug_name}/${id}`);
        } else if ((isFoodhub || isFranchise) && isValidElement(s3Response) && isValidElement(s3Response.config)) {
            const { id, name } = s3Response?.config?.franchise || {};
            const slug_name = seoFriendlyUrl(name, true);
            url = generateUrl(`franchise/${slug_name}/${id}`);
        }

        return url;
    } else {
        return null;
    }
};
export const selectGlobalRecaptchaEnable = (state) =>
    isWebDevice ? state.appConfiguratorState?.show_google_recaptcha_for_web : state.appConfiguratorState?.show_google_recaptcha_for_app;

export const selectGuestLoginData = (state) => {
    return isValidString(state.appState?.guestLoginData) ? state.appState?.guestLoginData : null;
};
export const enableCollapsedTakeAway = (state) => state.appConfiguratorState.menu_category_collapsed;

export const enableSubCatCollapsedTakeAway = (state) => state.appConfiguratorState.menu_subcategory_collapsed;

export const enableLocateUsPage = (state) => state.appConfiguratorState.enable_locate_us_page;

export const selectShowQuickReviewPopup = (state) => {
    const isDineIn = IsDineInEnabled(state);
    const askReview = state.appState?.showQuickReviewFeedbackPopup;
    if (isDineIn) {
        return state.appConfiguratorState?.show_quick_review_popup_for_dineIn && askReview;
    } else {
        return askReview;
    }
};

export const singleTakeawayRedirect = (state) => state.appConfiguratorState.single_takeaway_redirect;

export const selectEnableFetchingFromMenuApi = (state) => state.appConfiguratorState.allow_menu_and_addon_api_fetch_always ?? false;

export const showCouponOnlyOnValidAddress = (state) => {
    return state?.appConfiguratorState?.show_coupon_only_on_valid_address ?? false;
};

export const quickCartUpdateEnabled = (state) => {
    return state?.appConfiguratorState?.quick_cart_update ?? false;
};

export const selectAllergyLinkBrandList = (state) => state.appConfiguratorState?.allergence_brandList ?? {};

export const selectGtmConversionKey = (state) => {
    return isValidString(state.appConfiguratorState?.gtm_conversion_key) ? state.appConfiguratorState?.gtm_conversion_key : null;
};

export const selectDualPricePercentage = (state) => {
    const storeConfigResponse = selectCustomerStoreConfigResponse(state);
    const { DUAL_PRICE, cash_discounts } = selectCustomerStoreConfigResponse(state) || {};
    if (
        isCustomerApp() &&
        isValidElement(storeConfigResponse) &&
        DUAL_PRICE === CONSTANTS.ENABLED &&
        isArrayNonEmpty(cash_discounts) &&
        isValidElement(cash_discounts?.[0]?.percent)
    ) {
        return cash_discounts?.[0]?.percent / 100;
    }
    return 0;
};

/***
 * isStoreAccessible key is introduced newly to the Store endpoint
 * This key is not part of older versions of API
 * If the key is present we return the key value
 * if the key is not present we will return true
 */
export const selectIsStoreAccessible = (state) => {
    const { isStoreAccessible } = selectStoreConfigResponse(state) || {};
    return isCustomer || isStoreAccessible || isStoreAccessible === undefined;
};

export const selectItemRatingIsMandotry = (state) => {
    return state.appConfiguratorState?.is_item_rating_mandatory
        ? state.appConfiguratorState?.is_item_rating_mandatory && selectShowItemRating(state)
        : false;
};

export const selectItemRatingThresoldValue = (state) => {
    return state.appConfiguratorState?.item_rating_threshold_value ?? 0;
};

export const selectShowItemRating = (state) => {
    return state.appConfiguratorState?.show_item_rating ?? true;
};

export const selectAllowVerifiedUser = (state) => state.appConfiguratorState?.enable_verified_user ?? false;
export const selectDisableCashForAlcohol = (state) => {
    return (
        state.appState?.storeConfigResponse?.DISABLE_CASH_FOR_ALCOHOL?.toUpperCase() === TOGGLE_STATUS.ENABLED ||
        (state.appState?.storeConfigResponse?.DISABLE_CASH_FOR_ALCOHOL?.toUpperCase() !== TOGGLE_STATUS.DISABLED &&
            state.appConfiguratorState?.disable_cash_for_alcohol)
    );
};

export const selectIsNewDineInFlowEnabled = (state) => {
    return state?.appConfiguratorState?.is_new_dine_in_flow ?? false;
};

export const selectDeliveryChargeEnabled = (state) => {
    return state.appState?.appConfiguratorState?.show_delivery_charge;
};

export const selectResetSlotOnTASwitch = (state) => {
    return state?.appConfiguratorState?.reset_slot_on_TA_switch ?? false;
};

export const selectDineInUserDetailConfig = (state) => {
    return state?.appConfiguratorState?.dine_in_user_detail_config;
};

export const selectDineInQuickOrder = (state) => {
    const orderType = selectOrderType(state);
    const isDineIn = isDineInOrderType(orderType);
    return isDineIn && state?.appConfiguratorState?.dinein_quick_order;
};

export const selectShowDineInUserDetails = (state) => {
    const userDetailConfig = selectDineInUserDetailConfig(state);
    if (!userDetailConfig) {
        return false;
    }

    const { first_name, last_name, phone, email } = userDetailConfig || {};
    return first_name || last_name || phone || email;
};

export const selectSetDefaultOrderType = (state) => state?.appConfiguratorState?.set_default_order_type ?? false;
export const selectSetAsapOrderTypeFirst = (state) => state?.appConfiguratorState?.set_asap_order_type_first ?? false;
export const selectShouldRestrictUnsecuredDevice = (state) => state?.appConfiguratorState?.restrict_unsecured_device ?? false;

export const selectTwoColumnImageThreshold = (state) => {
    return !isWeb() && !isFoodHubApp() ? 100 : state.appConfiguratorState?.two_column_image_threshold || 60;
};
