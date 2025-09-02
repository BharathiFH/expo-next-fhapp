import { WEEKDAYS_NAME_SHORT, OPEN_HOURS_CONSTANTS, WEEKDAYS_NAME_SHORT_ARRAY, WEEKDAYS_FROM_SUN_TO_SAT } from './OpenHoursConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import moment from 'moment-timezone';
import { isArrayNonEmpty, isValidElement, isValidString } from '../../../../Utils/helpers';

const OPEN_HOURS_HEADER_DATA = () => {
    return [
        {
            bgColor: Colors.grey,
            isHeader: true,
            columnData: [
                {
                    isTime: false,
                    isFirstColumn: true,
                    titleText: LOCALIZATION_STRINGS.DAY,
                    timings: []
                },
                {
                    isTime: false,
                    isFirstColumn: false,
                    titleText: LOCALIZATION_STRINGS.COLLECTION,
                    timings: []
                },
                {
                    isTime: false,
                    isFirstColumn: false,
                    titleText: LOCALIZATION_STRINGS.DELIVERY,
                    timings: []
                }
            ]
        }
    ];
};
function getUpcomingDays(daysCount) {
    const today = new Date();
    const upcomingDays = {};
    for (let i = 0; i < daysCount; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i); // Advance the date by i days
        const formattedDate = nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        upcomingDays[formattedDate] = WEEKDAYS_FROM_SUN_TO_SAT[nextDate.getDay()];
    }
    return upcomingDays;
}

// Extract holiday closed days for upcoming week only(upcoming 7days)
const extractUpcommingHolidays = (holidayOpeningHours) => {
    let closedDays = {};
    if (isArrayNonEmpty(holidayOpeningHours)) {
        const upcomingDaysList = getUpcomingDays(7);
        closedDays = holidayOpeningHours.reduce((acc, item) => {
            if (item.status === OPEN_HOURS_CONSTANTS.CLOSED && upcomingDaysList[item.date]) {
                acc[upcomingDaysList[item.date]] = true;
            }
            return acc;
        }, {});
    }
    return closedDays;
};

/**
 * Method to format opening hours response to render UI
 * @param openHoursJsonData, timeZone
 * @returns {{bgColor: string, isHeader: boolean, columnData: [{titleText: *, timings: [], isToday:boolean, isTime: boolean}, {titleText: *, timings: [], isTime: boolean}, {titleText: *, timings: [], isTime: boolean}]}[]}
 */
export const getOpenHoursFormattedDate = (
    openHoursJsonData,
    timeZone,
    showFullData = false,
    deliveryAvailable,
    collectionAvailable,
    holidayOpeningHours = []
) => {
    let formattedOpenHoursData = [...OPEN_HOURS_HEADER_DATA()];
    if (!isValidElement(openHoursJsonData.advanced)) {
        return null;
        // TODO: Opening hours handle only for advanced version, basic version yet to implement.
    }
    const { Collection, Delivery } = openHoursJsonData.advanced;

    let startingIndex = 1;
    const momentOfZone = moment().tz(timeZone);
    const day = momentOfZone.day();
    let today = WEEKDAYS_NAME_SHORT_ARRAY[day - 1];
    let isCollectionClosedForWeek = true,
        isDeliveryClosedForWeek = true;
    const upcommingHolidayDays = extractUpcommingHolidays(holidayOpeningHours);

    for (const dayName of WEEKDAYS_NAME_SHORT_ARRAY) {
        let isToday = dayName === today;

        formattedOpenHoursData.push({
            bgColor: showFullData ? Colors.white : startingIndex % 2 === 0 ? Colors.grey : Colors.grey,
            isHeader: false,
            columnData: [
                {
                    isTime: false,
                    isFirstColumn: true,
                    titleText: getFullDayName(dayName),
                    isToday: isToday,
                    timings: [],
                    isCollectionClosed: getIfStoreClosed(Collection[dayName]),
                    isDeliveryClosed: getIfStoreClosed(Delivery[dayName])
                },
                getTimingsFromString(Collection[dayName], dayName, upcommingHolidayDays[dayName]),
                getTimingsFromString(Delivery[dayName], dayName, upcommingHolidayDays[dayName])
            ]
        });
        startingIndex++;
    }

    if (isArrayNonEmpty(formattedOpenHoursData)) {
        for (let hoursData = 1; hoursData < formattedOpenHoursData.length; hoursData++) {
            if (!formattedOpenHoursData[hoursData]?.columnData[0]?.isCollectionClosed) {
                isCollectionClosedForWeek = false;
            }
            if (!formattedOpenHoursData[hoursData]?.columnData[0]?.isDeliveryClosed) {
                isDeliveryClosedForWeek = false;
            }
            if (hoursData === formattedOpenHoursData.length - 1) {
                formattedOpenHoursData[0].columnData[0] = {
                    ...formattedOpenHoursData[0].columnData?.[0],
                    isDeliveryClosedForWeek,
                    isCollectionClosedForWeek
                };
            }
        }
        for (let i = 0; i < formattedOpenHoursData.length; i++) {
            if (isCollectionClosedForWeek || !collectionAvailable) {
                if (isValidElement(formattedOpenHoursData?.[i]?.columnData)) {
                    formattedOpenHoursData[i].columnData.splice(1, 1);
                }
            }
            if (isDeliveryClosedForWeek || !deliveryAvailable) {
                if (isValidElement(formattedOpenHoursData?.[i]?.columnData)) {
                    formattedOpenHoursData[i].columnData.splice(2, 1);
                }
            }
        }
    }

    if (showFullData) {
        return [...OPEN_HOURS_HEADER_DATA(), formattedOpenHoursData.find((item) => item?.columnData?.[0]?.isToday)];
    }
    return formattedOpenHoursData;
};

/**
 * Method to get full day name aling with opening hours for collection and delivery
 * @param dayName
 * @returns {string|{titleStr: *}}
 */
const getFullDayName = (dayName) => {
    let titleStr;
    switch (dayName) {
        case WEEKDAYS_NAME_SHORT.MONDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_MONDAY;
            break;
        case WEEKDAYS_NAME_SHORT.TUESDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_TUESDAY;
            break;
        case WEEKDAYS_NAME_SHORT.WEDNESDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_WEDNESDAY;
            break;
        case WEEKDAYS_NAME_SHORT.THURSDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_THURSDAY;
            break;
        case WEEKDAYS_NAME_SHORT.FRIDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_FRIDAY;
            break;
        case WEEKDAYS_NAME_SHORT.SATURDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_SATURDAY;
            break;
        case WEEKDAYS_NAME_SHORT.SUNDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_SUNDAY;
            break;
        default:
            titleStr = OPEN_HOURS_CONSTANTS.INVALID_DAY;
            break;
    }
    return titleStr;
};

/**
 * Method to get timings from opening hours string
 * @param timingsArr
 * @param dayNameShort
 * @returns {{isClosed: boolean, titleText: string, timings: [], isTime: boolean}}
 */
const getTimingsFromString = (timingsArr, dayNameShort, isHoliday = false) => {
    const timingsObj = {
        isTime: true,
        isFirstColumn: false,
        isClosed: false,
        titleText: '',
        timings: []
    };

    if (timingsArr[0] === undefined || timingsArr[0] === OPEN_HOURS_CONSTANTS.CLOSED || isHoliday) {
        timingsObj.isClosed = true;
        timingsObj.titleText = LOCALIZATION_STRINGS.CLOSED;
    } else {
        timingsObj.timings = timingsArr.map((item) => {
            if (isValidElement(item)) {
                let timeStr = item.trim().split(' ');
                let startTimeObj, endTimeObj;
                if (timeStr[0] === dayNameShort) {
                    startTimeObj = timeConvertTo12HrFormat(timeStr[1]);
                    endTimeObj = isValidElement(timeStr[4]) ? timeConvertTo12HrFormat(timeStr[4]) : timeConvertTo12HrFormat(timeStr[3]);
                } else {
                    startTimeObj = timeConvertTo12HrFormat(timeStr[0]);
                    endTimeObj = timeConvertTo12HrFormat(timeStr[2]);
                }
                return {
                    startTime: startTimeObj.convertedTime,
                    startTimeAmPm: startTimeObj.amPmStr,
                    endTime: endTimeObj.convertedTime,
                    endTimeAmPm: endTimeObj.amPmStr
                };
            }
        });
    }
    return timingsObj;
};

/**
 * Method to convert 24Hr time string to 12Hr format
 * @param time
 * @returns {{convertedTime: *, amPmStr: *}}
 */
export const timeConvertTo12HrFormat = (time) => {
    if (isValidString(time)) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        let timeAmPm;
        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            timeAmPm = time[0] < 12 ? 'AM' : 'PM';
            time[0] = +time[0] % 12 || 12; // Adjust hours
            //time[0] = String(time[0]).padStart(2, '0');
        }
        return { convertedTime: time.join(''), amPmStr: timeAmPm };
    } else {
        return {
            convertedTime: '',
            amPmStr: ''
        };
    }
};

const getIfStoreClosed = (timingsArr) => {
    return timingsArr[0] === undefined || timingsArr[0] === OPEN_HOURS_CONSTANTS.CLOSED;
};
