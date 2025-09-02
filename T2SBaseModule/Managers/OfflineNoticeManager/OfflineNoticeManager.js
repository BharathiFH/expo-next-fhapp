import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import styles from './Styles/OfflineNoticeManagerStyles';
import { isValidElement } from '../../Utils/helpers';
import NetInfo from '@react-native-community/netinfo';
import { updateConnectionStatusAction } from './Redux/OfflineNoticeManagerAction';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { NETINFO_CONSTANTS } from '../../Utils/Constants';
import { isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';

NetInfo.configure({
    reachabilityUrl: NETINFO_CONSTANTS.REACHABILITY_URL, // Only works on platforms which do not supply internet reachability natively
    reachabilityTest: async (response) => response.status === 204,
    reachabilityRequestTimeout: isWeb() ? NETINFO_CONSTANTS.WEB_TIMEOUT : NETINFO_CONSTANTS.APP_TIMEOUT
});

const OfflineNotice = ({ isFullScreenView = true, offlineMessage }) => {
    const connectionStatus = useSelector((state) => state.offlineNoticeManagerState.connectionStatus);
    const dispatch = useDispatch();
    const store = useStore();

    useEffect(() => {
        const handleConnectivityChange = (isConnected, isForced = false) => {
            const oldConnectionStatus = store.getState().offlineNoticeManagerState.connectionStatus;
            if (oldConnectionStatus !== isConnected || isForced) {
                dispatch(updateConnectionStatusAction(isConnected, oldConnectionStatus));
            }
        };
        let unsubscribe = NetInfo.addEventListener((state) => {
            if (__DEV__) {
                console.log('Connection type', state.type);
                console.log('Is connected?', state.isConnected);
            }
            handleConnectivityChange(state.isConnected ?? true);
        });
        // For initial fetch
        NetInfo.fetch().then((state) => {
            if (__DEV__) {
                console.log('Connection type', state.type);
                console.log('Is connected?', state.isConnected);
            }
            handleConnectivityChange(state.isConnected ?? true, true);
        });
        return () => {
            unsubscribe();
        };
    }, [dispatch, store]);

    if (!connectionStatus) {
        return (
            <View style={isFullScreenView ? styles.offlineContainerFullScreen : styles.offlineContainer}>
                <Text style={styles.offlineText}>
                    {isValidElement(offlineMessage) ? offlineMessage : LOCALIZATION_STRINGS.NO_INTERNET_CONNECTION}
                </Text>
            </View>
        );
    } else {
        return null;
    }
};

export default OfflineNotice;
