import { getAppName } from '../../../Utils/helpers';

let appName = getAppName();

export const APP_UPDATE_CONSTANTS = {
    //TODO need to add app name instead of Customer App before release to production
    updateType: {
        optionalUpdate: 'A new update is available',
        OPTIONAL: 'Optional',
        Forced: 'Forced',
        forceUpdateApp: `Sorry, to continue using ${appName} App, please update to the latest version`
    },
    ModalButtons: {
        UPDATE: 'Update',
        CANCEL: 'Cancel',
        OK: 'Ok'
    }
};
