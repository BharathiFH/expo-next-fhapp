import React from 'react';
import { View } from 'react-native';
import { TRACKING_VIEW_ID } from '../Utils/OrderTrackingConstant';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../OrderTrackingStyle';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

const OrderTrackingStatus = (props) => {
    const { data, orderID, screenName } = props || {};
    return (
        <View accessible={false} style={styles.statusTextView}>
            <T2SText
                screenName={screenName}
                id={TRACKING_VIEW_ID.STATUS_TEXT + '_' + data.stageKey + '_' + orderID}
                style={[styles.statusText, { color: data.textColor }]}>
                {data.isCompleted && data.statusText === LOCALIZATION_STRINGS.ORDER_READY
                    ? LOCALIZATION_STRINGS.ORDER_COLLECTED
                    : data.statusText}
            </T2SText>
        </View>
    );
};

export default OrderTrackingStatus;
