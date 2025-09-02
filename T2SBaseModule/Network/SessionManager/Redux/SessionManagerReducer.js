import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';
import { extractSessionInfo } from '../Utils/SessionManagerHelper';

const INITIAL_STATE = {
    tokenType: '',
    access_token: '',
    access_token_expires_in: 0,
    refresh_token: '',
    refresh_token_expires_in: 0,
    isUserLoginSuccess: false,
    access_expires_in: 0,
    refresh_expires_in: 0,
    isCookieLogin: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                ...extractSessionInfo(action.payload)
            };
        case AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT:
            return { ...state, ...extractSessionInfo(action.payload), isUserLoginSuccess: true };
        case AUTH_TYPE.SET_LOGOUT_ACTION:
            return INITIAL_STATE;
        case SESSION_MANAGER_TYPES.SET_USER_PROFILE_ACTION:
            return { ...state, ...extractSessionInfo(action.payload), isUserLoginSuccess: true };
        case SESSION_MANAGER_TYPES.IS_COOKIE_LOGIN:
            return { ...state, isCookieLogin: action.payload };
        default:
            return state;
    }
};
