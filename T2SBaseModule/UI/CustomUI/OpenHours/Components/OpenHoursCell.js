import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { VIEW_ID } from '../Utils/OpenHoursConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../OpenHoursStyle';

const OpenHoursCell = (props) => {
    const { isHeader, cellData, screenName, rowIndex, isToday, columnCount, openHoursFormattedDate, columnIndex } = props;
    return (
        <View
            style={[
                styles.openHoursCellContainer,
                cellData.isFirstColumn === true
                    ? columnCount === 2
                        ? styles.flexPointFour
                        : styles.flexPointTwo
                    : columnCount === 2
                    ? styles.flexPointEight
                    : styles.flexPointFour,
                isHeader && styles.paddingVerticalEight
            ]}>
            {!cellData.isTime
                ? renderTitle({
                      titleText: cellData.titleText,
                      screenName: screenName,
                      id: `${VIEW_ID.OPEN_HOURS_HEADER_TITLE}_${cellData.titleText}`,
                      titleStyle: isHeader ? styles.headerTextStyle : isToday ? styles.cellTodayTextStyle : styles.cellTextStyle
                  })
                : cellData.isClosed
                ? renderTitle({
                      titleText: cellData.titleText,
                      screenName: screenName,
                      id: `${openHoursFormattedDate[columnIndex].columnData[0].titleText}_${
                          rowIndex === 1 ? VIEW_ID.PICKUP : VIEW_ID.DELIVERY
                      }_${cellData.titleText}`,
                      titleStyle: isToday ? styles.closedTodayTextStyle : styles.closedTextStyle
                  })
                : renderTimings(cellData.timings, screenName, rowIndex, isToday, openHoursFormattedDate, columnIndex)}
        </View>
    );
};

const renderTitle = ({ titleText, screenName, id, titleStyle }) => {
    return (
        <T2SText screenName={screenName} id={id} style={titleStyle}>
            {titleText}
        </T2SText>
    );
};

const renderTimings = (timingsData, screenName, rowIndex, isToday, openHoursFormattedDate, columnIndex) => {
    return timingsData.map((item, index) => (
        <T2SText
            screenName={screenName}
            id={`${openHoursFormattedDate[columnIndex].columnData[0].titleText}_${rowIndex === 1 ? VIEW_ID.PICKUP : VIEW_ID.DELIVERY}`}
            key={index}
            style={isToday ? styles.cellTodayTextStyle : styles.cellTextStyle}>
            {item.startTime}
            <Text style={isToday ? styles.amPmTodayTextStyle : styles.amPmTextStyle}> {item.startTimeAmPm}</Text> - {item.endTime}
            <Text style={isToday ? styles.amPmTodayTextStyle : styles.amPmTextStyle}> {item.endTimeAmPm}</Text>
        </T2SText>
    ));
};

OpenHoursCell.propTypes = {
    isHeader: PropTypes.bool,
    cellData: PropTypes.object.isRequired,
    screenName: PropTypes.string.isRequired,
    rowIndex: PropTypes.number.isRequired
};

export default OpenHoursCell;
