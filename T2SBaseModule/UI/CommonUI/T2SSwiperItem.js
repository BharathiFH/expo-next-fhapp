import React from 'react';
import { View, Text } from 'react-native';
import { SwiperStyle } from './Style/T2SSwiperStyle';
import T2SView from './T2SView';
import T2SText from './T2SText';
import OrderTracking from '../CustomUI/OrderTracking/OrderTracking';
import { isValidElement } from '../../Utils/helpers';
import { VIEW_ID } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import T2STouchableOpacity from './T2STouchableOpacity';

const T2SSwiperItem = (props) => {
    const { titleText, subTitleText, position, orderLength, screenName, onClick, orderDetails } = props;

    return (
        <T2STouchableOpacity onPress={() => onClick(position)} style={SwiperStyle.container1}>
            <T2SView style={SwiperStyle.container2}>
                <T2SView style={SwiperStyle.titleContainer}>
                    {isValidElement(subTitleText) ? (
                        <T2SText
                            numberOfLines={1}
                            screenName={screenName}
                            id={VIEW_ID.ORDER_STATUS_TITLE + '' + orderDetails?.order_no}
                            style={SwiperStyle.title}>
                            {subTitleText.toUpperCase()}
                        </T2SText>
                    ) : null}
                    {orderLength > 1 ? (
                        <View style={SwiperStyle.orderLengthTextView}>
                            <Text style={SwiperStyle.countTextStyle}>
                                {position + 1}/{orderLength}
                            </Text>
                        </View>
                    ) : null}
                </T2SView>

                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.ORDER_STATUS_SUBTITLE + '_' + orderDetails?.order_no}
                    style={SwiperStyle.subtitle}>
                    {titleText}
                </T2SText>
            </T2SView>
            <>
                <OrderTracking isFromOrderStatus={false} screenName={screenName} orderDetails={orderDetails} showOrderBrief={false} />
            </>
        </T2STouchableOpacity>
    );
};

export default React.memo(T2SSwiperItem);
