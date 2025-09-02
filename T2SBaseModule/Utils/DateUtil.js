import moment from 'moment-timezone';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Constants } from './Constants';
import * as RNLocalize from 'react-native-localize';
import { T2SConfig } from './T2SConfig';

export const TB_DATE_FORMAT_TO_SERVER = 'YYYY-MM-DD';
export const TB_TIME_FORMAT_TO_SERVER = 'HH:mm';
export const TB_DATE_AND_TIME_FORMAT_TO_SERVER = 'YYYY-MM-DD HH:mm:ss';
export const TB_DATE_FORMAT_DISPLAY = 'DD MMM';
export const TB_DATE_FORMAT_DISPLAY_LIST = 'DD MMM YYYY';
export const TB_DATE_FORMAT_DISPLAY_LIST_SECONDS = 'DD MMM YYYY HH:mm:ss';
export const DEFAULT_PAGE_NUMBER_PAGINATION = 1;
export const TB_PENDING_DISPLAY_DATE = 'ddd DD MMM';
export const DATE_TIME_FORMAT_M_DISPLAY_LIST = 'DD MMM YYYY, HH:mm a';
export const DATE_FORMAT_LIST = 'DD/MM/YYYY';
/*
Date Format Reference

https://docs.oracle.com/cd/E41183_01/DR/Date_Format_Types.html
 */

export const getDateString = (dateStr) => {
    let date = moment(dateStr, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, true).toDate();
    let now = new Date();
    let yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    let lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    if (now.toDateString() === date.toDateString()) {
        return moment(date).format('HH:mm');
    } else if (yesterday.toDateString() === date.toDateString()) {
        return moment(date).format('[Yesterday] HH:mm');
    } else if (lastWeek.getTime() < date.getTime()) {
        return moment(date).format('ddd HH:mm');
    } else {
        return moment(date).format('DD MMM');
    }
};

export const DATE_FORMAT = {
    YYYY_MM_DD_HH_MM_SS: 'YYYY-MM-DD HH:mm:ss',
    DD_MM_YYYY_HH_MM: 'DD-MM-YYYY HH:mm',
    DD_MMM_YYY__HH_MM: 'DD MMM YYYY, HH:mm',
    DD_MMM_YYYY_HH_MM_A: 'DD MMM YYYY, hh:mm A',
    DD_MMM_YYYY_H_MM_A: 'DD MMM YYYY, h:mm A',
    DD_MMM_YYYY: 'DD MMM YYYY',
    DD_MM_YYYY: 'DD-MM-YYYY',
    HH_mm: 'HH:mm',
    YYYY_MM_DD: 'YYYY-MM-DD',
    DD_MMM: 'DD MMM',
    MMM_DD: 'MMM DD',
    YYYY_MM_DD_HH_mm: 'YYYY-MM-DD HH:mm',
    YYYY_MM_DD_HH_mm_A: 'YYYY-MM-DD HH:mm A',
    HH: 'HH',
    mm: 'mm',
    HH_mm_a: 'hh:mm A',
    DD_MM_YYYY_SLASH: 'DD/MM/YYYY',
    D_M_YYY: 'D-M-YYYY',
    DD_MMM_HH_MM: 'DD MMM, HH:mm',
    DD_MMM_H_MM_A: 'DD MMM, h:mm A',
    DD_MMM_YYY_H_MM_A: 'DD MMM YYYY, h:mm A',
    YYYYMMDDHHmmss: 'YYYY-MM-DD HH:mm:ss a',
    H_MM_A: 'h:mm A',
    YYYY_MM_DD_H_MM_A: 'YYYY-MM-DD h:mm A',
    DDD: 'ddd',
    MMM_DD_YYYY_H_MM_A: 'MMMM DD, YYYY HH:mm A',
    DDD_HH_MM: 'ddd HH mm',
    DDD_DD_MMM_YYYY: 'ddd DD MMM YYYY',
    DDD_DD_MMM: 'ddd DD MMM',
    DD_DDD_MMM: 'DD ddd MMM',
    HH_mm_ss: 'HH:mm:ss',
    DD_dddd_MMM: 'dddd DD MMM',
    MM_DD_YYYY: 'MM-DD-YYYY',
    MM_DD_YYYY_SLASH: 'MM/DD/YYYY',
    hh_mm_a: 'hh:mm a',
    YYYYMMDDTHHmmssZ: 'YYYYMMDDTHHmmssZ',
    DD_MM_YYYY_HH_mm_ss: 'DD/MM/YYYY HH:mm:ss',
    MMM_DD_H_MM_A: 'MMMM DD, hh:mm A',
    YYYY_MM_DD_hh_mm_A: 'YYYY-MM-DD hh:mm A',
    DDDD: 'dddd'
};

export const addMinutesToDate = (date, interval) => {
    return moment(date).add(interval, 'minutes');
};

export const addMinutesBussinessTime = (timezone, interval) => {
    return getCurrentBusinessMoment(timezone).add(interval, 'minutes');
};

export const getCurrentMoment = (timeZone = undefined) => {
    if (isValidElement(timeZone)) {
        return moment().tz(timeZone);
    } else {
        return moment();
    }
};

export const isBefore5AM = (hour, minute) => {
    return hour <= 4 && minute <= 59;
};
export const getComparisonDateMoment = (timeZone) => {
    return isCurrentDayAfter5AM(timeZone) ? getCurrentMoment(timeZone) : getCurrentMoment(timeZone).add(-1, 'day');
};

export const getTimeDifference = (startTime, endTime) => {
    if (isValidElement(startTime) && isValidElement(endTime)) {
        return moment.duration(endTime.diff(startTime));
    }
};

export const isCurrentDayAfter5AM = (timeZone) => {
    return getCurrentMoment(timeZone).format(DATE_FORMAT.HH) >= 5;
};

export const getUTCHours = (timeZone) => {
    let currentMoment = getCurrentMoment(timeZone);
    return currentMoment.format('Z');
};

export const getCurrentBusinessDay = (timeZone, overrideMoment = null) => {
    if (isValidElement(timeZone)) {
        const currentMoment = overrideMoment ?? getCurrentMoment(timeZone);
        return currentMoment.format(DATE_FORMAT.DDDD).toLowerCase();
    }
    return moment().format(DATE_FORMAT.DDDD).toLowerCase();
};

export const getBusinessDayForDate = (dateTime, timeZone, format = DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) => {
    return getBusinessMomentForDate(dateTime, timeZone, format).format(DATE_FORMAT.DDDD).toLowerCase();
};

export const getCurrentBusinessMoment = (timeZone, overrideMoment = null) => {
    if (isValidElement(timeZone)) {
        let currentMoment = overrideMoment ?? getCurrentMoment(timeZone);
        let hour = currentMoment.hour();
        if (hour < 5) {
            return currentMoment.subtract(1, 'days');
        } else {
            return currentMoment;
        }
    }
    return moment();
};

export const getBusinessMomentForDate = (dateTime, timeZone, format = DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) => {
    if (isValidElement(timeZone)) {
        let currentMoment = moment.tz(dateTime, format, timeZone);
        let hour = currentMoment.hour();
        if (hour < 5) {
            return currentMoment.subtract(1, 'days');
        } else {
            return currentMoment;
        }
    }
};

// for string date
export const isToday = (date) => {
    let currentDate = new Date();
    return currentDate.toISOString().slice(0, 10) === date;
};
export const isValidDate = (date, format) => moment(date, format).isValid() && date !== '0001-11-30' && date !== '000-00-00';

export const getValidMomentDate = (date) => {
    const result = moment(date);
    if (result?.isValid()) {
        return result;
    }
    return null;
};

export const formatDateString = (string, oldFormat, newFormat) => {
    return isValidString(string) ? moment(string, oldFormat).format(newFormat) : Constants.NA;
};

export const formatDate = (momentdate, newFormat) => {
    return isValidElement(momentdate) ? momentdate.format(newFormat) : Constants.NA;
};

export const addTimeDeviceMoment = (expire_seconds) => {
    if (isValidElement(expire_seconds)) {
        return moment().unix() + expire_seconds;
    }
    return moment().unix();
};

export const getDeviceTimeZone = () => {
    return RNLocalize.getTimeZone();
};

export const isBetweenDays = (fromDate, toDate, businessMoment) => {
    if (isValidElement(businessMoment)) {
        return businessMoment.isBetween(fromDate, toDate);
    }
    return moment().isBetween(fromDate, toDate);
};

export const getCurrentDateTime = () => {
    let date = new Date();
    return moment(date).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
};

export const isBetweenTime = (fromTime, toTime, businessMoment, format = 'HH:mm:ss') => {
    if (isValidElement(businessMoment)) {
        return (
            moment(businessMoment.format(format), format) >= moment(fromTime, format) &&
            moment(businessMoment.format(format), format) <= moment(toTime, format)
        );
    }
    return (
        moment(moment().format(format), format) >= moment(fromTime, format) &&
        moment(moment().format(format), format) <= moment(toTime, format)
    );
};
export const isMoreThanOneDay = (basketCreatedAt, noOfDay = 1) => {
    let duration = moment.duration(moment(getCurrentDateTime()).diff(moment(basketCreatedAt)));
    let days = duration.asDays();
    return days > noOfDay;
};
export const isMoreThan24Hours = (inputTime, timezone = null) => {
    let openTime = moment.tz(inputTime, timezone);
    let currentTime = getCurrentMoment(timezone);
    let days = openTime.diff(currentTime, 'days');
    return days >= 1;
};

export const isMOreThen8MinsAndLessThen15Mins = (orderPlacedTime, timeZone) => {
    let duration = moment.duration(getCurrentMoment(timeZone).diff(moment.tz(orderPlacedTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, timeZone)));
    let minutes = duration.asMinutes();
    return minutes > 8 && minutes < 15;
};
export const isLessThen8Min = (orderPlacedTime, timeZone) => {
    let duration = moment.duration(getCurrentMoment(timeZone).diff(moment.tz(orderPlacedTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, timeZone)));
    let minutes = duration.asMinutes();
    return minutes < 8;
};

export const getCurrentDateWithTimeZone = (timezone) => {
    let date = new Date();
    return isValidElement(timezone)
        ? moment(date).tz(timezone).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)
        : moment(date).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
};

export const getDifferenceTimeInHours = (fromTime, toTime) => {
    if (isValidElement(fromTime) && isValidElement(toTime)) {
        const duration = moment.duration(toTime.diff(fromTime));
        const hours = parseInt(duration.asHours());
        return hours;
    }
};

export const getDifferenceTimeInMinuts = (fromTime, toTime) => {
    if (isValidElement(fromTime) && isValidElement(toTime)) {
        const duration = moment.duration(toTime.diff(fromTime));
        const hours = parseInt(duration.asMinutes());
        return hours;
    }
};

export const DATE_PICKER_CONSTANTS = {
    DATE: 'date',
    TIME: 'time',
    DATE_TIME: 'datetime',
    DAYS: 'days'
};

export const isDateWithinRange = (currentDate, minDate, maxDate, mode) => {
    const format = mode === DATE_PICKER_CONSTANTS.DATE || mode === DATE_PICKER_CONSTANTS.DATE_TIME ? DATE_FORMAT.YYYY_MM_DD : undefined;

    if (minDate && maxDate) {
        return currentDate.isSameOrAfter(moment(minDate, format)) && currentDate.isSameOrBefore(moment(maxDate, format));
    } else if (minDate) {
        return currentDate.isSameOrAfter(moment(minDate, format));
    } else if (maxDate) {
        return currentDate.isSameOrBefore(moment(maxDate, format));
    }
    return true;
};

export const addMinutesToTime = (time, interval) => {
    return moment(time, DATE_FORMAT.HH_mm).add(interval, 'm').format(DATE_FORMAT.HH_mm);
};

export const checkIfDatesMoreThanOneDay = (startDate, endDate) => {
    if (isValidElement(startDate) && isValidElement(endDate)) {
        let day1 = moment(startDate, DATE_FORMAT.YYYY_MM_DD);
        let day2 = moment(endDate, DATE_FORMAT.YYYY_MM_DD);
        return day2?.diff(day1, 'days') > 1;
    }
    return false;
};

export const getCountryBaseDateFormat = (country_id) => {
    return country_id?.toString() === T2SConfig.country.US?.toString() ? DATE_FORMAT.MMM_DD : DATE_FORMAT.DD_MMM;
};

export const combineTime = (baseDate, time) => {
    return moment(`${baseDate} ${time}`, DATE_FORMAT.YYYY_MM_DD_hh_mm_A);
};

export const getTodaysDay = (format = 'short') => new Date().toLocaleString('en-US', { weekday: format });

export const isCurrentTimeBetween = (scheduleObj, preOrderSlot, timeZone) => {
    const { startDate, endDate, startTime, endTime } = scheduleObj ?? {};
    const now = isValidDate(preOrderSlot) ? moment.tz(preOrderSlot, DATE_FORMAT.YYYY_MM_DD_HH_mm, timeZone) : getCurrentMoment(timeZone);
    let currentDate = now.format(DATE_FORMAT.YYYY_MM_DD);

    //current date should be after start date and before end date
    let checkIfDateWithinRange = isDateWithinRange(
        moment(currentDate, DATE_FORMAT.YYYY_MM_DD),
        startDate,
        endDate,
        DATE_PICKER_CONSTANTS.DATE
    );

    if (!checkIfDateWithinRange) {
        return false;
    }
    if (!startTime && !endTime) {
        //if start time, endtime is null, then it means deal is available throughout day
        return true;
    }

    const start = isValidString(startTime) ? moment.tz(`${currentDate} ${startTime}`, DATE_FORMAT.YYYY_MM_DD_HH_mm, timeZone) : null;
    const end = isValidString(endTime) ? moment.tz(`${currentDate} ${endTime}`, DATE_FORMAT.YYYY_MM_DD_HH_mm, timeZone) : null;

    if (start && end) {
        return now.isBetween(start, end, null, '[)');
    } else if (start) {
        return now.isSameOrAfter(start);
    } else if (end) {
        return now.isBefore(end);
    }

    return false;
};
