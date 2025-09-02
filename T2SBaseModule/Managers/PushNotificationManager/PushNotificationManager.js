import React, { Component } from 'react';
import { Linking, NativeModules, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import messaging from '../../../CustomerApp/NativeDependencies/Firebase/Messaging';
import { NETWORK_CONSTANTS } from '../../Utils/Constants';
import { boolValue, isValidElement, isValidString } from '../../Utils/helpers';
import T2SModal from '../../UI/CommonUI/T2SModal';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { addOnPushNotificationReceived, deviceRegistrationAction, resetErrorAction } from './Redux/PushNotifiactionAction';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import * as PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Config from 'react-native-config';
import Colors from '../../Themes/Colors';
import {
    getOrderDetailsAction,
    makeGetOrderListAction,
    viewOrderAction
} from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import * as Braze from 'appmodules/AnalyticsModule/Braze';
import { NOTIFICATION_TYPE } from './Utils/PushNotificationConstants';
import { isAndroid } from 'appmodules/BaseModule/Helper';
import { handleReplace } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { setAppCurrentStateAction } from '../../../FoodHubApp/HomeModule/Redux/HomeAction';
import { selectHasUserLoggedIn } from '../../Utils/AppSelectors';
import * as SupportLibrary from '../../../AppModules/BaseModule/SupportLibrary';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { CommonActions } from '@react-navigation/native';
import { selectOrderDetailResponse, selectReceiptResponse } from '../../../AppModules/OrderManagementModule/Redux/OrderManagementSelectors';

class PushNotificationManager extends Component {
    constructor(props) {
        super(props);
        this.handlePushNotificationPositiveButtonClicked = this.handlePushNotificationPositiveButtonClicked.bind(this);
        this.handlePushNotificationNegativeButtonClicked = this.handlePushNotificationNegativeButtonClicked.bind(this);
        this.redirectFromNotification = this.redirectFromNotification.bind(this);
        this.state = {
            noPushNotificationPermissionModal: false,
            notificationData: {}
        };
    }

    async componentDidMount() {
        /**
         * Request only when device is not registered
         */
        await this.checkPermission();
        this.sendMessage();
        this.createNotificationListeners();
    }

    createNotificationListeners() {
        this.displayNotificationInKilled();
        this.handleNotificationOpened();
        this.handleForegroundNotificationTap();
        this.displayNotificationInForeground();
    }
    displayNotificationInForeground() {
        this.notificationForgroundListner = messaging().onMessage((remoteMessage) => {
            if (isValidElement(remoteMessage) && !this.isBrazeNotification(remoteMessage)) {
                const notificationData = this.parseDataFromRemoteMessage(remoteMessage, true);
                if (isValidElement(notificationData)) {
                    this.displayLocalNotification(notificationData);
                }
                const { orderDetailsResponseId, viewOrderResponseId } = this.props;
                let notificationOrderId = notificationData?.data?.order_info_id ?? notificationData?.userInfo?.order_info_id;
                let isSubstitutedItem = notificationData?.data?.message?.includes('substituted');
                let orderStatus = notificationData?.data?.status ?? notificationData?.userInfo?.status;
                // parse notification to see if any order_info_id is present, update the status
                if (isValidElement(notificationOrderId)) {
                    this.props.makeGetOrderListAction(notificationOrderId, orderStatus);
                    if (
                        isSubstitutedItem &&
                        (notificationOrderId?.toString() === orderDetailsResponseId?.toString() ||
                            notificationOrderId?.toString() === viewOrderResponseId?.toString())
                    ) {
                        this.props.viewOrderAction(notificationOrderId, undefined, false);
                    }
                }
            }
        });
    }

    displayLocalNotification(notificationData) {
        if (isValidElement(notificationData)) {
            if (isAndroid()) {
                let notification;
                const { order_info_id } = notificationData.data;
                notification = {
                    channelId: 'orders_id',
                    largeIcon: 'ic_launcher',
                    smallIcon: 'ic_notification',
                    color: Colors.secondary_color,
                    ...notificationData,
                    order_info_id
                };
                PushNotification.localNotification(notification);
            } else {
                let formattedData = {
                    alertTitle: isValidElement(notificationData.title) && notificationData.title,
                    alertBody: isValidElement(notificationData.message) && notificationData.message,
                    userInfo: isValidElement(notificationData.userInfo) && notificationData.userInfo
                };

                PushNotificationIOS.presentLocalNotification(formattedData);
            }
        }
    }

    parseDataFromRemoteMessage(remoteMessage, isLocalNotification = false) {
        if (isValidElement(remoteMessage)) {
            const { notification, id, data } = remoteMessage;
            const notificationData = {
                id: '',
                title: '',
                message: '',
                data: null
            };
            if (isValidElement(remoteMessage.notification)) {
                notificationData.id = isValidElement(id) ? id : null;
                notificationData.title = isValidString(notification.title) ? notification.title : '';
                notificationData.message = isValidString(notification.body) ? notification.body : '';
            }
            if (isLocalNotification && Platform.OS === 'ios') {
                notificationData.userInfo = isValidElement(data) ? data : {};
            } else {
                notificationData.data = isValidElement(data) ? data : {};
            }
            return notificationData;
        }
    }
    handleForegroundNotificationTap() {
        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        PushNotification.configure({
            onNotification: (notificationData) => {
                //This function should trigger when user manually clicks notification
                if (isValidElement(notificationData?.userInteraction) && notificationData.userInteraction) {
                    if (isValidElement(notificationData?.order_info_id)) {
                        this.redirectFromNotification(notificationData);
                    } else if (!isAndroid() && isValidElement(notificationData?.data?.order_info_id)) {
                        this.redirectFromNotification(notificationData.data);
                    }
                }
            }
        });
    }

    handleNotificationOpened() {
        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (isValidElement(remoteMessage?.data)) {
                this.redirectFromNotification(remoteMessage.data);
            }
        });
    }
    displayNotificationInKilled() {
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (isValidElement(remoteMessage?.data)) {
                    this.redirectFromNotification(remoteMessage?.data);
                }
            });
    }

    redirectFromNotification(notificationData) {
        this.setState({ notificationData });
        const { isUserLoggedIn } = this.props;
        if (isUserLoggedIn) {
            //Add Set TimeOut To handle App Kill State
            this.props.setAppCurrentStateAction(true);
            if (isValidElement(notificationData?.order_info_id) && notificationData?.type === 'Refund') {
                handleReplace(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
                    orderId: notificationData.order_info_id,
                    fromPushNotification: true
                });
            } else if (isValidElement(notificationData?.order_info_id)) {
                let isSubstitutedItem = notificationData?.message?.includes('substituted') ?? false;
                NavigationService.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name,
                                state: {
                                    routes: [{ name: SCREEN_OPTIONS.ORDER_HISTORY.route_name }]
                                }
                            },
                            {
                                name: SCREEN_OPTIONS.ORDER_TRACKING.route_name,
                                params: {
                                    orderId: notificationData.order_info_id,
                                    analyticsObj: { order_id: notificationData.order_info_id },
                                    fromPushNotification: true,
                                    isFromItemSubstitution: isSubstitutedItem
                                }
                            }
                        ]
                    })
                );
                this.updateOrderDetails(notificationData?.order_info_id);
            }
        }
    }
    showLocalNotification(data) {
        if (isValidElement(data)) {
            const { title, body, type, order_info_id } = data;
            let notification = {
                title: title,
                message: body
            };
            if (this.isShowPromotionNotification() || this.isOrderNotification(type, order_info_id)) {
                if (isAndroid()) {
                    notification = {
                        channelId: 'orders_id',
                        largeIcon: 'ic_launcher',
                        smallIcon: 'ic_notification',
                        color: Colors.secondary_color
                    };
                    if (isValidElement(order_info_id)) {
                        notification = {
                            ...notification,
                            order_info_id
                        };
                    }
                    PushNotification.localNotification(notification);
                } else {
                    PushNotificationIOS.presentLocalNotification({
                        alertTitle: notification.title,
                        alertBody: notification.message
                    });
                }
            }
        }
    }

    sendMessage() {
        /**
         *
         */
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            if (!isValidElement(remoteMessage.data)) {
                const data = this.parseNotificationResponse(remoteMessage);
                this.showLocalNotification(data);
                // await this.props.refreshOnPushNotificationReceived(data);
            }
            if (isValidElement(remoteMessage.data)) {
                const data = this.parseNotificationResponse(remoteMessage);
                if (isValidElement(data?.order_info_id)) {
                    this.props.makeGetOrderListAction(data?.order_info_id, data?.status);
                }
            }
        });
    }

    async requestPermission() {
        try {
            const hasPermission = await messaging().hasPermission();
            if (hasPermission) {
                // Get FCM Token
                this.getDeviceToken();
            } else {
                // User didn't authorize, show modal
                this.setState({ noPushNotificationPermissionModal: true });
            }
        } catch (e) {
            console.error('Error fetching FCM token', e);
        }
    }

    async checkPermission() {
        try {
            const enabled = await messaging().requestPermission();
            if (enabled) {
                this.getDeviceToken();
            } else {
                // Request for push notification permission
                await this.requestPermission();
            }
        } catch (e) {
            console.error('Error fetching FCM token', e);
        }
    }

    async getDeviceToken() {
        //TODO this is not required for register iOS device.
        // If we should use this manual register we should make the false for 'messaging_ios_auto_register_for_remote_messages' property in firsebase.json
        // await messaging().registerDeviceForRemoteMessages();
        setTimeout(async () => {
            try {
                const fcmToken = await messaging().getToken();
                if (isValidElement(fcmToken)) {
                    this.callDeviceRegistrationAction(fcmToken);
                    Braze.setAnalyticsPushNotification(fcmToken);
                } else {
                    this.getDeviceToken();
                }
            } catch (error) {
                console.error('Error fetching FCM token', error);
            }
        }, 5000);
    }
    handlePushNotificationPositiveButtonClicked() {
        this.positiveButtonTapped();
    }
    handlePushNotificationNegativeButtonClicked() {
        this.dismissModal();
    }
    render() {
        return (
            <View>
                <T2SModal
                    isVisible={this.state.noPushNotificationPermissionModal}
                    description={`${AppConfig.APP_NAME} ${LOCALIZATION_STRINGS.PERMISSION_DESCRIPTION}`}
                    positiveButtonText={LOCALIZATION_STRINGS.ALLOW}
                    negativeButtonText={LOCALIZATION_STRINGS.CANCEL}
                    positiveButtonClicked={this.handlePushNotificationPositiveButtonClicked}
                    negativeButtonClicked={this.handlePushNotificationNegativeButtonClicked}
                    requestClose={this.handlePushNotificationNegativeButtonClicked}
                />
                {this.handleDeviceRegistrationFailure()}
            </View>
        );
    }
    handleDeviceRegistrationFailure = () => {
        const { deviceRegistrationError, deviceToken } = this.props;
        if (isValidElement(deviceRegistrationError) && isValidElement(deviceToken)) {
            if (deviceRegistrationError.type === NETWORK_CONSTANTS.NETWORK_ERROR) {
                this.callDeviceRegistrationAction(deviceToken);
            }
        }
    };

    callDeviceRegistrationAction(fcmToken) {
        this.props.resetErrorAction();
        this.props.deviceRegistrationAction(fcmToken);
        try {
            SupportLibrary.setPushNotificationToken(fcmToken);
        } catch (e) {
            // Nothing to handle
        }
    }

    positiveButtonTapped = () => {
        this.setState({ noPushNotificationPermissionModal: false });
        if (isAndroid()) {
            NativeModules.OpenNotification.open();
        } else {
            Linking.canOpenURL('app-settings:')
                .then((isOpened) => {
                    if (isOpened) {
                        return Linking.openURL('app-settings:');
                    }
                })
                .catch((_) => {});
        }
    };

    dismissModal = () => {
        this.setState({ noPushNotificationPermissionModal: false });
    };

    parseNotificationResponse = (remoteMessage) => {
        if (isValidElement(remoteMessage) && !this.isBrazeNotification(remoteMessage)) {
            const data = isValidElement(remoteMessage.data) ? remoteMessage.data : {};
            const notification = isValidElement(remoteMessage.notification) ? remoteMessage.notification : {};
            data.title = isValidString(data.title)
                ? data.title
                : isValidString(notification.title)
                ? notification.title
                : LOCALIZATION_STRINGS.DEFAULT_NOTIFICATION_BODY_MESSAGE;

            data.body = isValidString(data.message) ? data.message : isValidString(notification.body) ? notification.body : Config.APP_NAME;
            return data;
        }
    };
    /**
     * Here we have to show the promotional notification when the toggle is on
     * @returns {*|boolean}
     */
    isShowPromotionNotification = () => {
        const { profileResponse } = this.props;
        if (isValidElement(profileResponse)) {
            const { is_subscribed_notification } = profileResponse;
            return isValidString(is_subscribed_notification) && boolValue(is_subscribed_notification);
        }
        return false;
    };

    isOrderNotification = (type, id) => {
        if (isValidElement(id) && isValidString(type)) {
            return type === NOTIFICATION_TYPE.TRACKING;
        }
        return false;
    };

    isBrazeNotification = (remoteMessage) => {
        return remoteMessage?.data?.push_from === 'moengage' && this.isShowPromotionNotification();
    };

    updateOrderDetails = (id) => {
        if (isValidString(id)) {
            //TODO if Store id required in future for this API then it won't work. We need access last order store id here
            this.props.getOrderDetailsAction(id, false, undefined, true);
        }
    };
}

const mapStateToProps = (state) => {
    return {
        deviceToken: state.pushNotificationState.deviceToken,
        deviceRegistrationError: state.pushNotificationState.deviceRegistrationError,
        brazeNotificationList: state.pushNotificationState.brazeNotificationList,
        profileResponse: state.profileState.profileResponse,
        isUserLoggedIn: selectHasUserLoggedIn(state),
        isAppOpen: state.foodHubHomeState.isAppOpen,
        countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
        orderDetailsResponseId: selectOrderDetailResponse(state)?.data?.id,
        viewOrderResponseId: selectReceiptResponse(state)?.id
    };
};

const mapDispatchToProps = {
    deviceRegistrationAction,
    resetErrorAction,
    getOrderDetailsAction,
    addOnPushNotificationReceived,
    setAppCurrentStateAction,
    makeGetOrderListAction,
    viewOrderAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotificationManager);
