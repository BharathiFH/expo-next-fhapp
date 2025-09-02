import React, { useCallback, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useTheme } from './Utils/context';

/**
 * FlatListGrid Component
 *
 * A customizable FlatList component that arranges items in a grid with specified number of columns and gutter spacing.
 *
 * @param {Array} data - The array of items to be rendered.
 * @param {string} [gutter='sm'] - The spacing between the grid items.
 * @param {number} [numColumns=2] - The number of columns in the grid.
 * @param {function} renderItem - Function to render each item.
 * @param {object} style - Custom styles for the FlatList.
 */
const FlatListGrid = (props) => {
    const { data, gutter = 'sm', numColumns = 2, renderItem, style } = props;
    const theme = useTheme();
    const columnWidth = 100 / numColumns + '%';
    const gutterSpacing = theme.spacing[gutter];

    const styles = useMemo(() => {
        return StyleSheet.create({
            rowStyle: {
                marginHorizontal: -gutterSpacing
            },
            columnStyle: {
                flexGrow: 0,
                flexBasis: columnWidth,
                width: columnWidth,
                paddingHorizontal: gutterSpacing
            }
        });
    }, [columnWidth, gutterSpacing]);

    const renderColumn = useCallback(
        ({ item, index }) => {
            return <View style={styles.columnStyle}>{renderItem({ item, index })}</View>;
        },
        [renderItem, styles]
    );

    return (
        <FlatList
            {...props}
            style={style}
            data={data}
            numColumns={numColumns}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderColumn}
            columnWrapperStyle={styles.rowStyle}
        />
    );
};

// This function checks if specific props have not changed between renders
export default React.memo(FlatListGrid, (prevProps, nextProps) => {
    return (
        prevProps.data?.length === nextProps.data?.length &&
        prevProps.gutter === nextProps.gutter &&
        prevProps.numColumns === nextProps.numColumns &&
        prevProps.renderItem === nextProps.renderItem &&
        prevProps.style === nextProps.style
    );
});
