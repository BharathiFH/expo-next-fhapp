import { put } from 'redux-saga/effects';
import { COOKIE_CONSTANT } from '../Network/SessionConst';
import { deleteCookies, getCookies } from '../Utils/CookiesHelper';
import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';
import { isValidString } from '../../../Utils/helpers';
import { extractSessionInfo } from '../Utils/SessionManagerHelper';

export function* getuserProfileDetails() {
    try {
        const token_values = {
            access_token: getCookieValue(COOKIE_CONSTANT.access_token),
            access_expires_in: getCookieValue(COOKIE_CONSTANT.access_token_expires_in),
            refresh_token: getCookieValue(COOKIE_CONSTANT.refresh_token),
            refresh_expires_in: getCookieValue(COOKIE_CONSTANT.refresh_token_expires_in)
        };

        if (isValidString(token_values.access_token)) {
            const isValidCookieLogin = !!getCookieValue(COOKIE_CONSTANT.access_token);
            yield put({
                type: SESSION_MANAGER_TYPES.IS_COOKIE_LOGIN,
                payload: isValidCookieLogin
            });
            yield put({
                type: SESSION_MANAGER_TYPES.SET_USER_PROFILE_ACTION,
                payload: token_values
            });
            deleteCookies(COOKIE_CONSTANT.access_token);
            deleteCookies(COOKIE_CONSTANT.access_token_expires_in);
            deleteCookies(COOKIE_CONSTANT.refresh_token);
            deleteCookies(COOKIE_CONSTANT.refresh_token_expires_in);
            return extractSessionInfo(token_values);
        }
    } catch (e) {
        //Do nothing
    }
}

const getCookieValue = (cookie) => {
    return getCookies(cookie);
};
