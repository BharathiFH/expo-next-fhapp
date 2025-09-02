import { VERSION_UPDATE_API } from './VersionUpdateTypes';
import { put } from 'redux-saga/effects';
import { isValidElement } from '../../../Utils/helpers';
import { AppUpdate } from '../Utils/AppUpdateNetwork';
import { apiCall } from '../../../Network/SessionManager/Network/SessionNetworkWrapper';

export function* getAppVersionCall() {
    try {
        const apiResponse = yield apiCall(AppUpdate.makeGetAppVersion);
        if (isValidElement(apiResponse)) {
            yield put({
                type: VERSION_UPDATE_API.GET_VERSION_UPDATE_SUCCESS,
                payload: apiResponse
            });
        }
    } catch (e) {
        if (__DEV__) {
            console.log(e);
        }
    }
}
