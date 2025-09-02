import { FONT_FAMILY, MESSAGE_ICON, NETWORK_CONSTANTS } from '../Utils/Constants';
import { Colors } from '../Themes';
import { StyleSheet } from 'react-native';
import { getDeviceInfo, isArrayNonEmpty, isCustomerApp, isValidElement, isValidString } from '../Utils/helpers';
import { logError } from 'appmodules/AnalyticsModule/Analytics';
import React from 'react';
import T2SIcon from '../UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { showMessage } from '../UI/CustomUI/FlashMessageComponent';
import { ANALYTICS_EVENTS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import SessionSkipError from './SessionManager/Network/SessionSkipError';
import { store } from '../../CustomerApp/Redux/Store/ConfigureStore';
import { APIErrorMessages } from 'appmodules/LocalizationModule/Utils/APIErrorMessages';
import * as _ from '../../CustomerApp/Utils/LodashUtils';
import { setFont } from '../Utils/ResponsiveFont';
import { getUserName } from 'appmodules/BaseModule/Helper';
import { GRAPH_QL_QUERY } from 'appmodules/BaseModule/GlobalAppConstants';
import { BASE_API_CONFIG } from './ApiConfig';
import { CP_VERSION } from '../../CustomerApp/Utils/AppConfig';
import { isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
import { FH_LOG_WEB } from '../../AppModules/FHLogsModule/Utils/FhLogsConstants';
import { getFliteredErrMsg } from '../../AppModules/ErrorModule/Utils/ErrorModuleHelpers';
import { GENERIC_ERROR_MESSAGES, getLocalisedMsg } from '../../AppModules/ErrorModule/Utils/ErrorModuleConstants';
import { sendFhErrorLog } from '../../AppModules/ErrorModule/Redux/ErrorAction';

const isDeviceWeb = isWeb();
let lastMessageTime = 0;
let lastErrorMessage = '';

const webPosition = isDeviceWeb
    ? {
          position: 'fixed',
          topPosition: 0
      }
    : {};

const showErrorMessage = (
    error,
    flashMessageComponent,
    color = undefined,
    description = '',
    topPosition = 30,
    showToast = false,
    duration = 2000
) => {
    if (!__DEV__ && (!isValidElement(error) || error instanceof SessionSkipError)) {
        // Reach here If isAuthRequired is true but user is not logged in
        // throws exception in dev mode
        return;
    }
    let message = '';
    let backgroundColor = Colors.grey;
    let borderColor = null;
    let icon = MESSAGE_ICON.INFO;
    let iconColor = null;
    if (isValidElement(error)) {
        lastErrorMessage = error.type;
        if (isValidElement(error.type) && error.type === NETWORK_CONSTANTS.NETWORK_ERROR) {
            message = LOCALIZATION_STRINGS.GENERIC_ERROR_MSG;
            backgroundColor = Colors.errorRedLight;
            borderColor = Colors.red;
            icon = MESSAGE_ICON.DANGER;
            iconColor = Colors.red;
        } else if (isValidElement(error.type) && error.type === NETWORK_CONSTANTS.API_ERROR) {
            message = getFliteredErrMsg(error);
            backgroundColor = Colors.warningYellowLight;
            borderColor = Colors.yellow;
            iconColor = Colors.yellow;
        } else {
            message = isArrayNonEmpty(error) ? error : getFliteredErrMsg(error);
            if (color) {
                backgroundColor = Colors.errorRedLight;
                borderColor = Colors.red;
                iconColor = Colors.red;
            } else {
                backgroundColor = Colors.warningYellowLight;
                borderColor = Colors.yellow;
                iconColor = Colors.yellow;
            }
        }
        if (
            (isValidElement(error?.code) && error?.code >= 500 && error.code < 599) ||
            (isValidElement(error?.status) && error?.status >= 500 && error.status < 599)
        ) {
            error.message = message;
            error.sendOriginalError = true;
            store?.dispatch(sendFhErrorLog(error));
        }
    }
    message = GENERIC_ERROR_MESSAGES.includes(message) && !showToast ? null : LOCALIZATION_STRINGS[getLocalisedMsg?.[message]] ?? message;
    if (isValidString(message)) {
        let flashMessageObject = {
            message: convertMessageToAppLanguage(message),
            backgroundColor: backgroundColor,
            color: Colors.defaultBlack,
            duration: duration,
            position: 'top',
            titleStyle: styles.welcomeTextStyle,
            borderColor,
            icon: {
                icon: icon,
                style: { color: iconColor }
            },
            textColor: Colors.defaultBlack,
            description,
            containerStyle: {
                marginHorizontal: 10,
                ...webPosition
            },
            style: {
                marginLeft: 0,
                marginRight: 0,
                top: topPosition
            }
        };
        let currentTime = new Date().getTime();
        if (currentTime - lastMessageTime > 4000 || (isValidElement(error.type) && error.type !== lastErrorMessage) || showToast) {
            lastMessageTime = new Date().getTime();
            if (isValidElement(flashMessageComponent)) {
                flashMessageComponent.showMessage(flashMessageObject);
            } else {
                showMessage(flashMessageObject);
            }
        }
    } else {
        console.warn(error);
        // @TODO: Send New FE API Logs
    }
};

const showPaymentErrorMessage = (error) => {
    //TODO this needs to be pass as object. Since it required to change in many places we can go with existing approach
    showErrorMessage(error, undefined, undefined, undefined, undefined, true, undefined);
};
const showInfoMessage = (message, flashMessageComponent, toast = false, description = '', duration = 2000) => {
    if (!__DEV__ && (!isValidElement(message) || message instanceof SessionSkipError)) {
        // Reach here If isAuthRequired is true but user is not logged in
        // throws exception in dev mode
        return;
    }
    let flashMessageObject = {
        message: convertMessageToAppLanguage(message),
        backgroundColor: Colors.successGreenLight,
        color: Colors.defaultBlack,
        duration: duration,
        position: 'top',
        titleStyle: styles.welcomeTextStyle,
        borderColor: Colors.successGreen,
        icon: {
            icon: !toast ? MESSAGE_ICON.SUCCESS : MESSAGE_ICON.WARNING,
            style: { color: Colors.successGreen }
        },
        containerStyle: {
            marginHorizontal: 10,
            ...webPosition
        },
        style: {
            marginLeft: 0,
            marginRight: 0,
            top: 20
        }
    };
    if (isValidElement(flashMessageComponent)) {
        flashMessageComponent.showMessage(flashMessageObject);
    } else {
        showMessage(flashMessageObject);
    }
};

export const replaceTimeFormatInAPIMessage = (message) => {
    if (!isValidElement(message)) return;
    const replaceRegex = /([0][1-9]):[0-5][0-9] [AP]M/g;
    //Handled cancel order crash issue (here we got message as a boolean)
    const found = typeof message === 'string' && message.match(replaceRegex);
    if (!isValidElement(found)) return message;
    var replaceMessageText = message;
    for (var i = 0; i < found.length; i++) {
        replaceMessageText = replaceMessageText.replace(found[i], found[i].slice(1, found[i].length));
    }
    return replaceMessageText;
};

export const checkIsWalletToCardRefundMessage = (message) => {
    let clickHereString = 'Click here';
    let clickingHereString = 'clicking here';
    let clickHereRegex = new RegExp(`${clickHereString}$`, 'i');
    let clickingHereRegex = new RegExp(`${clickingHereString}$`, 'i');
    return clickingHereRegex.test(message) || clickHereRegex.test(message);
};

export const convertMessageToAppLanguage = (message, languageKey = undefined, convertString = true) => {
    if (!isValidString(message)) return;
    let replaceMessage = replaceTimeFormatInAPIMessage(message);
    const isWalletToCardRefundMessage = checkIsWalletToCardRefundMessage(replaceMessage);
    if (isValidString(replaceMessage) && isWalletToCardRefundMessage) {
        ///to remove later
        let variablePart = 'Your refund of';
        let replaceRegex = new RegExp(`${variablePart}.*$`, 'i');
        replaceMessage = replaceMessage.replace(replaceRegex, '');
    }
    if (!isValidString(replaceMessage)) return;
    let language = '';
    const storeState = store?.getState();
    if (!isValidElement(languageKey) && isValidElement(storeState?.appState?.language?.code)) {
        language = storeState.appState.language.code;
    } else {
        language = languageKey;
    }
    let convertedMessage = '';
    if (language === 'es' && convertString) {
        let obj = _.filter(APIErrorMessages(), function (o) {
            return o.key.toLowerCase() === replaceMessage.toLowerCase() || replaceMessage.toLowerCase().includes(o.key.toLowerCase());
        });
        if (isValidElement(obj) && obj.length > 0) {
            if (obj.length === 1) {
                convertedMessage = replaceMessage.toLowerCase().replace(obj[0].key.toLowerCase(), obj[0].value_es);
            } else {
                convertedMessage = replaceMessage;
                obj.map((item) => {
                    convertedMessage = convertedMessage.toLowerCase().replace(item.key.toLowerCase(), item.value_es);
                });
            }
        }
    }
    if (isValidString(convertedMessage)) {
        return convertedMessage;
    } else {
        return replaceMessage;
    }
};
const styles = StyleSheet.create({
    welcomeTextStyle: {
        fontFamily: FONT_FAMILY.BOLD,
        fontSize: setFont(14),
        textAlign: 'left',
        textAlignVertical: 'center',
        color: Colors.defaultBlack
    }
});
const logAPIErrorEvent = (error) => {
    logError(ANALYTICS_EVENTS.API_ERROR, error);
};
export { showErrorMessage, showInfoMessage, logAPIErrorEvent, showPaymentErrorMessage };

export const parseAPIEndPoint = (url) => {
    return 'E + ' + url;
};

/*
    This method returns true, only for requests which need Access token
 */
export const renderFlashMessageIcon = (icon = 'success', style = {}, customProps = {}) => {
    const flashIconStyle = {
        color: Colors.white,
        margin: -5
    };
    switch (icon) {
        case 'success':
            return <T2SIcon name={FONT_ICON.NOTIFY_SUCCESS} size={30} style={[flashIconStyle, style]} />;
        case 'info':
            return <T2SIcon name={FONT_ICON.INFO_ICON_FILLED} size={30} style={[flashIconStyle, style]} />;
        case 'warning':
            return <T2SIcon name={FONT_ICON.SHEILD} size={30} style={[flashIconStyle, style]} />;
        case 'danger':
            return <T2SIcon name={FONT_ICON.SHEILD} size={30} style={[flashIconStyle, style]} />;
        default:
            return null;
    }
};

export const constructErrorObject = (data) => {
    let obj = {};
    if (isValidElement(data)) {
        try {
            let { error, networkConfig, profile, store_id } = data;
            obj.message = error?.message;
            obj.type = error?.type;
            obj.status_code = error?.status;
            if (isValidString(store_id)) obj.store_id = store_id;
            if (isValidElement(networkConfig)) {
                let { method, url, config, data } = networkConfig;
                obj.url = url;
                obj.method = method;
                obj.body = data;
                if (isValidElement(config?.headers)) obj.requestHeader = config.headers;
                if (isValidString(config?.data)) obj.data = config.data;
            }
            if (isValidElement(profile)) {
                obj.phone = profile.phone;
                obj.customerId = profile.id;
                obj.name = getUserName(profile);
            }
        } catch (e) {
            //
        }
    }

    return obj;
};

export const getGraphQlQuery = (type, errorObject, errorCode, errorSource = 'APP') => {
    if (isValidString(type)) {
        let info = getDeviceInfo();
        const storeState = store?.getState();
        const clientType = storeState?.appState?.initialConfigWeb?.franchise?.clientType;
        if (isValidString(CP_VERSION)) info.cp_version = CP_VERSION;
        const product = isDeviceWeb
            ? (isCustomerApp() ? BASE_API_CONFIG.applicationName : clientType) + FH_LOG_WEB.WEB
            : BASE_API_CONFIG.applicationName;
        return {
            query: GRAPH_QL_QUERY,
            variables: {
                input: {
                    actionType: type,
                    customerId: errorObject?.customerId,
                    deviceInfo: JSON.stringify(info),
                    errorCode: errorCode,
                    errorObject: `${JSON.stringify(errorObject)}`,
                    errorSource: errorSource,
                    product: product,
                    token: ''
                }
            }
        };
    } else {
        return null;
    }
};
