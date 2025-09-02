import React, { Fragment, useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

//Common Widgets
import OrderTrackingPoint from './Components/OrderTrackingPoint';
import OrderTrackingStatus from './Components/OrderTrackingStatus';

// Constants and Strings, Styles
import { ORDER_TYPE } from '../../../../AppModules/BaseModule/BaseConstants';
import styles from './OrderTrackingStyle';

// Helper and Actions
import * as OrderTrackingHelper from './Utils/OrderTrackingHelper';
import { ORDER_STATUS_ENUM } from './Utils/OrderTrackingConfig';
import { T2SView } from 't2sbasemodule/UI';
import { VIEW_ID } from '../../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import { isWeb } from 'appmodules/BaseModule/GlobalAppHelper';
import { getOrderTrackingOrdertype, isNotRestaurant, shouldShow } from '../../../Utils/helpers';
import { useSelector } from 'react-redux';
import { OrderSummaryBrief } from '../../../../AppModules/OrderManagementModule/View/Components/OrderSummaryBrief';

/**
 * How to use this widget?
 * Step 1: Import this OrderTracking.js in your code
 * Step 2: Add widget Component in JSX and Sent below params as props
 * @param {currentStatus:number, orderType:string, displayMode:string} props
 * Sample Code:
 * import OrderTrackingWidget from 't2sbasemodule/UI/CustomUI/OrderTracking/OrderTracking';
 * JSX: <OrderTrackingWidget orderType={'delivery'} currentStatus={'2.5'} />
 */
const OrderTracking = React.memo(
    (props) => {
        const webDevice = isWeb();
        webDevice && window.scrollTo({ top: 0 });
        const { orderDetails, screenName, showOrderBrief = true } = props;

        const [refreshState, setRefresh] = useState(false);
        const orderType = getOrderTrackingOrdertype(orderDetails?.sending);
        const orderID = orderDetails?.id;
        const currentStatus = orderDetails?.payment !== 1 ? orderDetails?.status : 0;
        const businessType = orderDetails?.businessType;
        const isFromOrderStatus = props?.isFromOrderStatus ?? false;
        const currentStatusEnum = OrderTrackingHelper.getOrderStatusEnum(currentStatus);
        const isNotARestaurant = isNotRestaurant(businessType);
        const productTypes = useSelector((state) => shouldShow(state.appConfiguratorState?.product_types));
        const productKey = useSelector((state) => shouldShow(state.appConfiguratorState?.product_key));
        const isNotFoodProduct = productTypes?.[productKey] || false;
        const displayProps = OrderTrackingHelper.getDisplayProps(currentStatusEnum, orderType, true, isNotARestaurant, isNotFoodProduct);

        useEffect(() => {
            if (webDevice) {
                setRefresh(!refreshState); //lottie icon color is not changing without refreshing screen, hence this fix
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentStatusEnum]);

        return (
            <T2SView
                id={VIEW_ID.ORDER_STATUS_CONTAINER}
                accessilbe={false}
                style={[styles.orderTrackingContainer, !isFromOrderStatus && styles.orderStatusContainer]}>
                <T2SView screenName={screenName} style={styles.statusPointContainer}>
                    {displayProps.map((item, index) => (
                        <Fragment key={index}>
                            <T2SView key={refreshState} screenName={screenName} id={VIEW_ID.ORDER_STATUS_TEXT + '_' + item.stageKey}>
                                <LottieView
                                    style={styles.lottieAnimationStyle}
                                    source={item.statusIcon}
                                    autoPlay={item.stageNo <= currentStatusEnum && !item.isCompleted}
                                    loop={!item.isCompleted && item.stageNo !== ORDER_STATUS_ENUM.PLACED}
                                />
                            </T2SView>
                            <OrderTrackingPoint
                                screenName={screenName}
                                data={item}
                                isCompleted={item?.isCompleted}
                                orderType={orderType}
                                isFromOrderStatus={isFromOrderStatus}
                            />
                        </Fragment>
                    ))}
                </T2SView>
                <View style={styles.statusTextContainer}>
                    {displayProps.map((item, index) => (
                        <Fragment key={index}>
                            <OrderTrackingStatus orderID={orderID} screenName={screenName} key={index} data={item} />
                            {index < displayProps.length - 1 && <View style={styles.dummyView} />}
                        </Fragment>
                    ))}
                </View>
                {showOrderBrief ? (
                    <OrderSummaryBrief screenName={screenName} orderDetails={orderDetails} isLandscapeWebMode={false} />
                ) : null}
            </T2SView>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.orderDetails?.id === nextProps.orderDetails?.id &&
            prevProps.screenName === nextProps.screenName &&
            prevProps.orderDetails?.status === nextProps.orderDetails?.status &&
            prevProps.isFromOrderStatus === nextProps.isFromOrderStatus &&
            prevProps.orderDetails?.total_paid_by_card === nextProps.orderDetails?.total_paid_by_card &&
            prevProps.orderDetails?.total_paid_by_wallet === nextProps.orderDetails?.total_paid_by_wallet
        );
    }
);

OrderTracking.propType = {
    currentStatus: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired
};

OrderTracking.defaultProps = {
    orderType: ORDER_TYPE.DELIVERY
};

export default OrderTracking;
