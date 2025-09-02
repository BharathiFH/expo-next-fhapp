import React from 'react';

import styles from '../OrderTrackingStyle';
import { ORDER_STATUS_ENUM } from '../Utils/OrderTrackingConfig';
import { TRACKING_VIEW_ID } from '../Utils/OrderTrackingConstant';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { isValidElement } from '../../../../Utils/helpers';
import { View } from 'react-native';
import Colors from '../../../../Themes/Colors';
import { T2SView } from '../../../index';
import stylesheet from 'react-native-web/dist/exports/StyleSheet';
import { isIOS } from '../../../../../AppModules/BaseModule/Helper';

const OrderTrackingPoint = (props) => {
    const { orderType, data, isFromOrderStatus, screenName, isCompleted } = props || {};
    if (isValidElement(data)) {
        if (
            (orderType === ORDER_TYPE.DELIVERY && data.stageNo !== ORDER_STATUS_ENUM.DELIVERED) ||
            (orderType === ORDER_TYPE.COLLECTION && data.stageNo !== ORDER_STATUS_ENUM.READY) ||
            (orderType === ORDER_TYPE.WAITING && data.stageNo !== ORDER_STATUS_ENUM.READY)
        ) {
            if (isCompleted) {
                return (
                    <T2SView screenName={screenName} id={TRACKING_VIEW_ID.STATUS_POINT + data.stageKey} style={styles.lineViewHorizontal} />
                );
            } else {
                return (
                    <T2SView
                        screenName={screenName}
                        id={TRACKING_VIEW_ID.STATUS_POINT + data.stageKey}
                        style={stylesheet.flatten([styles.dashedView, isIOS() ? styles.dashedStyleIOS : styles.dashedStyle])}>
                        {isIOS() ? <View style={[styles.dotedChildView, isFromOrderStatus && { backgroundColor: Colors.white }]} /> : null}
                    </T2SView>
                );
            }
        } else return null;
    }
};

export default OrderTrackingPoint;
