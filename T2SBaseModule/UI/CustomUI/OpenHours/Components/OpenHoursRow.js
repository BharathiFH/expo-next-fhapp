import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import OpenHoursCell from './OpenHoursCell';
import styles from '../OpenHoursStyle';
import { isValidElement } from '../../../../Utils/helpers';

const OpenHoursRow = (props) => {
    const { rowData, screenName, id, isLastChild, openHoursFormattedDate, columnIndex } = props;
    const rowStylesFlaten = useMemo(() => {
        return StyleSheet.flatten([
            styles.openHoursRowContainer,
            styles.backgroundWhite,
            rowData?.isHeader && { ...styles.borderTopRadius, ...styles.headerBorderStyle },
            isLastChild && styles.borderBottomRadius
        ]);
    }, [rowData?.isHeader, isLastChild]);
    let isToday = isValidElement(rowData?.columnData[0]?.isToday) ? rowData?.columnData[0]?.isToday : false;
    const columnCount = rowData?.columnData?.length;

    return (
        isValidElement(rowData?.columnData) && (
            <View style={rowStylesFlaten} id={id}>
                {rowData?.columnData.map((item, index) => (
                    <OpenHoursCell
                        key={index}
                        isHeader={rowData?.isHeader}
                        isToday={isToday}
                        screenName={screenName}
                        cellData={item}
                        rowIndex={index}
                        columnCount={columnCount}
                        openHoursFormattedDate={openHoursFormattedDate}
                        columnIndex={columnIndex}
                    />
                ))}
            </View>
        )
    );
};

OpenHoursRow.propTypes = {
    rowData: PropTypes.object.isRequired,
    screenName: PropTypes.string.isRequired
};

export default OpenHoursRow;
