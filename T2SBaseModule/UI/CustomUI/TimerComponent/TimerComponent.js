import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { isValidElement } from '../../../Utils/helpers';
import { CountDownTimerHelper, getFormattedDate, getFormattedDeliveryTimeInMinutes } from './Utils/TimerComponentHelper';
import timerComponentStyle from './TimerComponentStyle';
import T2SText from '../../CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/Constants';
import { preOrderSelectDateOnly } from '../../../Utils/AppSelectors';
import { useSelector } from 'react-redux';

const TimerComponent = ({ delivery_time, time_zone, pre_order_time, status, showTimerForPreorder, screenName, textStyle, id }) => {
    const [duration, setDuration] = useState(null);
    const waitingTimer = useRef(null);
    const countryId = useSelector((state) => state.appState.s3ConfigResponse?.country?.id);
    const preOrderDateOnly = useSelector(preOrderSelectDateOnly);

    useEffect(() => {
        orderTimeDifference();

        return () => {
            clearTimer();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery_time, pre_order_time]);

    const clearTimer = () => {
        if (waitingTimer?.current) {
            clearInterval(waitingTimer?.current);
            waitingTimer.current = null;
        }
    };

    const orderTimeDifference = useCallback(() => {
        if (isValidElement(delivery_time) && isValidElement(time_zone)) {
            if (preOrderDateOnly) {
                setDuration(getFormattedDate(delivery_time));
            } else {
                let dt = new Date();
                dt.setSeconds(dt.getSeconds() + getFormattedDeliveryTimeInMinutes(time_zone, delivery_time, true, true));
                let countDownDate = dt.getTime();

                setDuration(CountDownTimerHelper(countDownDate, status, pre_order_time, showTimerForPreorder, countryId));

                waitingTimer.current = setInterval(() => {
                    setDuration(CountDownTimerHelper(countDownDate, status, pre_order_time, showTimerForPreorder, countryId));
                }, 1000);
            }
        }
    }, [countryId, delivery_time, preOrderDateOnly, pre_order_time, showTimerForPreorder, status, time_zone]);

    return (
        <View>
            <T2SText id={VIEW_ID.TIMER_TEXT + '_' + id} screenName={screenName} style={[timerComponentStyle.timerTextStyle, textStyle]}>
                {duration}
            </T2SText>
        </View>
    );
};

export default React.memo(TimerComponent);
