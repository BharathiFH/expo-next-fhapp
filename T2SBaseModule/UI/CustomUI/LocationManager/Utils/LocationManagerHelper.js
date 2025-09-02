import { Alert, Linking, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSION_CONSTANTS } from '../../../../../AppModules/AddressModule/Utils/AddressConstants';
import {
    openSettings,
    isGPSLocationEnabled,
    hasLocationPermission,
    isMasterLocationEnable
} from '../../../../../CustomerApp/NativeDependencies/Permissions/Permissions';
import { showErrorMessage } from '../../../../Network/NetworkHelpers';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../../../../AppModules/LocalizationModule/Utils/Strings';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    showLocationDialog: false,
    forceLocationManager: true,
    timeout: 20000,
    maximumAge: 10000
};

const ADVANCE_LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    showLocationDialog: false,
    forceLocationManager: false,
    forceRequestLocation: true,
    timeout: 5000,
    maximumAge: 10
};

export { isGPSLocationEnabled, hasLocationPermission, isMasterLocationEnable, openSettings };
export const LocationManager = {
    addLocationListener: (successListener, errorListener) => {
        let isCancelled = false;
        Geolocation.getCurrentPosition(
            (position) => {
                if (isCancelled === false) {
                    successListener?.(position);
                }
            },
            (error) => {
                if (isCancelled === false) {
                    errorListener?.(error);
                }
            },
            LOCATION_OPTIONS
        );
        return {
            cancel: () => {
                isCancelled = true;
            }
        };
    }
};

export const AdvanceLocationManager = {
    addLocationListener: (successListener, errorListener) => {
        let isCancelled = false;
        Geolocation.getCurrentPosition(
            (position) => {
                if (isCancelled === false) {
                    successListener?.(position);
                }
            },
            (error) => {
                if (isCancelled === false) {
                    errorListener?.(error);
                }
            },
            ADVANCE_LOCATION_OPTIONS
        );
        return {
            cancel: () => {
                isCancelled = true;
            }
        };
    }
};

export const checkIfLocationFailure = (e) => {
    return (
        e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_1 ||
        e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_2 ||
        e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_3 ||
        e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_4
    );
};

export const showLocationFailureIOS = (ref) => {
    try {
        openSettings();
    } catch (error) {
        showErrorMessage(isValidElement(error) ? error.message : LOCALIZATION_STRINGS.COULD_NOT_OPEN_SETTING, ref);
    }
};

export const showLocationFailureAOS = (successCallback = () => {}, failureCallback = () => {}) => {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: LOCALIZATION_STRINGS.ENABLE_MESSAGE,
        ok: LOCALIZATION_STRINGS.TURN_ON,
        cancel: LOCALIZATION_STRINGS.I_DONT_WANT,
        showDialog: true,
        preventOutSideTouch: false,
        preventBackClick: false
    })
        .then((_) => {
            if (_.enabled) {
                successCallback();
            }
        })
        .catch(() => {
            failureCallback();
        });
};

export const showMasterLocationDisableAlertForIOS = () => {
    return Alert.alert(
        'Enable location services',
        'Enable location services on your device inside settings -> Privacy -> Location Services ',
        [
            {
                text: 'OK, GOT IT!'
            }
        ]
    );
};

export const showLocationFailure = (fetchCurrentLocation, flashMessageRef) => {
    if (Platform.OS === 'ios') {
        showLocationFailureIOS(flashMessageRef);
    }
    if (Platform.OS === 'android') {
        showLocationFailureAOS(fetchCurrentLocation);
    }
};

export const goToAppSettings = () => {
    Platform.Version <= 27 ? Linking.openSettings() : Linking.sendIntent(`android.settings.LOCATION_SOURCE_SETTINGS`);
};
