import { isValidElement, isValidNumber, isValidString } from '../../../../Utils/helpers';
import moment from 'moment-timezone';
import { DATE_FORMAT } from '../../../../Utils/DateUtil';
import { ORDER_STATUS } from 'appmodules/BaseModule/BaseConstants';
import { DEFAULT_TIME } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { getFormattedTime } from 'appmodules/EventOrder/Utils/EventOrderHelper';
import { getDateFormatBasedOnCountry } from '../../../../../AppModules/BaseModule/GlobalAppHelper';
export const getFormattedDeliveryTimeInMinutes = (timeZone, delivery_time, returnAsSec = false, showNegativeTime = false) => {
    if (isValidElement(timeZone) && timeZone) {
        let timeDifference = getTimeDifferenceBetweenCurrentTimeFromDeliveryTime(timeZone, delivery_time);
        let duration = moment.duration(timeDifference);
        if (returnAsSec) {
            if (showNegativeTime) {
                return duration.as('seconds');
            } else {
                if (isValidNumber(duration._milliseconds)) {
                    if (duration._milliseconds < 0) {
                        return '0';
                    } else {
                        return duration.as('seconds');
                    }
                } else {
                    return '0';
                }
            }
        } else {
            let hour = Math.floor(duration.asHours());

            if (duration._milliseconds < 0) {
                return '0';
            } else {
                return hour * 60 + parseInt(moment.utc(timeDifference).format('m'));
            }
        }
    }
    return '0';
};

export function getTimeDifferenceBetweenCurrentTimeFromDeliveryTime(timeZone, delivery_time) {
    if (isValidElement(timeZone) && isValidElement(delivery_time)) {
        let storeLocalTime = moment().tz(timeZone).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        let deliveryTime = moment(delivery_time).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        return moment(deliveryTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(storeLocalTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS));
    }
}
export const CountDownTimerHelper = (countDownDate, status, preOrderTime, showTimerForPreorder = false, countryId = 1) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let is_preorder = isPreOrderOrder(preOrderTime);
    const DateFormat = getDateFormatBasedOnCountry(countryId);

    if (!showTimerForPreorder && hours >= 2 && is_preorder) {
        return LOCALIZATION_STRINGS.PREORDER;
    }
    if (distance < 0 || status >= ORDER_STATUS.DELIVERED) {
        return DEFAULT_TIME;
    } else if (days >= 1 && is_preorder) {
        return moment(preOrderTime).format(DateFormat) + ' ' + getFormattedTime(preOrderTime?.split(' ')?.[1]);
    } else if (days >= 1) {
        return days > 1 ? zeroPad(days, 2) + ' ' + 'Days' : zeroPad(days, 2) + ' ' + 'Day';
    } else if (hours > 1) {
        return zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    } else if (hours < 1) {
        return zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    } else {
        return zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    }
};

export const isPreOrderOrder = (preOrderTime) => isValidString(preOrderTime) && !preOrderTime.startsWith('0000');

export const getTimeDifferenceInSeconds = (toTimeStamp, fromTimeStamp) => {
    //2ms response
    const to = new Date(toTimeStamp);
    const from = new Date(fromTimeStamp);
    const timeDiff = to - from;
    return Math.floor(timeDiff / 1000);
};

export const isOrderPlacedInLast24Hours = (order) => {
    const { delivery_time, time_zone, wait, pre_order_time } = order ?? {};
    if (isValidElement(delivery_time) && isValidElement(time_zone)) {
        const currentTime = moment().tz(time_zone);
        const deliveryTime = moment.tz(delivery_time, time_zone);
        const timeDiff = deliveryTime - currentTime;
        const timeDiffInMinutes = Math.floor(timeDiff / (1000 * 60));
        if (timeDiff >= 0 && isPreOrderOrder(pre_order_time)) {
            return timeDiffInMinutes <= parseInt(wait, 10);
        } else {
            return Math.abs(timeDiffInMinutes) < 24 * 60; //include orders placed in last 24 hours
        }
    }
    return false;
};

export const getFormattedDate = (date) => {
    const now = moment();
    const dt = moment(date, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
    if (dt.isSame(now, 'day')) {
        return LOCALIZATION_STRINGS.TODAY;
    } else if (dt.isSame(now.add(1, 'days'), 'day')) {
        return LOCALIZATION_STRINGS.TOMORROW;
    } else {
        return dt.format('DD MMM');
    }
};
