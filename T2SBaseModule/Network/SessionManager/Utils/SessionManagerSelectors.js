import { isFoodHubApp, isFranchiseApp, isValidElement, isValidString } from '../../../Utils/helpers';
import {
    DEFAULT_CONFIGURATOR,
    FOODHUB_DEFAULT_CONFIGURATOR,
    FRANCHISE_DEFAULT_CONFIGURATOR,
    WEB_DEFAULT_CONFIGURATOR
} from 'appmodules/ConfiguratorModule/Utils/ConfiguratorConstants';
import { DEFAULT_TOKEN_TYPE } from './SessionManagerConstants';
export const selectRefreshToken = (state) => state.userSessionState.refresh_token;
export const selectUserAccessToken = (state) => state.userSessionState.access_token;
export const selectUserAccessTypeToken = (state) => state.userSessionState.tokenType;
export const selectUserAccessTokenExpires = (state) => state.userSessionState.access_token_expires_in;
export const selectUserRefreshTokenExpires = (state) => state.userSessionState.refresh_token_expires_in;
export const selectRefreshTokenExpiredTime = (state) => state.userSessionState.refresh_expires_in;
export const selectIsCookieLogin = (state) => state.userSessionState.isCookieLogin;
export const getAccessTokenWithTokenType = (state) => {
    return getAccessTokenFromSessionData(state.userSessionState);
};
export const getAccessTokenFromSessionData = (sessionData) => {
    const accessToken = sessionData?.access_token;
    if (isValidString(accessToken)) {
        return `${sessionData.tokenType ?? DEFAULT_TOKEN_TYPE} ${accessToken}`;
    }
    return null;
};
export const getConfiguration = (state) => {
    let config = state.envConfigState.envConfigData;
    if (isValidElement(config)) {
        return typeof config === 'string' && config !== '' ? JSON.parse(config) : config;
    }
    if (isFoodHubApp()) {
        return FOODHUB_DEFAULT_CONFIGURATOR;
    } else if (isFranchiseApp()) {
        return FRANCHISE_DEFAULT_CONFIGURATOR;
    }
    return DEFAULT_CONFIGURATOR;
};
export const getInitialConfigWeb = (state) => {
    let data = state?.appState?.initialConfigWeb;
    return isValidElement(data) ? data : WEB_DEFAULT_CONFIGURATOR;
};
