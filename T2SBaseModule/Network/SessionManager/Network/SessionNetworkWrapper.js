import { call, put, putResolve, select, fork, delay, cancelled } from 'redux-saga/effects';
import {
    getFranchiseIdBasedOnURL,
    isCustomerApp,
    isFoodHubApp,
    isValidElement,
    isValidNumber,
    isValidString,
    getDeviceInfo,
    isNonCustomerApp
} from '../../../Utils/helpers';
import API, { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from './SessionConst';
import {
    selectEnvConfig,
    selectLanguage,
    selectLocale,
    selectRegion,
    selectS3Response,
    selectStoreId,
    selectSwitchLocale
} from '../../../Utils/AppSelectors';
import * as _ from '../../../../CustomerApp/Utils/LodashUtils';
import {
    getAccessTokenWithTokenType,
    getConfiguration,
    selectRefreshToken,
    selectUserAccessToken,
    selectUserAccessTokenExpires
} from '../Utils/SessionManagerSelectors';
import { addTimeDeviceMoment } from '../../../Utils/DateUtil';
import { ERROR_CODE, SESSION_EXPIRE_BEFORE_CHECK } from '../Utils/SessionManagerConstants';
import { getFranchiseId, getPassport, getStoreId } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import { SessionManagerNetwork } from './SessionManagerNetwork';
import { extractSessionInfo, getFHLanguage, getJWTDeviceDetail } from '../Utils/SessionManagerHelper';
import { Constants, NETWORK_CONSTANTS } from '../../../Utils/Constants';
import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';
import { TYPES_CONFIG } from '../../../../CustomerApp/Redux/Actions/Types';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { constructErrorObject, getGraphQlQuery } from '../../NetworkHelpers';
import SessionSkipError from './SessionSkipError';
import { SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import * as Braze from '../../../../AppModules/AnalyticsModule/Braze';
import { selectProfileResponseState } from 'appmodules/ProfileModule/Redux/ProfileSelectors';
import { makeFHLogApiCall } from 'appmodules/FHLogsModule/Redux/FhLogsSaga';
import { FH_LOG_ERROR_CODE, FH_LOG_TYPE } from 'appmodules/FHLogsModule/Utils/FhLogsConstants';
import { getDeviceUniqueId } from '../../../../CustomerApp/Saga/AppSaga';
import { getWebHost, isWeb } from '../../../../AppModules/BaseModule/GlobalAppHelper';
import { AppConfig, CP_VERSION } from '../../../../CustomerApp/Utils/AppConfig';
import { getuserProfileDetails } from '../Redux/SessionManagerSaga';
import { selectSelectedEventId, selectSelectedEventOrderFlow } from '../../../../AppModules/EventOrder/Redux/EventOrderSelector';
import { isEventOrderFlow } from '../../../../AppModules/EventOrder/Utils/EventOrderHelper';
import { selectBasketID, selectGroupOrdering } from '../../../../AppModules/BasketModule/Redux/BasketSelectors';
import { navigationRef } from '../../../../CustomerApp/Navigation/NavigationService';
import { initiateNonUserErrMsg } from '../../../../AppModules/ErrorModule/Redux/ErrorAction';
import { routesToKeepAfterLogout } from '../../../../AppModules/RouterModule/Utils/Constants';

let isWebDevice = isWeb();
let isRefreshTokenUpdating = false;
let sessionDataIfSagaCancelled = null; // sets the value when session data is cancelled

function* clearSessionAndLogout(errorMessageToUser = true) {
    const accessToken = yield select(getAccessTokenWithTokenType);
    yield putResolve({ type: AUTH_TYPE.INITIATE_LOGOUT_ACTION, fromSessionTimeout: true, accessToken });
    Braze.logLogoutAnalytics(SEGMENT_STRINGS.API);
    const action = {
        message: LOCALIZATION_STRINGS.INVALID_SESSION_MSG,
        priority: 'HIGH'
    };
    yield put(initiateNonUserErrMsg(action));
    if (!routesToKeepAfterLogout.includes(navigationRef?.current?.getCurrentRoute()?.name)) {
        handleNavigation(isWebDevice ? SCREEN_OPTIONS.HOME_SCREEN.route_name : SCREEN_OPTIONS.HOME.route_name);
    }
    errorMessageToUser && console.warn(LOCALIZATION_STRINGS.INVALID_SESSION_MSG);
    // @TODO: Send New FE API Logs
}

function isSessionFailed(result) {
    return (
        isValidElement(result?.response?.data?.error.code) &&
        (result.response.data.error.code === ERROR_CODE.UNAUTHORIZED_ACCESS ||
            result.response.data.error.code === ERROR_CODE.UNAUTHORIZED_CLIENT ||
            result.response.data.error.code === ERROR_CODE.CUSTOMER_NOT_REGISTERED ||
            result.response.data.error.code === ERROR_CODE.REQUEST_PARAM_MISSING)
    );
}

/**
 * @returns session data on success, throw exception on failure
 */
function* fetchPrivateAccessToken() {
    const accessToken = yield select(getAccessTokenWithTokenType);
    const refreshToken = yield select(selectRefreshToken);
    let result = null;
    try {
        result = yield SessionManagerNetwork.resetRefreshToken({
            refresh_token: refreshToken,
            userAccessToken: accessToken //  we need to send last known access token
        });
        if (isValidElement(result?.outcome) && result?.outcome === Constants.SUCCESS) {
            yield putResolve({
                type: SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS,
                payload: result.data
            });
            return extractSessionInfo(result?.data);
        }
        throw result;
    } catch (e) {
        if (isBannedCustomer(e?.response?.data?.error)) {
            yield* clearSessionAndLogout(false);
            // showErrorMessage(e?.message);
        } else if (isSessionFailed(e)) {
            yield* clearSessionAndLogout();
        }

        throw e;
    } finally {
        if (yield cancelled()) {
            // on certain case if saga is cancelled it ensure to save token
            // If token is lost, it cannot be retrieved, so this is important
            if (isValidElement(result?.outcome) && result?.outcome === Constants.SUCCESS) {
                sessionDataIfSagaCancelled = result.data;
                // We cannot call put here as saga is already cancelled
            }
        }
    }
}

/**
 * @returns session data on success, throw exception on failure
 */
function* fetchPublicAccessToken() {
    try {
        let deviceUniqueID = yield getDeviceUniqueId();
        const deviceDetails = getJWTDeviceDetail(deviceUniqueID);
        const result = yield call(SessionManagerNetwork.registerPublicSession, deviceDetails);
        if (isValidElement(result?.outcome) && result?.outcome === Constants.SUCCESS) {
            yield putResolve({
                type: SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS,
                payload: result.data
            });
            return extractSessionInfo(result.data);
        } else {
            throw result;
        }
    } catch (e) {
        if (isBannedCustomer(e?.response?.data?.error)) {
            yield* clearSessionAndLogout(false);
            yield put(initiateNonUserErrMsg(e?.message));
        } else if (isSessionFailed(e)) {
            yield* clearSessionAndLogout();
        }
        throw e;
    }
}

/**
 * Returns valid access token from state, else null
 */
function* getValidAccessTokenFromLocal(networkConfig) {
    if (isValidElement(sessionDataIfSagaCancelled)) {
        // Handles a edge case to return access token if saga was cancelled
        yield putResolve({
            type: SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS,
            payload: sessionDataIfSagaCancelled
        });
        const sessionData = extractSessionInfo(sessionDataIfSagaCancelled);
        sessionDataIfSagaCancelled = null;
        return sessionData?.access_token;
    }

    let userAccessToken = yield select(selectUserAccessToken);
    if (isWebDevice && !isValidString(userAccessToken)) {
        // Migrating token from 3.0 to 4.0
        const token = yield call(getuserProfileDetails);
        userAccessToken = token?.access_token;
    }
    const userAccessTokenExpires = yield select(selectUserAccessTokenExpires);
    const isAccessTokenExpire = isAccessTokenExpired(userAccessToken, userAccessTokenExpires);
    if (isAccessTokenExpire || userAccessToken?.length < 10) {
        return null;
    }
    const isPrivateAPICanBeExecuted = yield* checkIfPrivateAPICanBeExecuted(networkConfig);
    if (!isPrivateAPICanBeExecuted) {
        const payload = {
            sendOriginalError: true,
            apiError: 'Error from getValidAccessTokenFromLocal',
            networkConfig: networkConfig,
            message: Constants.SESSION_SKIPPED
        };
        yield put(initiateNonUserErrMsg(payload));
        throw new SessionSkipError(Constants.SESSION_SKIPPED);
    }
    return userAccessToken;
}

function* checkIfPrivateAPICanBeExecuted(networkConfig) {
    const refreshToken = yield select(selectRefreshToken);
    if (networkConfig?.isAuthRequired === true && !isValidString(refreshToken)) {
        return false;
    }
    return true;
}

/**
 * Returns access token from server, throws exception if any and returns null if could not find the token
 * @param {}
 */
function* getAccessTokenFromServer(networkConfig) {
    let sessionInfo = null;
    const isPrivateAPICanBeExecuted = yield* checkIfPrivateAPICanBeExecuted(networkConfig);
    if (!isPrivateAPICanBeExecuted) {
        const payload = {
            sendOriginalError: true,
            apiError: 'Error from getAccessTokenFromServer',
            networkConfig: networkConfig,
            message: Constants.SESSION_SKIPPED
        };
        yield put(initiateNonUserErrMsg(payload));
        throw new SessionSkipError(Constants.SESSION_SKIPPED);
    }
    // We need to handle a race condition here, if refresh token is not expired then lets not hit it
    if (!isRefreshTokenUpdating) {
        isRefreshTokenUpdating = true;
        try {
            yield putResolve({
                type: SESSION_MANAGER_TYPES.UPDATE_REFRESH_TOKEN_STATUS,
                payload: true
            });
            const refreshToken = yield select(selectRefreshToken);

            if (isValidString(refreshToken)) {
                sessionInfo = yield* fetchPrivateAccessToken();
            } else {
                sessionInfo = yield* fetchPublicAccessToken();
            }
            isRefreshTokenUpdating = false;
        } catch (e) {
            isRefreshTokenUpdating = false;
            throw e;
        } finally {
            if (yield cancelled()) {
                isRefreshTokenUpdating = false;
            }
        }
    } else {
        yield* blockExecutionUntilRefreshIsSet();
        sessionInfo = yield getValidAccessTokenFromLocal(networkConfig);
    }

    return sessionInfo;
}

function* blockExecutionUntilRefreshIsSet() {
    if (isRefreshTokenUpdating) {
        while (isRefreshTokenUpdating) {
            yield delay(50);
        }
    }
}

export const apiCall = (apiCallFuc, ...args) => {
    return call(function* () {
        let networkConfig = yield call(apiCallFuc, ...args);
        if (!isValidElement(networkConfig) || !isValidElement(networkConfig.config)) {
            networkConfig = {
                ...networkConfig,
                config: {
                    headers: {}
                }
            };
        }

        if (includeCommonAccessToken(networkConfig)) {
            let sessionData = yield getValidAccessTokenFromLocal(networkConfig);

            if (!isValidElement(sessionData)) {
                sessionData = yield call(getAccessTokenFromServer, networkConfig);
                if (sessionData === null) {
                    const payload = {
                        sendOriginalError: true,
                        apiError: 'Error from apiCall',
                        networkConfig: networkConfig,
                        message: Constants.SESSION_SKIPPED
                    };
                    yield put(initiateNonUserErrMsg(payload));
                    throw new SessionSkipError(Constants.SESSION_SKIPPED);
                }
            }
        }

        let result = yield* handleAPICall(networkConfig);
        return result;
    });
};

function isUnAuthorizedAccess(result) {
    return isValidElement(result.response?.data?.error?.code) && result.response?.data?.error?.code === ERROR_CODE.UNAUTHORIZED_ACCESS;
}
function* handleAPICall(networkConfig, isFirstRun = true) {
    networkConfig.config.headers = yield call(addToRequest, networkConfig);
    try {
        let result = yield call(callNetwork, networkConfig);
        if (isFirstRun && includeCommonAccessToken(networkConfig) && isSessionFailed(result)) {
            if (isUnAuthorizedAccess(result)) {
                const sessionInfo = yield getAccessTokenFromServer(networkConfig);
                if (isValidElement(sessionInfo)) {
                    result = yield* handleAPICall(networkConfig, false);
                    return result;
                } else {
                    const payload = {
                        sendOriginalError: true,
                        apiError: 'Error from handleAPICall',
                        networkConfig: networkConfig,
                        message: Constants.SESSION_SKIPPED
                    };
                    yield put(initiateNonUserErrMsg(payload));
                    throw new SessionSkipError(Constants.SESSION_SKIPPED);
                }
            } else {
                yield* clearSessionAndLogout();
            }
            return null;
        }
        return result;
    } catch (e) {
        if (e?.type !== NETWORK_CONSTANTS.NETWORK_ERROR) {
            yield handleAPIFailureCall(e, networkConfig);
            if (isBannedCustomer(e)) {
                yield* clearSessionAndLogout(false);
                yield put(initiateNonUserErrMsg(e?.message));
            }
        }
        throw e;
    }
}

function isBannedCustomer(error) {
    return (
        isValidElement(error?.type) &&
        isValidElement(error?.code) &&
        error?.type === NETWORK_CONSTANTS.API_ERROR &&
        error?.code === ERROR_CODE.BANNED_CUSTOMER
    );
}

function* handleAPIFailureCall(error, networkConfig) {
    try {
        const profileResponse = yield select(selectProfileResponseState);
        const storeID = yield select(selectStoreId);
        const config = yield select(getConfiguration);
        const store_id = isValidElement(storeID) ? storeID : getStoreId(config);
        let errorObj = constructErrorObject({
            error: error,
            networkConfig: networkConfig,
            profile: profileResponse,
            store_id: store_id
        });
        // Log this object in moegnage

        if (networkConfig?.ignoreLog !== true) {
            const graphqlQuery = getGraphQlQuery(FH_LOG_TYPE.API_FAILURE, errorObj, FH_LOG_ERROR_CODE.API_FAILURE_ERROR_CODE);
            yield fork(makeFHLogApiCall, { graphqlQuery: graphqlQuery });
        }
    } catch (e) {
        //
    }
}

export function callNetwork(action) {
    if (isValidElement(action?.method)) {
        switch (action.method) {
            case NETWORK_METHOD.GET: {
                return API.get(action.url, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.POST: {
                return API.post(action.url, isValidElement(action.data) && action.data, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.PUT: {
                return API.put(action.url, isValidElement(action.data) && action.data, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.PATCH: {
                return API.patch(action.url, isValidElement(action.data) && action.data, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.DELETE: {
                return API.delete(action.url, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.HEAD: {
                return API.head(action.url, isValidElement(action.config) && action.config);
            }
        }
    }
}

const excludeCommonStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 't2s-android.s3.amazonaws.com') &&
            !_.includes(url, 's3.eu-west-2.amazonaws.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 'location/initial') &&
            !_.includes(url, 'franchise/v2/takeaway/list') &&
            !_.includes(url, 'lang/') &&
            !_.includes(url, 'order/detail') &&
            !_.includes(url, 'loyalty_transactions') &&
            !_.includes(url, 'loyalty_points_new/lookup')
        );
    }
    return true;
};

const excludeCommonLocale = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 't2s-android.s3.amazonaws.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 's3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com') &&
            !_.includes(url, 'lang/') &&
            isLocaleNeeded(networkConfig)
        );
    }
    return true;
};

const isLocaleNeeded = (networkConfig) => {
    if (networkConfig.url.includes('location/initial')) {
        return networkConfig.params.isManualSwitch === true;
    }
    return networkConfig?.isLocaleNeeded !== false;
};

const isLocaleNeededForManualSwitch = (networkConfig) => {
    return networkConfig.url.includes('location/initial') && networkConfig.params.isManualSwitch === true;
};

const includeCommonAccessToken = (networkConfig) => {
    if (networkConfig.isAccessTokenRequired === false) {
        return false;
    }
    return true;
};

const excludeFoodHubStoreID = (networkConfig) => {
    if (networkConfig.excludeStoreId) {
        return false;
    }
    // TODO: need to remove all below condition and use excludeStoreId in network call
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 'location/initial') &&
            !_.includes(url, 'consumer/lookup/consent') &&
            !_.includes(url, 'consumer/user/consent/bulk') &&
            !_.includes(url, 'consumer/user/lookup/coupon') &&
            !_.includes(url, 'consumer/account/otp') &&
            !_.includes(url, 'consumer/profile') &&
            !_.includes(url, 'consumer/social/login') &&
            !_.includes(url, 'consumer/stores/favourites') &&
            !_.includes(url, 'consumer/wishlist') &&
            !_.includes(url, 'consumer/menu/recent/order') &&
            !_.includes(url, 'foodhub/takeaway/list') &&
            !_.includes(url, 'consumer/customer_device_registration') &&
            !_.includes(url, 'consumer/orders/total_savings') &&
            !_.includes(url, 'consumer/recent/takeaway') &&
            !_.includes(url, '/consumer/customer_notify_log') &&
            !_.includes(url, 'consumer/lookup/promotion') &&
            !_.includes(url, 'lang/') &&
            !_.includes(url, 'location/autocomplete') &&
            !_.includes(url, `lookup/product/${BASE_PRODUCT_CONFIG.product_id}/platform/`) &&
            !_.includes(url, `lookup/product/${BASE_PRODUCT_CONFIG.product_id}/policy`) &&
            !_.includes(url, 'location/lookup') &&
            !_.includes(url, 'order/detail') &&
            !_.includes(url, '/consumer/v2/register') &&
            !_.includes(url, '/consumer/v3/register') &&
            !isViewOrderListCall(networkConfig) &&
            !isDeleteCartApiCall(networkConfig) &&
            excludeCommonStoreID(networkConfig)
        );
    }
    return true;
};

const isViewOrderListCall = (networkConfig) => {
    if (isValidElement(networkConfig) && isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (_.includes(url, '/consumer/orders?') || _.includes(url, '/receipt?')) && networkConfig.method === NETWORK_METHOD.GET;
    }
    return false;
};

const isDeleteCartApiCall = (networkConfig) => {
    if (isValidElement(networkConfig) && isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return _.includes(url, 'consumer/cart') && networkConfig.method === NETWORK_METHOD.DELETE;
    }
    return false;
};

const excludeCustomerAppStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 's3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 'lang/') &&
            !_.includes(url, 'api/list_takeaway_tracking')
        );
    }
    return true;
};

//For sending Store ID instead of host for specific endponits
const sendCustomerStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            _.includes(url, '/consumer/takeaway/rating') ||
            _.includes(url, '/consumer/store/lookup/preorderdate') ||
            _.includes(url, '/consumer/preorderevent') ||
            _.includes(url, '/cart/group')
        );
    }
    return true;
};

function* addStoreIDToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let storeID = '';
    if (isValidElement(requestHeaders)) {
        storeID = isValidString(requestHeaders.store) || isValidNumber(requestHeaders.store) ? requestHeaders.store : undefined;
    } else {
        requestHeaders = {};
    }
    const config = yield select(getConfiguration);
    if (isValidElement(config) && !isValidString(storeID)) {
        storeID = isValidString(getStoreId(config)) || isValidNumber(getStoreId(config)) ? getStoreId(config) : undefined;
    }
    if (isCustomerApp() && isWebDevice) {
        return {
            ...requestHeaders,
            store: sendCustomerStoreID(networkConfig) ? storeID : getWebHost()
        };
    } else if (isCustomerApp() && (isValidString(storeID) || isValidNumber(storeID)) && excludeCustomerAppStoreID(networkConfig)) {
        return {
            ...requestHeaders,
            store: storeID
        };
    } else if (isNonCustomerApp()) {
        const configurationData = yield select(getConfiguration);
        let franchiseID = getFranchiseId(configurationData);
        let requestHeader = { ...requestHeaders, franchise: franchiseID };
        if ((isValidString(storeID) || isValidNumber(storeID)) && excludeFoodHubStoreID(networkConfig)) {
            requestHeader = {
                ...requestHeaders,
                franchise: franchiseID,
                store: storeID
            };
        }
        return {
            ...requestHeader,
            franchise: franchiseID
        };
    }
    return requestHeaders;
}

function* addToRequest(networkConfig) {
    networkConfig.config.headers = yield call(addStoreIDToRequest, networkConfig);
    networkConfig.config.headers = yield call(addLocaleToRequest, networkConfig);
    networkConfig.config.headers = yield call(addLanguageToRequest, networkConfig);
    // if (!isWebDevice) {
    networkConfig.config.headers = yield call(addLogDataToRequest, networkConfig);
    // }
    const groupOrdering = yield select(selectGroupOrdering);
    const eventOrderEnabled = yield select(selectSelectedEventOrderFlow);
    if (isFoodHubApp()) {
        networkConfig.config.headers = yield call(addFranchiseToRequestHeader, networkConfig);
    }

    if (isCustomerApp()) {
        networkConfig.config.headers = yield call(addRegionToRequest, networkConfig);
        if (isEventOrderFlow(eventOrderEnabled)) {
            networkConfig.config.headers = yield call(addEventOrderIDToRequest, networkConfig, eventOrderEnabled);
        }
    } else {
        networkConfig.config.headers = yield call(addFranchiseToRequest, networkConfig);
    }
    if (groupOrdering) {
        networkConfig.config.headers = yield call(addGroupOrderIDToRequest, networkConfig);
    }
    networkConfig.config.headers = yield call(addJWTToRequest, networkConfig);

    let newParams = {};
    if (networkConfig.config?.params) {
        newParams = { ...networkConfig.config.params };
    }
    const sessionId = yield select((state) => state.appState.userSessionId);
    newParams.sid = sessionId;
    networkConfig.config.params = newParams;

    return networkConfig.config.headers;
}

function* addFranchiseToRequestHeader(networkConfig) {
    let s3ConfigResponse = yield select(selectS3Response);
    const configType = yield select(selectEnvConfig);
    const franchiseId = getFranchiseIdBasedOnURL(s3ConfigResponse?.country?.id, configType);
    let networkConfigHeader = networkConfig?.config?.headers;
    if (isValidElement(franchiseId)) {
        networkConfigHeader.franchise = franchiseId;
    }
    return networkConfigHeader;
}

function* addJWTToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    if (includeCommonAccessToken(networkConfig)) {
        let authorization = null;
        const passport = getPassport();
        authorization = yield select(getAccessTokenWithTokenType);
        if (isValidElement(authorization) && isValidString(authorization.trim())) {
            const resp = {
                ...requestHeaders,
                Authorization: authorization.trim(),
                passport: passport
            };
            return resp;
        }
    }
    return requestHeaders;
}

function* addRegionToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let region = '';
    region = requestHeaders.region;
    if (!isValidString(region)) {
        region = yield select(selectRegion);
    }
    if (excludeCommonLocale(networkConfig) && isValidString(region)) {
        return {
            ...requestHeaders,
            region: region
        };
    }

    return requestHeaders;
}

function* addLanguageToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let languageObject = yield select(selectLanguage);
    let s3ConfigResponse = yield select(selectS3Response);
    let language = requestHeaders.language;
    if (!isValidString(language)) {
        if (isValidElement(languageObject)) {
            language = languageObject.key;
        }

        if (!isValidString(language)) {
            language = 'en';
        }
    }

    if (excludeCommonLocale(networkConfig) && isValidString(language)) {
        if (isCustomerApp()) {
            return {
                ...requestHeaders,
                language: language
            };
        } else if (isFoodHubApp()) {
            return {
                ...requestHeaders,
                language: getFHLanguage(s3ConfigResponse)
            };
        }
    }
    return requestHeaders;
}

export function* updateConfiguration(obj) {
    try {
        yield put({ type: TYPES_CONFIG.SET_CONFIG_FILE_NAME, payload: obj });
    } catch (e) {
        if (__DEV__) {
            console.log(e);
        }
    }
}

function addLogDataToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let info = getDeviceInfo();
    if (isValidString(CP_VERSION)) {
        info.cp_version = CP_VERSION;
    }
    info.platform_id = BASE_PRODUCT_CONFIG.platform_id;
    info.product_id = BASE_PRODUCT_CONFIG.product_id;
    info.path = isWebDevice ? window?.location?.href : navigationRef?.current?.getCurrentRoute()?.name;
    return {
        ...requestHeaders,
        deviceInfo: JSON.stringify(info)
    };
}

function* addLocaleToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let locale = '';
    locale = requestHeaders.locale;
    if (!isValidString(locale)) {
        locale = isLocaleNeededForManualSwitch(networkConfig) ? yield select(selectSwitchLocale) : yield select(selectLocale);
    }
    if (excludeCommonLocale(networkConfig) && isValidString(locale)) {
        return {
            ...requestHeaders,
            locale: locale
        };
    }
    return requestHeaders;
}

function addFranchiseToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let franchise = isWebDevice ? getWebHost() : requestHeaders?.franchise || AppConfig.FRANCHISE_ID;
    return {
        ...requestHeaders,
        franchise
    };
}

function isAccessTokenExpired(userAccessToken, userAccessTokenExpires) {
    if (isValidString(userAccessToken)) {
        return isValidString(userAccessTokenExpires) && userAccessTokenExpires < addTimeDeviceMoment(SESSION_EXPIRE_BEFORE_CHECK);
    } else {
        return true;
    }
}

function* addEventOrderIDToRequest(networkConfig, event_ordering = false) {
    const selectedEventId = yield select(selectSelectedEventId);
    let requestHeaders = networkConfig.config.headers;
    if (isEventOrderFlowURLs(networkConfig?.url) && selectedEventId) {
        return { ...requestHeaders, event_ordering };
    } else {
        return requestHeaders;
    }
}

function* addGroupOrderIDToRequest(networkConfig) {
    const groupOrdering = yield select(selectGroupOrdering);
    const group_id = yield select(selectBasketID);
    let requestHeaders = networkConfig.config.headers;
    if (isGroupOrderFlowURLs(networkConfig?.url) && groupOrdering) {
        return { ...requestHeaders, group_id };
    } else {
        return requestHeaders;
    }
}

const isEventOrderFlowURLs = (url) => {
    if (isValidString(url)) {
        return (
            _.includes(url, '/confirm') ||
            _.includes(url, '/optomany/order') ||
            _.includes(url, '/wallet/order') ||
            _.includes(url, 'checkout/order') ||
            _.includes(url, '/consumer/v1/cart/')
        );
    }
    return false;
};

const isGroupOrderFlowURLs = (url) => {
    if (isValidString(url)) {
        return (
            _.includes(url, '/confirm') ||
            _.includes(url, '/optomany/order') ||
            _.includes(url, '/wallet/order') ||
            _.includes(url, 'checkout/order') ||
            _.includes(url, '/consumer/v1/cart/') ||
            _.includes(url, '/item/') ||
            _.includes(url, '/consumer/cart/')
        );
    }
    return false;
};

export function generateQuerySessionId() {
    // Generate the first 8 random characters (a-z, A-Z, 0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomChars = '';
    for (let i = 1; i <= 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomChars += chars[randomIndex];
        if (i % 4 === 0) {
            randomChars += '-';
        }
    }

    return randomChars;
}
