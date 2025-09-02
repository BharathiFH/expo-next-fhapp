import { useEffect, useCallback } from 'react';
import { onMessage, getToken } from 'firebase/messaging';
import { messaging } from '../../../Firebase.web';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { setWebDeviceToken } from './Redux/PushNotifiactionAction';
import { useDispatch } from 'react-redux';
import { isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { NOTIFICATION_TYPE } from './Utils/PushNotificationConstants';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { CommonActions } from '@react-navigation/native';
import { getOrderDetailsAction } from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';

// Constants
const NOTIFICATION_ICON = 'https://foodhub.co.uk/compressed_images/foodhub_app_icon.png';
const NOTIFICATION_STATES = {
    GRANTED: 'granted',
    DENIED: 'denied',
    DEFAULT: 'default',
    UNSUPPORTED: 'unsupported'
};
const isFoodhub = isFoodHubApp();

const PushNotificationManager = () => {
    const dispatch = useDispatch();

    const handleServiceWorkerMessage = useCallback(
        (event) => {
            const { type, data, payload } = event?.data || {};

            if (type === 'NAVIGATE') {
                handleNotificationNavigation(data);
            }

            if (type === 'BACKGROUND_MESSAGE' && payload?.data?.order_info_id) {
                dispatch(getOrderDetailsAction(payload.data.order_info_id, false, undefined, true));
            }
        },
        [dispatch, handleNotificationNavigation]
    );

    const checkNotificationPermission = useCallback(() => {
        if (typeof Notification === 'undefined') {
            console.warn('This browser does not support notifications.');
            return NOTIFICATION_STATES.UNSUPPORTED;
        }
        // eslint-disable-next-line no-undef
        return Notification.permission;
    }, []);

    const getDeviceToken = useCallback(
        async (permission) => {
            if (permission !== NOTIFICATION_STATES.GRANTED) {
                console.info('Notification permission:', permission);
                return;
            }

            try {
                const token = await getToken(messaging);
                if (isValidString(token)) {
                    dispatch(setWebDeviceToken(token));
                }
            } catch (error) {
                console.error('Error getting FCM token:', error);
            }
        },
        [dispatch]
    );

    /**
     * Requests notification permission
     */
    const requestNotificationPermission = useCallback(async () => {
        try {
            const currentPermission = checkNotificationPermission();

            if (currentPermission === NOTIFICATION_STATES.UNSUPPORTED) {
                return;
            }

            if (currentPermission === NOTIFICATION_STATES.GRANTED) {
                await getDeviceToken(currentPermission);
                return;
            }

            // eslint-disable-next-line no-undef
            const permission = await Notification?.requestPermission();
            await getDeviceToken(permission);
        } catch (error) {
            console.error('Error setting up notifications:', error);
        }
    }, [checkNotificationPermission, getDeviceToken]);

    /**
     * Parses notification data
     */
    const parseNotificationData = useCallback((payload) => {
        if (!isValidElement(payload)) {
            return null;
        }

        const { messageId, data } = payload;
        return {
            id: isValidElement(messageId) ? messageId : null,
            title: isValidString(data?.title) ? data.title : '',
            message: isValidString(data?.message) ? data.message : '',
            data: isValidElement(data) ? data : {}
        };
    }, []);

    /**
     * Handles foreground notifications
     */
    const handleForegroundNotification = useCallback(
        (payload) => {
            const notificationData = parseNotificationData(payload);
            try {
                if (typeof Notification === 'undefined' || !notificationData?.id || !isOrderNotification(notificationData?.data?.type)) {
                    return;
                }
                // eslint-disable-next-line no-undef
                const notification = new Notification(notificationData.title, {
                    body: notificationData.message,
                    icon: NOTIFICATION_ICON
                });

                notification.onclick = (event) => {
                    event?.preventDefault();
                    handleNotificationNavigation(notificationData);
                    notification?.close();
                };
            } catch (err) {
                //
            } finally {
                dispatch(getOrderDetailsAction(notificationData?.data?.order_info_id, false, undefined, true));
            }
        },
        [dispatch, handleNotificationNavigation, parseNotificationData]
    );

    /**
     * Checks if notification is order-related
     */
    const isOrderNotification = (type) => type === NOTIFICATION_TYPE.TRACKING;

    /**
     * Handles notification navigation
     */
    const handleNotificationNavigation = useCallback((notificationData) => {
        try {
            const { order_info_id, storeId } = notificationData?.data || notificationData || {};
            if (!isValidElement(order_info_id)) {
                return;
            }
            NavigationService?.dispatch((state) => {
                const routes = [
                    ...state.routes,
                    {
                        name: SCREEN_OPTIONS.ORDER_TRACKING.route_name,
                        params: {
                            orderId: order_info_id,
                            storeID: storeId,
                            analyticsObj: {
                                order_id: order_info_id,
                                store_id: storeId
                            },
                            fromPushNotification: true,
                            isFromItemSubstitution: false
                        }
                    }
                ];
                return CommonActions.reset({
                    routes,
                    index: routes.length - 1
                });
            });
        } catch (error) {
            console.error('Error redirecting from notification:', error);
        }
    }, []);

    // Setup notification listeners
    useEffect(() => {
        try {
            onMessage(messaging, handleForegroundNotification);
        } catch (error) {
            console.error('Error setting up notification listeners:', error);
        }
    }, [handleForegroundNotification]);

    // Initialize notifications
    useEffect(() => {
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    // Setup service worker message listener
    useEffect(() => {
        if (!navigator?.serviceWorker) {
            return;
        }

        navigator?.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

        return () => {
            navigator?.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, [handleServiceWorkerMessage]);

    return null;
};

//For foodhub only condition for intial release
export default isFoodhub ? PushNotificationManager : () => null;
