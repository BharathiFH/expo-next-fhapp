import React from 'react';
import { Clipboard, Dimensions, Linking, Platform, Share } from 'react-native';
import {
    HapticFrom,
    LOCAL_SCHEMA,
    OS_PLATFORM,
    RANDOM_STRING_ALPHA_NUMERIC,
    TABLET_PORTRAIT_MAXIMUM,
    BIG_FODDIE_FRANCHISE_ID
} from './Constants';
import moment from 'moment-timezone';
import { formatPostcodeFormatUK, isValidPostCode, postcodeValidationFormatter } from './ValidationUtil';
import { T2SConfig } from './T2SConfig';
import { getModel, getVersion, isTablet } from 'react-native-device-info';
import { getCurrentLoyaltyPoints } from 'appmodules/LoyaltyPointsModule/Utils/LoyaltyHelper';
import { LOYALTY_POINTS_ZERO } from 'appmodules/LoyaltyPointsModule/Utils/LoyaltyConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Config from 'react-native-config';
import { PAYMENT_METHOD } from 'appmodules/ProfileModule/Utils/ProfileConstants';
import crashlytics from '../../CustomerApp/NativeDependencies/Firebase/Crashlytics';
import { BASE_PRODUCT_CONFIG } from '../Network/ApiConfig';
import { getEmail, getUserName, isAndroid, isValidElementCheck, isValidStringCheck } from 'appmodules/BaseModule/Helper';
import { showErrorMessage, showInfoMessage } from '../Network/NetworkHelpers';

import {
    countLeadingZeros,
    countryId,
    getAppTag,
    getDefaultBannerImage,
    isAutoCompletePickerArea,
    isUKApp,
    isUSApp
} from 'appmodules/BaseModule/GlobalAppHelper';

import {
    AppConfig,
    CP_VERSION,
    DISABLE_IP_ADDRESS_FOR_RECAPTCHA,
    ENV_TYPE,
    FRANCHISE_WEB_VERSION,
    getEnvHost,
    getEnvType,
    LANGUAGE
} from '../../CustomerApp/Utils/AppConfig';
import { getPrefixedCountryCode } from 'appmodules/ProfileModule/Utils/ProfileHelper';
import { DATE_FORMAT, getCurrentMoment } from './DateUtil';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { getHapticFeedbackType } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { COUNTRY_DATA } from '../../FoodHubApp/LandingPage/Utils/Helper';
import { menu } from '../../CustomerApp/View/SideMenu/SideMenuConfig';
import { isFeatureVisible } from '../../CustomerApp/Saga/AppSaga';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { BOOL_CONSTANT } from 'appmodules/AddressModule/Utils/AddressConstants';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AppModules/AnalyticsModule/Analytics';
import { convertProfileResponseToAnalytics } from 'appmodules/AnalyticsModule/Braze';
import { DEFAULT_FLOAT_VALUE, FOODHUB_FRANCHISE_ID } from '../../CustomerApp/Utils/AppContants';
import { ORDER_STATUS_ANIMATION_ICON, ORDER_STATUS_ENUM } from '../UI/CustomUI/OrderTracking/Utils/OrderTrackingConfig';
import { Colors } from '../Themes';
import { getWebHost, isEatAppyClient, isLowerEnvironment, isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
import { DIMENSION_MODES, LARGE_SCREEN_WIDTH, SMALL_SCREEN_WIDTH, TABLET_SCREEN_WIDTH } from 't2sbasemodule/Utils/Constants';
import { getAppType } from '../../AppModules/ConfiguratorModule/Utils/ConfiguratorHelper';
import md5 from 'md5';
import { FIREBASE_AUTH_ERRORS } from '../../AppModules/AuthModule/Utils/AuthConstants';
import VersionNumber from 'react-native-version-number';
import { FRANCHISE_NAME } from '../../AppModules/ConfiguratorModule/Utils/ConfiguratorAutomationConstants';
import { capitalizeFirstLetter, replaceHyphenWithSpace, schemaRoutes } from './SeoConstant';
import { BUSINESS_TYPE, DEFAULT_STORE_ID } from '../../AppModules/BaseModule/GlobalAppConstants';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { getTextColorBasedOnBackground } from '../../AppModules/BaseModule/ColorsHelper';
import { setCookies } from '../Network/SessionManager/Utils/CookiesHelper';
import { cleanSpecialCharForSeo } from '../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { USER_TYPES } from '../../AppModules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { getItemQuantityText } from '../../AppModules/MenuModule/Utils/MenuHelpers';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { navigateReset } from 'CustomerApp/Navigation/NavigationService';
import * as DeviceDetail from '../../AppModules/DeviceInfo/DeviceDetail';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
export const isLandscapeDevice = deviceWidth >= deviceHeight;

const phoneUtil = PhoneNumberUtil.getInstance();
export let deviceInformation = {};

//Don't assign constant variable before creating function
export const isWebDevice = isWeb();
const host = getWebHost();

export const isValidElement = (data) => {
    return isValidElementCheck(data);
};

export const isValidString = (data) => {
    return isValidStringCheck(data);
};

//its check only typeof of data
export const isValidStringType = (data) => {
    return isValidElementCheck(data) && typeof data === 'string';
};

export const isValidNumber = (data) => {
    return data !== null && data !== undefined && data !== '' && !isNaN(data);
};

export const isValidArray = (data) => {
    return Array.isArray(data);
};

export const isValidObject = (data) => {
    return isValidElement(data) && typeof data === 'object';
};

export const isValidNotEmptyString = (data) => {
    return isValidString(data) && data.trim().length > 0;
};

export const boolValue = (value) => {
    return (
        isValidElement(value) &&
        (value === 1 ||
            value === '1' ||
            value.toString().toLowerCase() === 'true' ||
            value.toString().toLowerCase() === 'yes' ||
            value.toString().toLowerCase() === 'enabled')
    );
};
export const isValidFunction = (data) => {
    return isValidElementCheck(data) && typeof data === 'function';
};

export const safeStringValue = (value) => {
    if (isValidElement(value)) {
        try {
            return value.toString();
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
};

export const safeTrimmedStringValue = (value) => {
    if (isValidElement(value)) {
        try {
            return value?.toString()?.trim();
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
};

const isFoodhubWeb = isFromFoodhubHost();
export function isFoodHubApp() {
    return Config.APP_TYPE === 'FOODHUB' || isFoodhubWeb;
}

export function isNonCustomerApp() {
    return isFoodHubApp() || isFranchiseApp();
}

export function isCustomerApp() {
    return Config.APP_TYPE === 'CUSTOMER';
}

export const showCustomerReview = (feedback) => {
    return isCustomerApp() ? feedback !== '0' : true;
};

export function isFranchiseApp() {
    return Config.APP_TYPE === 'FRANCHISE' && !isFoodhubWeb;
}

export function isBigfoodieApp() {
    if (isWebDevice) {
        return isFranchiseApp() && getWebHost()?.includes(FRANCHISE_NAME.BF);
    } else {
        return Config?.FRANCHISE_ID ? Config.FRANCHISE_ID === BIG_FODDIE_FRANCHISE_ID : false;
    }
}
const isBigfoodie = isBigfoodieApp();

export function isFromFoodhubHost() {
    if (!isWebDevice || Config.APP_TYPE === 'CUSTOMER') {
        return false;
    } else {
        const webHost = getWebHost() ?? '';
        const pattern = /\bfoodhub\b|foodhub[-.]|food-hub/i;
        return pattern.test(webHost);
    }
}

export function isTARecommendationAvailable(countryID) {
    return isFoodHubApp() && isUKTakeaway(countryID);
}

export function isOneOfFoodhubPortals() {
    const isEatAppy = isWeb() ? getWebHost()?.includes('eatappy') : isEatAppyClient();
    return isBigfoodie || isFoodHubApp() || isEatAppy;
}

/**
 * return safe Int Value
 * @param value
 * @param decimal
 * @returns {number}
 */
export const safeFloatValue = (value, decimal = 2) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value).toFixed(decimal);
        } catch (e) {
            return 0.0;
        }
    } else {
        return 0.0;
    }
};

export const convertFloat = (value) => {
    try {
        const result = parseFloat(value);
        if (!isNaN(result)) {
            return result;
        }
    } catch (e) {
        // nothing to do
    }
    return null;
};

export const safeFloatRoundedValue = (value) => {
    return Math.round(safeFloatValue(value) * 10000);
};

export const safeFloatValueWithoutDecimal = (value, defaultValue = 0.0) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value);
        } catch (e) {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
};

export const isGreaterThanFloatZero = (value) => {
    return safeFloatValueWithoutDecimal(value) > DEFAULT_FLOAT_VALUE;
};

/**
 * return safe Int Value
 * @param value
 * @returns {number}
 */
export const safeIntValue = (value) => {
    if (isValidElement(value)) {
        try {
            return parseInt(value, 10);
        } catch (e) {
            return 0;
        }
    } else {
        return 0;
    }
};

export const trimDecimal = (text) => {
    if (isValidElement(text)) {
        let decimal = text
            .replace(' ', '')
            .replace('-', '')
            .replace(',', '')
            .replace(/[^0-9.]|\.(?=.*\.)/g, '');
        return decimal.split('.').length === 2 && decimal.split('.')[1].length > 2
            ? (Math.floor(parseFloat(decimal) * 100) / 100).toFixed(2).toString()
            : decimal;
    }
    return text;
};

export const trimInteger = (text) => {
    if (isValidString(text)) {
        text.replace(' ', '')
            .replace('.', '')
            .replace('-', '')
            .replace(',', '')
            .replace(/[^0-9.]|\.(?=.*\.)/g, '');
    } else {
        return text;
    }
};

export const capsWordCase = (str) => {
    if (isValidElement(str)) {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }
    return str;
};

export const getDeviceOS = () => {
    if (Platform.OS === 'ios') {
        return OS_PLATFORM.iOS;
    } else {
        return OS_PLATFORM.ANDROID;
    }
};

export const isNewerVersion = (oldVer, newVer) => {
    const oldParts = oldVer.toString().split('.');
    const newParts = newVer.toString().split('.');
    for (let i = 0; i < newParts.length; i++) {
        const a = parseInt(newParts[i]) || 0;
        const b = parseInt(oldParts[i]) || 0;
        if (a > b) {
            return true;
        }
        if (a < b) {
            return false;
        }
    }
    return false;
};

export function getPlatformID() {
    return BASE_PRODUCT_CONFIG.platform_id;
}

export const callNumber = (url) => {
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                // Not support for Dial Pad
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => {
            // Error
        });
};
export const callDialPad = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                // Not support for Dial Pad
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => {
            // Error
        });
};
export const getNextPage = (currentPage, lastPage) => {
    if (currentPage !== lastPage && lastPage > 1) {
        return currentPage + 1;
    }
    return -1;
};
export const validateRegex = (pattern, data) => {
    //TODO not working properly
    let regex = new RegExp(pattern);
    return regex.test(data);
};
export const isValidTextFormat = (regexPattern, value) => {
    return regexPattern.test(value);
};
/**
 * is More than Zero
 * @param value
 * @returns {*|boolean|boolean}
 */
export const isNegativeValue = (value) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value) < 0.0;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

/**
 * return safe Absolute Value
 * @param value
 * @returns {number}
 */
export const safeAbsoluteValue = (value) => {
    if (isValidElement(value)) {
        try {
            let values = parseFloat(value).toFixed(2);
            return Math.abs(values);
        } catch (e) {
            return 0;
        }
    } else {
        return 0;
    }
};

/**
 * is More than Zero
 * @param value
 * @returns {*|boolean|boolean}
 */
export const isMoreZero = (value) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value) > 0;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

export const isNonEmptyString = (data) => {
    return data !== null && data !== undefined && data.toString().length > 0;
};

export const checkAndAppend = (value, placeholder) => {
    return `${placeholder}  ${isValidString(value) ? ' - ' + value : ''}`;
};

export const prefixZero = (number, length = 2) => {
    let string = '' + number;
    while (string.length < length) {
        string = '0' + string;
    }
    return string;
};

/**
 *
 * @param length
 * @returns {string}
 * Genrate and return random string of Given length from available alpha numeric characters
 */
export const randomStringWithLength = (length) => {
    var randomStrArr = [];
    var ALPHANUMERIC = RANDOM_STRING_ALPHA_NUMERIC.ALPHANUMERIC;
    for (var i = 0; i < length; i++) {
        randomStrArr[i] = ALPHANUMERIC.substr(Math.floor(Math.random() * ALPHANUMERIC.length), 1);
    }
    return randomStrArr.join('').toUpperCase();
};
export const appDefaultImage = (appName) => {
    return getDefaultBannerImage(appName);
};
export const getDateStr = (date, format) => {
    return moment(date).format(format);
};

export const getTableReservationDate = (timeZone = undefined) => {
    return getCurrentMoment(timeZone).format(DATE_FORMAT.YYYY_MM_DD);
};

export const firstCharacterUpperCased = (text) => {
    if (isValidString(text)) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
        return '';
    }
};

export const firstWordUpperCased = (text) => {
    let output = '';
    let words = isValidElement(text) ? text.trim().split(' ') : text;
    words.forEach((value) => {
        output = output + firstCharacterUpperCased(value) + ' ';
    });
    return output?.trim();
};

export const checkRegexPatternTest = (pattern, data) => {
    let testPattern = new RegExp(pattern);
    return testPattern.test(data);
};

export const isLessThan10MB = (bytes) => {
    let mb = bytes / 1000 / 1000;
    return mb < 10;
};

export const isDesiredFormat = (type) => {
    let desiredFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    return desiredFormats.indexOf(type) > -1;
};
export const EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_PATTERN =
    '^(((\\+44\\s?\\d{4}|\\(?0\\d{4}\\)?)\\s?\\d{3}\\s?\\d{3})|((\\+44\\s?\\d{3}|\\(?0\\d{3}\\)?)\\s?\\d{3}\\s?\\d{4})|((\\+44\\s?\\d{2}|\\(?0\\d{2}\\)?)\\s?\\d{4}\\s?\\d{4}))(\\s?\\#(\\d{4}|\\d{3}))?$';

export const isValidURL = (str) => {
    if (isValidString(str)) {
        let regexp =
            /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(str);
    } else {
        return false;
    }
};

export const isValidFormat = (regex, enteredString) => {
    if (regex.test(enteredString)) {
        return true;
    }
    return false;
};

export const priceValidationFormatter = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
        return text;
    }
};

export const isEmpty = (string) => {
    return !string || string.length === 0;
};

export const validatePostcode = (postCode, countryId) => {
    if (countryId === T2SConfig.country.UK) {
        return formatPostcodeFormatUK(postcodeValidationFormatter(postCode)).toUpperCase();
    } else {
        return postCode.toUpperCase();
    }
};

export const getPostCodeKeyboardType = (s3Response) => {
    if (isAutoCompletePickerArea(s3Response)) {
        return { keyboardType: 'default', autoCapitalize: 'words' };
    }

    switch (getTakeawayCountryId(s3Response?.country?.id)) {
        case T2SConfig.country.UK:
            return { keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default' };

        case T2SConfig.country.IRE:
            return { keyboardType: 'default', autoCapitalize: 'words' };

        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return { keyboardType: 'numeric', autoCapitalize: 'none' };

        case T2SConfig.country.US:
            return { keyboardType: 'numeric', autoCapitalize: 'none' };
        default:
            return { keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default' };
    }
};

export const getPostCodeMaxLength = (countryId) => {
    switch (countryId) {
        case T2SConfig.country.UK:
            return T2SConfig.maxPostCode.UK;
        case T2SConfig.country.IRE:
            return T2SConfig.maxPostCode.IRE;
        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return T2SConfig.maxPostCode.AUS_NZ;
        case T2SConfig.country.US:
            return T2SConfig.maxPostCode.US;
        default:
            return 10;
    }
};

export const getPostcodeDisplayLabel = (countryId) => {
    switch (countryId) {
        case T2SConfig.country.UK:
            return LOCALIZATION_STRINGS.POST_CODE;
        case T2SConfig.country.IRE:
            return LOCALIZATION_STRINGS.AREA;
        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return LOCALIZATION_STRINGS.AREA_POSTCODE;
        default:
            return LOCALIZATION_STRINGS.POST_CODE;
    }
};

export const getTakeawayCountryId = (countryId) => {
    return isValidString(countryId) ? countryId : T2SConfig.country.UK;
};

export const getCountryNameIso = (countryIso) => {
    return isValidString(countryIso) ? countryIso : COUNTRY_DATA.data[0].iso;
};

/**
 * If you want to get the exact policy id of GDPR consent, you should pass the policy_type_id from API config
 * @param policyLookupResponse
 * @param key
 * @returns {*}
 */
export const getPolicyId = (policyLookupResponse, key) => {
    let data = getPolicy(policyLookupResponse, key);
    return isValidElement(data) ? data.id : undefined;
};

export const getPolicy = (policyLookupResponse, key) => {
    const data =
        isValidElement(policyLookupResponse) &&
        isValidElement(policyLookupResponse.data) &&
        policyLookupResponse.data.length > 0 &&
        policyLookupResponse.data.find((item) => item.policy_type_id === key);
    return data ? data : undefined; // data can be false, so using normal check
};

export const secondsToTimer = (seconds) => {
    const duration = moment.duration({ seconds });
    return {
        second: prefixZero(duration.seconds()),
        minute: prefixZero(duration.minutes()),
        hour: prefixZero(duration.hours())
    };
};

export const isDisplayBanner = (loyaltyStatusMessage, loyaltyPoints) => {
    if (
        isValidElement(loyaltyPoints) &&
        getCurrentLoyaltyPoints(loyaltyPoints) > LOYALTY_POINTS_ZERO &&
        isValidString(loyaltyStatusMessage)
    ) {
        return true;
    }
    return false;
};
export const getCurrentDay = (overrideMoment = null) => {
    return (overrideMoment ?? moment()).format(DATE_FORMAT.DDDD).toLowerCase();
};
export const menuHelperV2Call = (v3Status = null, menuVersion = null) => {
    if (isFoodHubApp()) {
        return isValidString(menuVersion) ? `v${menuVersion}/` : 'v2/';
    } else if (v3Status === 'ENABLED' || v3Status === true) {
        return 'v3/';
    }
    return '';
};
export const calculateDate = (startDate, format, days) => {
    return moment(startDate, format).add(days, 'days').toDate();
};

export const currentDateString = (format) => moment().format(format);

export const getUserAgent = () => {
    let osName = 'Unknown';

    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        if (navigator.userAgent.indexOf('Win') !== -1) {
            osName = 'Windows';
        }
        if (navigator.userAgent.indexOf('Mac') !== -1) {
            osName = 'macOS';
        }
        if (navigator.userAgent.indexOf('Linux') !== -1) {
            osName = 'Linux';
        }
        if (navigator.userAgent.indexOf('Android') !== -1) {
            osName = 'androidWeb';
        }
        if (navigator.userAgent.indexOf('iOS') !== -1) {
            osName = 'iosWeb';
        }
    }
    return osName;
};

export const getDeviceInfo = () => ({
    os: isWebDevice ? getUserAgent() : getModel(),
    version: isWebDevice ? FRANCHISE_WEB_VERSION : getVersion(),
    platform: Platform.OS
});

export const isPriceZero = (price) => {
    if (isValidElement(price)) {
        return Number(price) === 0 && !isNaN(price);
    }
    return true;
};
export const addPrefixZero = (number) => {
    let string = '' + number;
    if (isValidElement(string[0]) && !string[0].includes('0')) {
        string = '0' + string;
    }
    return string;
};
/**
 Trim white/blank spaces at the end and beginning of the text
 */
export const trimBlankSpacesInText = (text) => {
    if (isValidString(text)) {
        return text.replace(/^\s+|\s+$/gm, '');
    } else {
        return '';
    }
};

//trim blank space at the beginning&end of the text and remove comma at the end of the text
export const trimCommaAndSpace = (text) => {
    if (isValidString(text)) {
        return text.replace(/,\s$/, '');
    } else {
        return text;
    }
};

export const setUserDetailsForCrashlytics = (response) => {
    if (isValidElement(response)) {
        try {
            crashlytics()
                .setUserId(isValidString(response.id) ? response.id.toString() : '')
                .then();
            crashlytics()
                .setAttributes({
                    phone: isValidString(response.phone) ? response.phone.toString() : '',
                    email: isValidString(response.email) ? response.email : '',
                    name: getUserName(response),
                    app_type: getAppType(),
                    cp_version: getCPVersionUserAttributes()
                })
                .then();
        } catch (err) {
            //Nothing to Handle
        }
    }
};

export const getTakeawayName = (takeawayName) => {
    return isValidString(takeawayName) ? takeawayName : '';
};

export const getTakeawayId = (object) => {
    return isValidElement(object) && isValidElement(object.id) ? object.id : isNonCustomerApp() ? null : AppConfig.STORE_ID;
};

export const getTakeawayNameFromRoute = (route) => {
    return isValidElement(route) &&
        isValidElement(route.params) &&
        isValidElement(route.params.store) &&
        isValidElement(route.params.store.name)
        ? route.params.store.name
        : '';
};

export const getAppName = (storeConfigName) => {
    if (isFoodHubApp()) {
        return Config.APP_NAME;
    } else if (isFranchiseApp()) {
        return Config.APP_NAME;
    } else if (isValidElement(storeConfigName)) {
        return storeConfigName;
    } else if (isCustomerApp()) {
        return Config.APP_NAME;
    } else {
        return 'App';
    }
};

export const getAppNameForWeb = (appNameFromState) => {
    return isWeb() ? (isValidString(appNameFromState) ? appNameFromState : getAppType()) : getAppName();
};

export const isTakeawaySupportOptomany = (storeConfigPaymentProvider) => {
    return isValidElement(storeConfigPaymentProvider) && storeConfigPaymentProvider === PAYMENT_METHOD.OPTOMANY;
};

//TODO Feature Gate
export const getPaymentProvider = (storeConfigPaymentProvider) => {
    if (isValidElement(storeConfigPaymentProvider)) {
        return storeConfigPaymentProvider;
    } else {
        return PAYMENT_METHOD.OPTOMANY;
    }
};

export const getMobileNumberLength = (object) => {
    if (isValidElement(object) && isValidElement(object.mobile) && isValidElement(object.mobile.max_length)) {
        return safeIntValue(object.mobile.max_length);
    } else {
        return 11;
    }
};

export const formatPhoneNo = (phoneNo, countryIso, countryCode, isInterNational = false) => {
    if (!isValidString(phoneNo) || !isValidElement(countryIso)) {
        return phoneNo;
    }
    try {
        const parsedNumber = phoneUtil.parse(phoneNo, countryIso);
        const formattedNumber = isInterNational
            ? phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL)
            : phoneUtil.format(parsedNumber, PhoneNumberFormat.NATIONAL);

        return formattedNumber;
    } catch (error) {
        return phoneNo;
    }
};
export const getCountryCode = (countryIso, needPlus = true) => {
    if (isValidElement(countryIso)) {
        try {
            const countryCode = phoneUtil.getCountryCodeForRegion(countryIso.toUpperCase());
            return needPlus ? `+${countryCode}` : `${countryCode}`;
        } catch (error) {
            return null;
        }
    }
    return null;
};

export const normalizePhoneNo = (phoneNo) => {
    if (!isValidString(phoneNo)) {
        return phoneNo;
    }
    return phoneNo.replace(/\D/g, '');
};

export const currencyValue = (value, currency, number) => {
    let fixedValue = isFloat(Number(value)) ? safeFloatValue(value, number) : safeFloatValueWithoutDecimal(value);
    return `${currency}${fixedValue}`;
};
export const getCurrentDayInNumber = () => {
    return moment().weekday() + 1;
};
export const isFloat = (n) => {
    return Number(n) === n && Number(n) % 1 !== 0;
};

export const distanceValue = (value) => {
    if (isValidElement(value)) {
        return parseFloat(value).toFixed(2);
    }
    return 0;
};

export const kFormatter = (num) => {
    if (!num) {
        return 0;
    }
    const absNum = Math.abs(num);
    if (absNum >= 1000) {
        let kValue = Math.sign(absNum) * (Math.floor(Math.abs(absNum) / 100) / 10);
        return kValue + (kValue * 1000 === absNum ? 'k' : 'k+');
    } else if (absNum >= 100) {
        const hundredValue = Math.floor(absNum / 100) * 100;
        return hundredValue === absNum ? hundredValue : hundredValue + '+';
    } else {
        return absNum;
    }
};

/**
 *
 * unit = the unit you desire for results                               :::
 where: 'M' is statute miles (default)                         :::
 'K' is kilometers                                      :::
 'N' is nautical miles
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @param unit
 * @returns {number}
 */
export function distance(lat1, lon1, lat2, lon2, unit = 'M') {
    if (!isValidElement(lat1) || !isValidElement(lon1) || !isValidElement(lat2) || !isValidElement(lon2)) {
        return;
    }
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    } else {
        const radlat1 = (Math.PI * lat1) / 180;
        const radlat2 = (Math.PI * lat2) / 180;
        const theta = lon1 - lon2;
        const radtheta = (Math.PI * theta) / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === 'K') {
            dist = dist * 1.609344;
        }
        if (unit === 'N') {
            dist = dist * 0.8684;
        }
        return Math.abs(dist);
    }
}

export const isUKTakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.UK;
};

export const isUSTakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.US;
};

export const isIRETakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.IRE;
};

export const getTakeawayCountryName = (countryName) => {
    return isValidString(countryName) ? countryName : COUNTRY_DATA.data[0].name;
};

export const getDefaultLanguageName = (defaultLanguage) => {
    return isValidString(defaultLanguage) ? defaultLanguage : LANGUAGE().default;
};

export const getSelectedLanguageName = (language, defaultLanguage) => {
    return isValidElement(language) && isValidString(language.name) ? language.name : getDefaultLanguageName(defaultLanguage).name;
};

export const getSelectedLanguage = (language, defaultLanguage) => {
    return isValidElement(language) ? language : getDefaultLanguageName(defaultLanguage);
};

/**
 *
 * Method to add default touch area for views.
 * @param size - touch area size to be increased all side equally
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
export const defaultTouchArea = (size = 16) => {
    return { left: size, top: size, right: size, bottom: size };
};

/**
 * Method to add touch area for views.
 * @param left - additional touch area for left side
 * @param top - additional touch area for top side
 * @param right - additional touch area for right side
 * @param bottom - additional touch area for bottom side
 * @returns {{top: *, left: *, bottom: *, right: *}}
 */
export const touchArea = (left, top, right, bottom) => {
    return { left, top, right, bottom };
};

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const { height, width } = Dimensions.get('window');
const isTabletDevice = isTablet();

export function isIPhoneX() {
    return Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
        ? (width === X_WIDTH && height === X_HEIGHT) || (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
        : false;
}

export const copyToClipboard = (value, msg = LOCALIZATION_STRINGS.COPIED) => {
    if (isWebDevice && typeof navigator?.clipboard?.writeText === 'function') {
        navigator.clipboard.writeText(value).then(() => showInfoMessage(msg, null, true));
    } else {
        writeToClipboard(value).then(() => showInfoMessage(msg, null, true));
    }
};

export const writeToClipboard = async (value) => {
    try {
        await Clipboard.setString(`${value}`);
    } catch (e) {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
};

export const handleReDirectToStoreReview = (
    profileResponse,
    orderID,
    iosStoreLink,
    androidStoreLink,
    countryIso,
    isReview = true,
    fromThumbsUp = false
) => {
    if (isReview) {
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_STATUS, ANALYTICS_EVENTS.RATE_US, {
            name: getUserName(profileResponse),
            emailId: getEmail(profileResponse),
            orderID: isValidString(orderID) ? orderID.toString() : ''
        });
    }
    let iOSAppURL = iosStoreLink || AppConfig.IOS_APP_STORE_URL;
    let iOSUrl = isReview ? iOSAppURL + '?mt=8&action=write-review' : iOSAppURL;

    let url;
    if (Platform.OS === 'ios') {
        url = iOSUrl;
    } else {
        url = androidStoreLink || AppConfig.ANDROID_PLAY_STORE_URL;
    }
    if (!isValidString(url)) {
        return null;
    }
    Linking.canOpenURL(url).then((supported) => {
        let eventObj = convertProfileResponseToAnalytics(profileResponse, countryIso);
        if (fromThumbsUp) {
            eventObj.thumbs_up_clicked = true;
        }
        if (supported) {
            Segment.trackEvent(SEGMENT_EVENTS.RATE_APP, eventObj);
            return Linking.openURL(url);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    });
};

export const getOrderExperienceRedirectURL = ({
    iosStoreLink,
    androidStoreLink,
    trustPilotUrl,
    appOrderExperienceRedirectionEnabled = false
}) => {
    const IOSAppURL = iosStoreLink || AppConfig.IOS_APP_STORE_URL;
    const iOSUrl = isValidString(IOSAppURL)
        ? `${IOSAppURL}${!appOrderExperienceRedirectionEnabled ? '?mt=8&action=write-review' : ''}`
        : null;
    const AOSAppURL = androidStoreLink || AppConfig.ANDROID_PLAY_STORE_URL;
    if (isWeb() && (isValidString(trustPilotUrl) || isValidString(AOSAppURL))) {
        return trustPilotUrl || AOSAppURL;
    } else if (Platform.OS === 'ios' && iOSUrl) {
        return iOSUrl;
    } else if (Platform.OS === 'android' && isValidString(AOSAppURL)) {
        return AOSAppURL;
    } else {
        return null;
    }
};

export const isDebugBuildType = () => {
    return AppConfig.buildConfig.buildType === 'debug';
};

export const isAutomationBuildType = () => {
    return AppConfig.buildConfig.automationBuildType;
};

export const separateCountryPrefix = (phone, countryIso) => {
    if (isValidElement(phone)) {
        if (phone.startsWith('0')) {
            let numberOfZeros = countLeadingZeros(phone);
            phone = phone.slice(numberOfZeros);
        }
        let formattedPhone = formatPhoneNo(phone, countryIso);
        return removeCountryCode(formattedPhone, countryIso);
    } else {
        return phone;
    }
};

export const removeCountryCode = (phone, countryIso) => {
    let countryCode = getCountryCode(countryIso, false);
    if (isValidElement(phone) && isValidElement(countryCode) && phone.length > countryCode.length) {
        let countryCodePart = phone.substring(0, countryCode.length);
        if (countryCode === countryCodePart) {
            return phone.slice(countryCode.length);
        } else if (phone.startsWith('0')) {
            let numberOfZeros = countLeadingZeros(phone);
            return phone.slice(numberOfZeros);
        } else {
            return phone;
        }
    } else {
        return phone;
    }
};

export const getFormattedTAPhoneNumber = (phone, countryIso, isInterNational = false) => {
    if (isValidElement(phone) && isValidElement(countryIso)) {
        return formatPhoneNo(phone, countryIso, null, isInterNational);
    }
    return phone;
};

export const getPhoneFromCountryNumber = (phone, countryId, countryIso) => {
    let normalisedPhone;
    if (isValidElement(phone)) {
        normalisedPhone = normalizePhoneNo(phone);
        if (isUKApp(countryId)) {
            return getPrefixedCountryCode(countryId, normalisedPhone);
        } else {
            return getCountryCode(countryIso, false) + normalisedPhone;
        }
    } else {
        return phone;
    }
};

export const getPhoneNumberNormalized = (phone, countryIso) => {
    if (isValidString(phone)) {
        let normalisedPhone = normalizePhoneNo(phone);
        if (isValidString(countryIso)) {
            let nationalPhone = removeCountryCode(normalisedPhone, countryIso);
            return getCountryCode(countryIso, true) + nationalPhone;
        } else {
            return normalisedPhone;
        }
    } else {
        return '';
    }
};

export const removePrefixFromNumber = (phone, countryId, allowZero = false) => {
    if (isValidElement(phone)) {
        if (isUSApp(countryId)) {
            if (isValidElement(phone[0]) && phone[0].includes('1')) {
                return phone.slice(1);
            } else {
                return phone;
            }
        } else {
            if (!allowZero && isValidElement(phone[0]) && phone[0].includes('0')) {
                return phone.slice(1);
            } else {
                return phone;
            }
        }
    }
};

//TODO need to fix in MYT. So, we have added temporary fix here.
export const getPhoneNoTableBooking = (phone, country_id, countryIso) => {
    let normalisedPhone;
    if (isValidElement(phone)) {
        normalisedPhone = normalizePhoneNo(phone);
        const countryCode = countryId(country_id);
        if (
            countryCode === T2SConfig.country.UK ||
            countryCode === T2SConfig.country.AUS ||
            countryCode === T2SConfig.country.NZ ||
            countryCode === T2SConfig.country.IRE
        ) {
            return addPrefixZero(normalisedPhone);
        } else {
            return getCountryCode(countryIso, false) + normalisedPhone;
        }
    } else {
        return phone;
    }
};

const getCPVersionUserAttributes = () => {
    return isValidString(CP_VERSION) ? CP_VERSION : 'NA';
};

export const safeArray = (arrayValue) => {
    return safeValue(arrayValue, []);
};

export const safeValue = (a, defaultValue) => {
    return isValidElement(a) && Array.isArray(a) ? a : defaultValue;
};

export function makeHapticFeedback(featureGateResponse, fromWhere) {
    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: true
    };
    try {
        const type = getHapticFeedbackType(featureGateResponse, fromWhere);
        if (isValidElement(type) && type !== HapticFrom.NONE) {
            ReactNativeHapticFeedback.trigger(type, options);
        }
    } catch (e) {
        //Nothing
    }
}
export const getWebviewUrl = (item) => {
    let { id, name } = isValidElement(item) && item;
    id = (safeIntValue(id) * 5).toString();
    let baseUrl = getWebViewBaseUrl();
    return `${baseUrl}${name}/-/${id}`;
};

const getWebViewBaseUrl = () => {
    return isFoodHubApp() ? 'https://foodhub.co.uk/ordernow/' : 'https://order.eatappy.com.au/ordernow/';
};

export const isWebviewEnabled = (item) => {
    const { web_view } = isValidElement(item) && item;
    return isValidElement(web_view) && (web_view.toUpperCase() === 'YES' || web_view.toUpperCase() === 'ENABLED');
};

export const isArrayEmpty = (newOrderResponse) => {
    return !isValidElement(newOrderResponse) || (isValidElement(newOrderResponse.length) && newOrderResponse.length === 0);
};

export const isArrayNonEmpty = (newOrderResponse) => {
    return isValidElement(newOrderResponse?.length) && newOrderResponse.length > 0;
};

export const getRoundedAmount = (amount) => {
    return isValidElement(amount) && Number(amount).toFixed(2);
};

export const isBoolean = (val) => {
    return val === false || val === true;
};

export const getCarousellSavingsText = (isUserLoggedIn) => {
    return isUserLoggedIn
        ? LOCALIZATION_STRINGS.YOUR_SAVINGS_THROUGH + ' ' + getAppName()
        : LOCALIZATION_STRINGS.WEEKLY_SAVINGS + ' ' + getAppName();
};

export const isValidTotalSavings = (isUserLoggedIn, foodHubTotalSavings) => {
    return !isUserLoggedIn && isFoodHubApp() && safeIntValue(foodHubTotalSavings?.savings) > 0;
};

export const getCarousellSavingsAmountDetails = (isUserLoggedIn, currencySymbol, foodHubTotalSavings, totalSavings) => {
    let amount = '';
    let text = getCarousellSavingsText(isUserLoggedIn);
    if (currencySymbol != null) {
        if (isValidTotalSavings(isUserLoggedIn, foodHubTotalSavings)) {
            amount = foodHubTotalSavings.savings;
        } else if (isUserLoggedIn && isValidString(totalSavings) && safeFloatValueWithoutDecimal(totalSavings) > 0) {
            amount = totalSavings;
        } else {
            text = LOCALIZATION_STRINGS.NO_SAVINGS;
        }
    }
    return {
        amount,
        text
    };
};

export const getOrderTrackingOrdertype = (sending) => {
    return sending === ORDER_TYPE.DELIVERY || sending === 'to' ? ORDER_TYPE.DELIVERY : ORDER_TYPE.COLLECTION;
};

export const getDefaultVisibleSideMenuItems = () => {
    return menu().filter((value) => {
        return !value.is_more && isFeatureVisible(value);
    });
};

export const getDefaultHiddenSideMenuItems = () => {
    return menu().filter((value) => {
        return value.is_more && isFeatureVisible(value);
    });
};

export const isValidImageUrl = (imgUrl) => {
    return isValidURL(imgUrl) && (imgUrl.includes('.png') || imgUrl.includes('.jpg') || imgUrl.includes('.jpeg'));
};

export const isValidJson = (data) => {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
};

export const isSmsPromotionChecked = (sms) => {
    return sms === BOOL_CONSTANT.YES;
};

export const isEmailPromotionChecked = (email) => {
    return email === BOOL_CONSTANT.YES;
};

export const openShareOption = (message = '') => {
    Share.share({ message: `${message}` })
        .then((res) => {
            if (__DEV__) {
                console.log(res);
            }
        })
        .catch((err) => {
            if (__DEV__) {
                err && console.log(err);
            }
        });
};

export const shareMessageToMessageApp = (message = '') => {
    let shareMessage = encodeURIComponent(message);
    openDirectShare(isAndroid() ? `sms:?body=${shareMessage}` : `sms:&body=${shareMessage}`);
};
export const shareMessageToWhatsApp = (message = '') => {
    let shareMessage = encodeURIComponent(message);
    openDirectShare(`https://api.whatsapp.com/send?text=${shareMessage}`);
};
export const openDirectShare = (url) => {
    try {
        Linking.openURL(url);
    } catch (e) {
        if (__DEV__) {
            console.log(JSON.stringify(e));
        }
    }
};
export const checkIsValidEmail = (email) => {
    //trim and then check
    let trimEmail = isValidString(email) ? email.trim() : email;
    return checkRegexPatternTest(EMAIL_PATTERN, trimEmail);
};

export const ConTwoDecDigit = (digit) => {
    if (isValidString(digit)) {
        return digit.indexOf('.') >= 0
            ? digit.split('.').length >= 2
                ? digit.split('.')[0].substring(-1, 2) + '.' + digit.split('.')[1].substring(-1, 2)
                : digit
            : digit.length >= 2
            ? digit.slice(0, 2)
            : digit;
    }
};

export const isValidDateString = (date) => {
    return isValidString(date) && date.slice(0, 4) !== '0000';
};

export const removeAlphabets = (text) => {
    return isValidString(text) ? text.replace(/[^\d.-:-]/g, '') : '';
};

export const isForceUpdateAvailable = (forcedVersionNumber, showForceUpdateModal) => {
    let appVersion = getVersion();

    return isValidString(forcedVersionNumber) && isNewerVersion(appVersion, forcedVersionNumber);
};

export const isOptionalUpdateAvailable = (
    optionalVersionNumber,
    optionalUpdateDismissed,
    showOptionalUpdateModal,
    showForceUpdateModal
) => {
    let appVersion = getVersion();

    return (
        isValidString(optionalVersionNumber) &&
        isNewerVersion(appVersion, optionalVersionNumber) &&
        !optionalUpdateDismissed &&
        !showOptionalUpdateModal &&
        !showForceUpdateModal
    );
};

export const getHostBasedOnEnv = (countryId, config) => {
    if (isWebDevice) {
        return getWebHost();
    }
    let envType = getEnvType(config),
        hostKey,
        data;
    if (isValidElement(config)) {
        hostKey = envType === ENV_TYPE.QA ? 'sit_host' : 'host';
    } else {
        hostKey = 'host';
    }
    data = COUNTRY_DATA.data.filter((item) => item.id === countryId);
    if (isArrayNonEmpty(data) && isValidElement(data[0][hostKey])) {
        return { franchise: data[0][hostKey] };
    }
    return '';
};
export const getHostBasedOnURL = (countryId, config, isCX = false) => {
    let envType = getEnvType(config),
        hostKey,
        data;
    let envHost = getEnvHost(config);
    if (isValidElement(config)) {
        hostKey = envType === ENV_TYPE.QA ? (isCX ? 'SIT_CX_HOST' : 'sit_host') : envHost;
    } else {
        hostKey = 'host';
    }
    data = COUNTRY_DATA.data.filter((item) => item.id === countryId);
    if (isArrayNonEmpty(data) && isValidElement(data[0][hostKey])) {
        return { franchise: data[0][hostKey] };
    }
    return '';
};
export const getFranchiseIdBasedOnURL = (countryId, config) => {
    let envType = getEnvType(config),
        hostKey,
        data;
    let envHost = getEnvHost(config);
    if (isValidElement(config)) {
        hostKey = envType === ENV_TYPE.QA ? 'sit_host' : envHost;
    }
    const franchiseKey = hostKey === 'preprod_host' ? 'preprod_franchise_id' : hostKey === 'sit_host' ? 'sit_franchise_id' : 'franchise_id';
    data = COUNTRY_DATA.data.filter((item) => item.id === countryId);
    if (isArrayNonEmpty(data) && isValidElement(data[0][hostKey])) {
        return data[0][franchiseKey];
    }
    return getEnvType(config) === ENV_TYPE.QA ? FOODHUB_FRANCHISE_ID.QA : FOODHUB_FRANCHISE_ID.LIVE;
};
export const getReCaptchaKey = ({ config, networkIp }) => {
    const isAutomationIp = getAutomationNetworks(networkIp);
    const isCustomer = isCustomerApp();
    const reCaptchaConfig = AppConfig[isCustomer ? 'nativeReCaptchaToken' : 'reCaptchaToken'];
    if (isAutomationIp) {
        return reCaptchaConfig.AUTOMATION;
    }
    if (isWeb()) {
        let currentHost = getWebHost();
        if (isLowerEnvironment(currentHost) || currentHost?.includes('preprod')) {
            return reCaptchaConfig.QA;
        }
    } else {
        let envType = getEnvType(config),
            hostKey;
        let envHost = getEnvHost(config);
        if (isValidElement(config)) {
            hostKey = envType === ENV_TYPE.QA ? 'sit_host' : envHost;
        }
        if (hostKey === 'sit_host' || hostKey === 'preprod_host') {
            return reCaptchaConfig.QA;
        }
    }

    return reCaptchaConfig.LIVE;
};
const getAutomationNetworks = (networkIp) => {
    if (isArrayNonEmpty(DISABLE_IP_ADDRESS_FOR_RECAPTCHA) && networkIp) {
        return DISABLE_IP_ADDRESS_FOR_RECAPTCHA?.includes(networkIp);
    }
    return false;
};
export const getOrderStatusWithIcon = (currentStatus, orderType) => {
    switch (currentStatus) {
        case ORDER_STATUS_ENUM.PLACED:
            return ORDER_STATUS_ANIMATION_ICON.PLACED;
        case ORDER_STATUS_ENUM.COOKING:
            return ORDER_STATUS_ANIMATION_ICON.COOKING;
        case ORDER_STATUS_ENUM.READY:
            return orderType === ORDER_TYPE.DELIVERY
                ? ORDER_STATUS_ANIMATION_ICON.READY_DELIVERY
                : ORDER_STATUS_ANIMATION_ICON.READY_COLLECTION;
        default:
            return null;
    }
};
export const getOrderStatusWithText = (currentStatus, orderType, businessType) => {
    const isNotRestaurant = businessType !== BUSINESS_TYPE.RESTAURANT;
    switch (currentStatus) {
        case ORDER_STATUS_ENUM.PLACED:
            return LOCALIZATION_STRINGS.ORDER_PLACED_ORDER_STATUS;
        case ORDER_STATUS_ENUM.COOKING:
            return LOCALIZATION_STRINGS[`PREPARING_YOUR_ORDER_ORDER_STATUS${isNotRestaurant ? '_GROCERY' : ''}`];
        case ORDER_STATUS_ENUM.READY:
            return orderType === ORDER_TYPE.DELIVERY
                ? LOCALIZATION_STRINGS.ON_THE_WAY_ORDER_STATUS
                : LOCALIZATION_STRINGS.ORDER_IS_READY_ORDER_STATUS;
        default:
            return null;
    }
};

export const seoFriendlyUrl = (val, lowerCase = true, town) => {
    if (val) {
        let trimmedValue = val.trim();
        val = trimmedValue.replace(/ /g, '-');
        val = cleanSpecialCharForSeo(val, town);
    } else {
        val = 'null';
    }
    return lowerCase ? val.toLowerCase() : val;
};

export const slugToReadableName = (slug) => {
    if (isValidString(slug)) {
        // Replace hyphens with spaces
        slug = slug.replace(/-/g, ' ');

        // Capitalize first letter of each word
        slug = slug.replace(/\b\w/g, (char) => char?.toUpperCase());

        return slug;
    }
};

export function convertTo12HourFormat(datetimeString) {
    if (!datetimeString) {
        return '';
    }

    const date = new Date(datetimeString);
    const now = new Date();

    // Normalize to midnight for comparison
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const targetDay = new Date(date);
    targetDay.setHours(0, 0, 0, 0);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert 0 to 12
    const minutesStr = minutes.toString().padStart(2, '0');
    const timeString = `${hours}:${minutesStr} ${ampm}`;

    if (targetDay.getTime() === tomorrow.getTime()) {
        return `${LOCALIZATION_STRINGS.TOMORROW_AT} ${timeString}`;
    } else if (targetDay.getTime() === today.getTime()) {
        return `${LOCALIZATION_STRINGS.AT} ${timeString}`;
    } else {
        // Format full date string
        const fullDate = date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return `${LOCALIZATION_STRINGS.AT} ${fullDate} ${timeString}`;
    }
}

export const formatString = (text) => text?.replace(/\s/g, '-').toLowerCase();

export const nonFormattedPostCode = (postcode) => {
    return isValidElement(postcode) ? postcode.replace(/\s/g, '') : '';
};
export const getRandomColorForTakeawayList = (index, logoUrl) => {
    switch (isValidString(logoUrl) && index % 3) {
        case 0:
            return Colors.yellowLight;
        case 1:
            return Colors.lightSkyBlue;
        case 2:
            return Colors.lightPink;
        default:
            return Colors.yellowLight;
    }
};

export const getNumColumns = (dimension = {}) => {
    const isLandscape = (dimension.width || width) > (dimension.height || height);
    const isLargeWidth = (dimension.width || width) > 1024;
    if (isLandscape) {
        return isLargeWidth ? 3 : 2;
    } else {
        return isTabletDevice ? 2 : 1;
    }
};

export const getFlexValueForTablet = (numColumns) => {
    return numColumns > 1 ? 1 / numColumns : 1;
};

export const getResponsiveFlexBasis = (numColumns) => {
    return 100 / numColumns + '%';
};
export const addUnderscoreToScreenName = (screenName) => {
    return screenName.replace(/\s+/g, '').replace('-', '_');
};

export const truncateText = (text, maxLength = 20) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

export const getDimensionModeOfScreen = (window) => {
    if (isValidElement(window?.width) && isValidElement(window?.height)) {
        const { width: screenWidth, height: screenHeight } = window;
        if (screenWidth > LARGE_SCREEN_WIDTH && screenWidth > screenHeight) {
            return DIMENSION_MODES.IS_LARGE_SCREEN_MODE;
        } else if (screenWidth >= TABLET_SCREEN_WIDTH && screenWidth <= LARGE_SCREEN_WIDTH && screenWidth > screenHeight) {
            return DIMENSION_MODES.IS_TABLET_LANDSCAPE_MODE;
        } else if (screenWidth >= SMALL_SCREEN_WIDTH && screenWidth <= TABLET_PORTRAIT_MAXIMUM && screenWidth < screenHeight) {
            return DIMENSION_MODES.IS_TABLET_PORTRAIT_MODE;
        } else {
            return DIMENSION_MODES.IS_SMALL_SCREEN_MODE;
        }
    } else {
        return DIMENSION_MODES.IS_LARGE_SCREEN_MODE;
    }
};
export const INITIAL_MODES = {
    isLargeScreenMode: false,
    isTabletLandscapeMode: false,
    isTabletPortraitMode: false,
    isSmallScreenMode: false
};
// Basically this not a deep merging so it will replace the mobilestyle from tabstyle
export function mergeWebTabletMobileStyle(mobileStyle, tabStyle, webStyle = {}) {
    return isWebDevice && isLandscapeDevice
        ? { ...mobileStyle, ...tabStyle, ...webStyle }
        : isLandscapeDevice
        ? { ...mobileStyle, ...tabStyle }
        : mobileStyle;
}
export const isLandscapeMode = (context) => {
    if (!isWebDevice) {
        return isLandscapeDevice;
    } else {
        const isLargeScreenMode = context?.isLargeScreenMode || false;
        const isTabletLandscapeMode = context?.isTabletLandscapeMode || false;
        return isLargeScreenMode || isTabletLandscapeMode;
    }
};
export const getNumberOfColumn = (context, isColumnView, isFromSubCat = false) => {
    const { isLargeScreenMode, isTabletLandscapeMode, isTabletPortraitMode, isSmallScreenMode } = context || {};
    if (isColumnView) {
        if (isFromSubCat) {
            return isLargeScreenMode ? 4 : isTabletLandscapeMode || isTabletPortraitMode ? 3 : isSmallScreenMode ? 2 : 2;
        }
        return context?.isTabletPortraitMode ? 3 : 2;
    } else {
        return 1;
    }
};
export const isMobileBrowser = (context) => {
    return isWebDevice && context?.isSmallScreenMode;
};
export const isWebBrowserForMobileAndTabletPortrait = (context) => {
    return isWebDevice && (context?.isSmallScreenMode || context?.isTabletPortraitMode);
};
export const isTabletLandscape = (context) => {
    return context?.isTabletLandscapeMode || false;
};
export const isTabletPortrait = (context) => {
    return context?.isTabletPortraitMode || false;
};
export const isPortraitMode = (context) => {
    if (!isWebDevice) {
        return (isTablet() && !isLandscapeDevice) || !isTablet();
    } else {
        const isSmallScreenMode = context?.isSmallScreenMode || false;
        const isTabletPortraitMode = context?.isTabletPortraitMode || false;
        return isSmallScreenMode || isTabletPortraitMode;
    }
};
export const getTakeAwayListColumns = (context) => {
    if (!isWebDevice) {
        if (isTablet() && isLandscapeDevice) {
            return 3;
        } else if (isTablet()) {
            return 2;
        }
    } else {
        const { isLargeScreenMode, isTabletLandscapeMode, isTabletPortraitMode, isSmallScreenMode } = context ?? {};
        if (isLargeScreenMode || isTabletLandscapeMode) {
            return 3;
        } else if (isTabletPortraitMode) {
            return 2;
        } else if (isSmallScreenMode) {
            return 1;
        }
    }
    return 1; // Default value if no conditions match
};

export const getTAWithMapColumns = (context) => {
    if (!isWebDevice) {
        if (isTablet() && isLandscapeDevice) {
            return 3;
        } else if (isTablet()) {
            return 2;
        }
    } else {
        const { isLargeScreenMode, isTabletLandscapeMode, isTabletPortraitMode, isSmallScreenMode } = context;
        if (isLargeScreenMode) {
            return 2;
        } else if (isTabletLandscapeMode) {
            return 3;
        } else if (isTabletPortraitMode) {
            return 2;
        } else if (isSmallScreenMode) {
            return 1;
        }
    }
    return 1; // Default value if no conditions match
};

export const getLocationListColumns = (context) => {
    if (!isWebDevice) {
        if (isTablet() && isLandscapeDevice) {
            return 4;
        } else if (isTablet()) {
            return 2;
        }
    } else {
        const { isLargeScreenMode, isTabletLandscapeMode, isTabletPortraitMode, isSmallScreenMode } = context;
        if (isLargeScreenMode || isTabletLandscapeMode) {
            return 4;
        } else if (isTabletPortraitMode) {
            return 3;
        } else if (isSmallScreenMode) {
            return 1;
        }
    }
    return 1; // Default value if no conditions match
};

export const getCuisineListColumns = (context, isModal) => {
    const { isLargeScreenMode, isTabletLandscapeMode } = context;
    if ((isLargeScreenMode || isTabletLandscapeMode) && isModal) {
        return 4;
    }
    return 3;
};

export const addSchemaToHead = (schema, id) => {
    if (isValidElement(id)) {
        const existingScript = document.getElementById(id);
        if (existingScript) {
            existingScript.text = schema;
        } else {
            const schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            schemaScript.text = schema;
            if (isValidElement(id)) {
                schemaScript.id = id;
            }
            document.head.appendChild(schemaScript);
        }
    }
};

export const localSchema = (config) => {
    const type = LOCAL_SCHEMA.FOODHUB_ESTABLISHMENT;
    const name = isBigfoodie ? LOCAL_SCHEMA.BIGFOODIE_SCHEMA : LOCAL_SCHEMA.FOODHUB_SCHEMA;
    const logoUrl = isBigfoodie ? config.logo : LOCAL_SCHEMA.LOGO_URL;
    const id = `https://${host}`;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': type,
        name: name,
        image: logoUrl,
        '@id': id,
        url: config.url,
        telephone: config.initialConfigWeb?.country?.customerCareNumber,
        servesCuisine: '',
        acceptsReservations: 'false',
        address: {
            '@type': 'PostalAddress',
            streetAddress: config.streetAddress,
            addressLocality: config.addressLocality,
            postalCode: config.postalCode,
            addressCountry: config.addressCountry
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: config.latitude,
            longitude: config.longitude
        },
        sameAs: config.sameAs
    });
};

export const getPathOfWindow = () => {
    if (isWebDevice) {
        const location = window.location;
        return `${location?.pathname}${isValidString(location?.hash) ? location?.hash : ''}`;
    }
    return '';
};

export const MyResponsiveContext = React.createContext(INITIAL_MODES);

export const isTabStack = (type) => {
    return type === 'tab';
};

export const isSocialLinksNotAvailable = (socialMedia) => {
    return !Object.values(socialMedia).every((value) => {
        return !isValidString(value);
    });
};
export const firstLetterCapital = (text) => {
    if (isValidString(text)) {
        return text[0].toUpperCase() + text.slice(1);
    }
    return '';
};

export const createDynamicListWithNumber = (count) => {
    return Array(count)
        .fill(1)
        .map((_, i) => i + 1);
};

//https://firebase.google.com/docs/reference/js/auth#autherrorcodes
export const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    let includeErrorCode = true; // Flag to determine if the error code should be included

    switch (errorCode) {
        case FIREBASE_AUTH_ERRORS.POPUP_CLOSED_BY_USER:
            errorMessage = LOCALIZATION_STRINGS.LOGIN_CANCELLED;
            break;
        case FIREBASE_AUTH_ERRORS.EXPIRED_POPUP_REQUEST:
            errorMessage = LOCALIZATION_STRINGS.LOGIN_FAILED;
            break;
        case FIREBASE_AUTH_ERRORS.POPUP_BLOCKED:
            errorMessage = LOCALIZATION_STRINGS.POPUP_BLOCKED;
            break;
        case FIREBASE_AUTH_ERRORS.NETWORK_REQUEST_FAILED:
            errorMessage = LOCALIZATION_STRINGS.GENERIC_ERROR_MSG;
            break;
        default:
            errorMessage = LOCALIZATION_STRINGS.WENT_WRONG;
    }

    if (errorCode === FIREBASE_AUTH_ERRORS.POPUP_CLOSED_BY_USER) {
        includeErrorCode = false;
    }
    const shortCode = generateMD5ShortCode(errorMessage);
    return includeErrorCode ? `${errorMessage} [Error Code : ${shortCode}]` : errorMessage;
};

export const generateMD5ShortCode = (errorMessage) => {
    try {
        const md5Hash = md5(errorMessage);
        return md5Hash.substr(0, 4);
    } catch (error) {
        // Handle the error
    }
};

export const handleNavigationForOrders = (navigationMethod, routeName, object) => {
    navigationMethod(routeName, object);
};

export const getDeviceMode = () => {
    return isTablet()
        ? isLandscapeDevice
            ? DIMENSION_MODES.IS_TABLET_LANDSCAPE_MODE
            : DIMENSION_MODES.IS_TABLET_PORTRAIT_MODE
        : DIMENSION_MODES.IS_SMALL_SCREEN_MODE;
};

export const headerLocationParams = (searchedAddressData, isNonUkFlag, selectedPostcode = '', countryID) => {
    let addressData = isValidElement(searchedAddressData) ? { ...searchedAddressData } : null;
    if (isNonUkFlag) {
        delete addressData?.town;
        delete addressData?.postcode;
        if (!isValidString(addressData?.lat) && !isValidString(addressData?.lng)) {
            addressData = null;
        }
    } else {
        delete addressData?.lat;
        delete addressData?.lng;
        if (isValidElement(addressData) && !isValidString(addressData?.postcode) && isValidString(selectedPostcode)) {
            addressData.postcode = nonFormattedPostCode(selectedPostcode);
        }
        if ((isValidString(addressData?.postcode) && !isValidString(addressData.town)) || isValidPostCode(addressData?.town, countryID)) {
            addressData.town = '-';
        } else if (!isValidString(addressData?.town) && !isValidString(addressData?.postcode)) {
            addressData = null;
        }
    }
    return addressData;
};

export const firstLetterUppercase = (string, remainStringSmaller = false) => {
    if (string) {
        if (remainStringSmaller) {
            string = string.toLowerCase();
        }
        return string.replace(/\b\w/g, (l) => l.toUpperCase()) || '';
    } else {
        return '';
    }
};

export const getSideMenuVersionForCurrentDate = () => {
    const currentDate = moment();
    return currentDate.format('Do MMMM');
};

export const getVersionNumber = (isMobileDevice) => {
    if (isMobileDevice && !isWebDevice) {
        return `${VersionNumber?.appVersion ?? ''} - ${VersionNumber?.buildVersion ?? ''} ${CP_VERSION}`;
    }
    if (!isMobileDevice || isWebDevice) {
        return `${FRANCHISE_WEB_VERSION ?? ''}`;
    }
    return '';
};

export const makeFirstLetterUpperCase = (string) => {
    return isValidString(string) ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : string;
};

export const getDeviceDetails = (async () => {
    let deviceDetails = {
        platform: getAppTag(),
        os: await DeviceDetail.getOSName(),
        browser: await DeviceDetail.getBrowserName(),
        device: await DeviceDetail.getDeviceName()
    };
    if (isWebDevice && deviceDetails) {
        deviceDetails.os = `${deviceDetails.os}_${deviceDetails.browser}`;
        deviceDetails.browser = FRANCHISE_WEB_VERSION;
    }
    deviceInformation = deviceDetails;
    return deviceDetails;
})();

export const formatAddonsItem = (addonsItem) => {
    const itemQuantity = getItemQuantityText(addonsItem.quantity);
    const formattedQuantity = isValidElement(addonsItem.quantity) && addonsItem.quantity !== 1 ? `${itemQuantity} ` : '';
    const itemName = isValidElement(addonsItem.name) ? addonsItem.name : '';
    return formattedQuantity + itemName;
};

export const showTakeawayReviewSchema = (path) => {
    if (isWebDevice) {
        let isValidPath = !isValidElement(path) ? window?.location?.pathname : path;
        return (
            isValidPath?.endsWith(schemaRoutes?.MENU) ||
            isValidPath?.endsWith(schemaRoutes?.INFO) ||
            isValidPath?.endsWith(schemaRoutes?.REVIEW)
        );
    } else {
        return null;
    }
};

export const removeSchemaFromHead = (id) => {
    if (isWebDevice) {
        const scriptToRemove = document.getElementById(id);
        if (scriptToRemove) {
            document.head.removeChild(scriptToRemove);
        } else {
            return null;
        }
    }
};
export const getTakeAwaySlugName = (currentRoute, currentResponse) => {
    const slugNameFromRoute = currentRoute?.params?.slug_name;
    const slugNameFromConfig = currentResponse?.setting?.slug_name;

    return isValidElement(slugNameFromRoute) ? slugNameFromRoute : isValidElement(slugNameFromConfig) ? slugNameFromConfig : '';
};

export const isAskRefundDestination = (intialConfig) => {
    return (
        !isCustomerApp() &&
        isFoodHubApp() &&
        (isWebDevice ? isUKTakeaway(intialConfig?.country?.code) && intialConfig?.features?.wallet : true)
    );
};

export const isEmptyObject = (data) => {
    return !data || typeof data !== 'object' || Object.getPrototypeOf(data) !== Object.prototype || Object.keys(data).length === 0;
};

export const formatDateBasedOnCountry = (date, countryId, date_format) => {
    if (isValidString(date)) {
        let dateFormat = DATE_FORMAT.DD_MM_YYYY;
        if (isValidString(date_format?.long_format?.date)) {
            dateFormat = date_format?.long_format?.date;
        } else if (isValidString(countryId)) {
            dateFormat = countryId === T2SConfig.country.US ? DATE_FORMAT.MM_DD_YYYY : DATE_FORMAT.DD_MM_YYYY;
        }
        return moment(date).format(dateFormat);
    }
    return null;
};

export const isNotRestaurant = (businessType) => {
    return businessType?.toLowerCase() === BUSINESS_TYPE.GROCERY || businessType?.toLowerCase() === BUSINESS_TYPE.GIFTS;
};

export const isGroceryType = (businessType) => {
    return businessType?.toLowerCase() === BUSINESS_TYPE.GROCERY?.toLowerCase();
};

export const isBrandedTakeaway = (brand) => {
    return isValidElement(brand);
};
export const isGiftStore = (businessType) => {
    return businessType?.toLowerCase() === BUSINESS_TYPE.GIFTS;
};
export const isRestaurant = (businessType) => {
    return businessType?.toLowerCase() === BUSINESS_TYPE.RESTAURANT;
};
export const soft404Routes = (route) => {
    if (isWebDevice) {
        return (
            route === SCREEN_OPTIONS.MENU_SCREEN.route_name ||
            route === SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name ||
            route === SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name
        );
    } else {
        return false;
    }
};

export const getSeoContentForTakeawayList = (town, selectedCuisine, postcode) => {
    if (isWebDevice) {
        const locationRegex = /^\/location(\/[^/]*)?\/?$/;
        const takeawayFindingRegex = /^\/location\/[^/]+\/[^/]+\/?$/;
        const cuisineRegex = /^\/cuisine(\/[^/]+){0,2}\/?$/;
        const locationPath = `/location/${town}`;
        const cuisinePath = `/cuisine/${selectedCuisine}/${town}`;
        const takeawayFindingPath = `/location/${town}/${postcode}`;
        const seoTown = replaceHyphenWithSpace(town);
        const location = capitalizeFirstLetter(seoTown);
        const seoCuisineName = replaceHyphenWithSpace(selectedCuisine);
        const cuisine = capitalizeFirstLetter(seoCuisineName);
        if (locationRegex.test(locationPath) && isValidElement(location)) {
            return {
                headLine: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LIST_LOCATION_CITY_HEADLINE, location),
                content: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LIST_LOCATION_CITY_CONTENT, location)
            };
        } else if (cuisineRegex.test(cuisinePath) && isValidElement(location) && isValidElement(cuisine)) {
            return {
                headLine: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LIST_CUISINE_LOCATION_HEADLINE, cuisine, location),
                content: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LIST_CUISINE_LOCATION_CONTENT, cuisine, location)
            };
        } else if (takeawayFindingRegex.test(takeawayFindingPath) && isValidElement(location) && isValidElement(postcode)) {
            return {
                headLine: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LISTING_PAGE_HEADLINE, location, postcode),
                content: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_LISTING_PAGE_CONTENT, location, postcode)
            };
        }
    }
};

export const getCategoryNameFromUrl = (category) => {
    if (isWebDevice && isCustomerApp()) {
        if (isValidString(category)) {
            return category;
        } else {
            return window?.location?.pathname?.split?.('/')?.[2];
        }
    }
};

export const getSearchURL = (searchByAddress, lat, lng, postcode, town, addressObj, countryID) => {
    let searchUrl = '';
    if (searchByAddress) {
        searchUrl = `&lat=${lat}&lng=${lng}`;
    } else if (isValidString(postcode)) {
        if (isValidPostCode(postcode, countryID)) {
            searchUrl = `&postcode=${postcode}`;
        } else if (lat && lng) {
            searchUrl = `&lat=${lat}&lng=${lng}`;
        }
    } else if (isValidString(town) && !isValidElement(addressObj)) {
        searchUrl = `&town=${town}`;
    } else if (isValidElement(addressObj)) {
        let addressValue = isValidString(addressObj?.value) ? addressObj.value : addressObj?.description;
        if (isValidString(addressValue)) {
            searchUrl = `&${addressObj?.type}=${addressValue}`;
        }
    } else if (isValidNumber(lat) && isValidNumber(lng)) {
        searchUrl = `&lat=${lat}&lng=${lng}`;
    }
    return searchUrl;
};
export const getAnimationUrl = (key, data) => {
    if (isValidElement(data) && data[key]) {
        return data[key];
    } else {
        const animationData = require('../assets/animationFiles.json');
        return animationData[key];
    }
};

export const fetchAnimationData = async (key, animationData, setDataCallback = null, customUrl = null) => {
    const url = customUrl ? customUrl : await getAnimationUrl(key, animationData);
    try {
        const response = await fetch(url);
        const responseData = await response?.json();
        if (setDataCallback) {
            setDataCallback(responseData);
        }
    } catch (error) {
        if (setDataCallback) {
            setDataCallback(null);
        }
    }
};

export { getWebHost, isLowerEnvironment };

export const formEventData = (props, state) => {
    const { storeConfigResponse: takeawayInfo, timeZone } = props;
    let { firstName, emailId, mobileNo, selectedTime, noOfPersons, formattedSelectedDate } = state;
    const startTime = moment(selectedTime, DATE_FORMAT.hh_mm_a).format(DATE_FORMAT.HH_mm);
    const dateTimeString = formattedSelectedDate + ' ' + startTime;
    const startTimeMomentObj = moment(dateTimeString, DATE_FORMAT.YYYY_MM_DD_H_MM_A).tz(timeZone);
    const endTimeMomentObj = moment(dateTimeString, DATE_FORMAT.YYYY_MM_DD_H_MM_A)
        .add(takeawayInfo?.interval_table_booking, 'minutes')
        .tz(timeZone);
    let event = {
        date: formattedSelectedDate,
        email: emailId,
        phone: getPhoneNoTableBooking(mobileNo, props.countryId, props.countryIso),
        time: selectedTime,
        title: `Reservation at ${takeawayInfo.name}`,
        description: `Hello ${firstName},<br><br>You have a reservation with ${
            takeawayInfo.name
        } and the details are,<br><br>Table for ${noOfPersons} on ${getDateStr(
            formattedSelectedDate,
            DATE_FORMAT.DD_MMM_YYYY
        )} at ${selectedTime} at the ${takeawayInfo.number} ${takeawayInfo.street}, ${takeawayInfo.town}, ${
            takeawayInfo.postcode
        }. If you have any queries about the reservation, please contact us at ${takeawayInfo.phone}<br><br>Thanks!<br><br>Location - ${
            takeawayInfo.number
        } ${takeawayInfo.street}, ${takeawayInfo.town}, ${takeawayInfo.postcode}`,
        location: `${takeawayInfo.number} ${takeawayInfo.street}, ${takeawayInfo.town}, ${takeawayInfo.postcode}`,
        startTime: startTimeMomentObj,
        endTime: endTimeMomentObj,
        people: noOfPersons
    };
    return event;
};

export const getHeaderBackgroundColor = (oldCSS) => {
    const HedEle = oldCSS?.HedEle?.backgroundColor;
    const navEle = oldCSS?.navEle?.backgroundColor;
    if (!isValidString(navEle) || navEle === 'rgba(0, 0, 0, 0)') {
        return !isValidString(HedEle) || HedEle === 'rgba(0, 0, 0, 0)' ? '#ffffff' : HedEle;
    }
    return navEle;
};

export const getNavTextColor = (navColor, oldCSS) => {
    const linkEle = oldCSS?.linkEle?.color;
    if (!isValidString(linkEle) || linkEle === 'rgb(0, 0, 0)') {
        return getTextColorBasedOnBackground(navColor);
    }
    return linkEle;
};

export function shouldShow(key) {
    return !isValidElement(key) || key === true;
}

export function shouldHide(key) {
    return isValidElement(key) && key?.toString() === 'false';
}

export const generateSameAs = (initialConfigWeb) => {
    if (initialConfigWeb) {
        const sameAs = [];
        sameAs.push(`https://${host}/`);
        if (isValidElement(initialConfigWeb?.socialMedia)) {
            Object.values(initialConfigWeb.socialMedia).map((item) => {
                sameAs.push(item);
            });
        }
        return sameAs;
    }
};

export const setCookieTimeout = () => {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 60 * 60 * 12;
    setCookies('APP_BANNER_IGNORED', true, null, new Date(expireTime));
};

//used for timebeing, will get resolved with api change when it comes in s3response?.config
export const getCountryBasedFoodhubStoreID = (countryId, config) => {
    let data,
        key = 'foodhub_store_id';
    let envType = getEnvType(config);
    if (isValidElement(config)) {
        key = envType === ENV_TYPE.QA ? 'sit_foodhub_store_id' : 'foodhub_store_id';
    }
    data = COUNTRY_DATA.data.filter((item) => item.id?.toString() === countryId?.toString());
    if (isArrayNonEmpty(data) && isValidElement(data[0][key])) {
        return data[0][key];
    } else {
        return envType === ENV_TYPE.QA ? DEFAULT_STORE_ID.FOODHUB_SIT : DEFAULT_STORE_ID.FOODHUB_LIVE;
    }
};

export const isDataExpired = (timestamp, duration = 24, type = 'hours') => {
    const now = moment();
    const expiryDuration = duration;
    const expiryDate = moment(timestamp).add(expiryDuration, type);
    return now.isAfter(expiryDate);
};

export const setNoSnippet = (isNoSnippet) => {
    return isWebDevice && isNoSnippet ? { dataSet: { nosnippet: true } } : {};
};

export const constructErrorLogForAddress = (isUserLoggedIn, cartId, customerId, profileResponse) => {
    const customer_id = isUserLoggedIn ? { customer_id: customerId } : {};

    const additionalPayload = {
        phone_no: profileResponse?.phone ?? undefined,
        email: profileResponse?.email ?? undefined,
        order_id: cartId,
        user_type: isUserLoggedIn ? USER_TYPES.LOGGED_IN : USER_TYPES.GUEST,
        ...customer_id
    };

    return additionalPayload;
};

export const isValidArrayOfObjects = (data) => {
    return isValidArray(data) && data?.length > 0 && Object.keys(data[0])?.length > 0;
};

export const getPhoneNumberWithCode = ({ phone_number, phone_code, phone, countryIso }) => {
    let updatedPhoneNo;
    if (isValidString(phone_number) && isValidString(phone_code)) {
        updatedPhoneNo = '+' + phone_code + phone_number;
    } else {
        updatedPhoneNo = getPhoneNumberNormalized(phone, countryIso);
    }
    return updatedPhoneNo;
};

export const resetStackAndNavigateToOrders = ({ cartID, storeID, isUserLoggedIn }) => {
    const orderStatusRoute = {
        name: SCREEN_OPTIONS.ORDER_TRACKING.route_name,
        params: {
            orderId: cartID,
            storeID: storeID,
            analyticsObj: {
                order_id: cartID,
                store_id: storeID
            }
        }
    };

    const orderHistoryParams = {
        orderId: cartID,
        storeID: storeID
    };

    const tabRoutes = isUserLoggedIn
        ? [
              {
                  name: SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name,
                  params: {
                      screen: SCREEN_OPTIONS.ORDER_HISTORY.route_name,
                      params: orderHistoryParams
                  }
              },
              orderStatusRoute
          ]
        : [orderStatusRoute];

    const landscapeRoutes = isUserLoggedIn
        ? [
              {
                  name: SCREEN_OPTIONS.ORDER_HISTORY.route_name,
                  params: orderHistoryParams
              },
              orderStatusRoute
          ]
        : [orderStatusRoute];
    try {
        if (isLandscapeDevice) {
            navigateReset(landscapeRoutes.length - 1, landscapeRoutes);
        } else {
            navigateReset(tabRoutes.length - 1, tabRoutes);
        }
    } catch (e) {
        //For potrait device with tab navigation
        navigateReset(tabRoutes.length - 1, tabRoutes);
    }
};

export const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomDigits = Math.floor(Math.random() * 10000000000);
    const uniqueKey = (timestamp % 1000000000) * 10 + randomDigits;
    return Number(uniqueKey.toString().slice(0, 9));
};

export function getOrderDisplayOptions(groupOrderStoreId, UIPeorderSlot, country, shouldShowStoreIndicator = false) {
    const isGroupOrder = Boolean(groupOrderStoreId);
    const isUIPreorder = Boolean(UIPeorderSlot);
    const isUSA = isUSApp(country);

    let options;

    if (!isUSA) {
        switch (`${isGroupOrder}_${isUIPreorder}`) {
            case 'false_false':
                options = { orderTypeShowText: true, scheduleShowText: false, groupShowText: true };
                break;
            case 'true_false':
                options = { orderTypeShowText: true, scheduleShowText: false, groupShowText: true };
                break;
            case 'false_true':
                options = { orderTypeShowText: true, scheduleShowText: true, groupShowText: false };
                break;
            case 'true_true':
                options = { orderTypeShowText: false, scheduleShowText: true, groupShowText: true };
                break;
            default:
                throw new Error(`Unhandled UK case for groupOrderStoreId: ${groupOrderStoreId}, UIPeorderSlot: ${UIPeorderSlot}`);
        }
    } else {
        switch (`${isGroupOrder}_${isUIPreorder}`) {
            case 'false_false':
                options = { orderTypeShowText: true, scheduleShowText: true, groupShowText: false };
                break;
            case 'true_false':
                options = { orderTypeShowText: true, scheduleShowText: false, groupShowText: true };
                break;
            case 'false_true':
                options = { orderTypeShowText: true, scheduleShowText: true, groupShowText: false };
                break;
            case 'true_true':
                options = { orderTypeShowText: false, scheduleShowText: true, groupShowText: true };
                break;
            default:
                throw new Error(`Unhandled USA case for groupOrderStoreId: ${groupOrderStoreId}, UIPeorderSlot: ${UIPeorderSlot}`);
        }
    }

    // Apply override if shouldShowStoreIndicator is true
    if (shouldShowStoreIndicator) {
        options.scheduleShowText = true;
        options.groupShowText = true;
    }

    return options;
}
