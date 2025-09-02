/**
 * Grid Component
 *
 * A flexible grid layout component for arranging child elements.
 *
 * @component
 * @example
 * <Grid gutter={12} verticalAlign="center" horizontalAlign="space-between">
 *   <Grid.Column size={6}>
 *     <!-- Content for the first column -->
 *   </Grid.Column>
 *   <Grid.Column size={6}>
 *     <!-- Content for the second column -->
 *   </Grid.Column>
 *   ...
 * </Grid>
 *
 * @param {Object} props - The properties of the Grid component.
 * @param {node} props.children - The child elements to be arranged in the grid.
 * @param {number} [props.gutter=12] - The spacing between columns in the grid.
 * @param {string} [props.alignItems] - Vertical alignment for the grid (e.g., 'center', 'flex-end').
 * @param {string} [props.justifyContent] - Horizontal alignment for the grid (e.g., 'space-between', 'flex-start').
 *
 * @returns {ReactElement} A React component representing the grid layout.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { GutterProvider, useGutter } from './Utils/context';
import { getResponsiveStyles } from './Utils/helpers';
import useResponsiveStyle from '../UI/CommonUI/Style/UseResponsiveStyle';
import { isValidElement } from '../Utils/helpers';

const Grid = ({ children, containerPadding, fullHeight = false, gutter = 12, alignItems, justifyContent, direction = 'row' }) => {
    const paddingHorizontal = isValidElement(containerPadding) ? containerPadding : gutter;
    // Define styles for the grid container
    const gridStyles = useMemo(() => {
        return StyleSheet.create({
            gridContainer: {
                paddingHorizontal: paddingHorizontal
            },
            gridRow: {
                height: fullHeight ? '100%' : 'auto',
                flexDirection: direction,
                flexWrap: 'wrap',
                marginHorizontal: -gutter,
                justifyContent: justifyContent,
                alignItems: alignItems
            }
        });
    }, [alignItems, direction, fullHeight, gutter, justifyContent, paddingHorizontal]);

    return (
        // Provide gutter value through context to child components
        <GutterProvider gutter={gutter}>
            <View style={gridStyles.gridContainer}>
                <View style={gridStyles.gridRow}>{children}</View>
            </View>
        </GutterProvider>
    );
};

// PropTypes for the Grid component
Grid.propTypes = {
    children: PropTypes.node,
    gutter: PropTypes.number,
    verticalAlign: PropTypes.string,
    horizontalAlign: PropTypes.string
};

// Custom validator for size prop in Column component
const isSizeInRange = (props, propName, componentName) => {
    const size = props[propName];
    if (size !== 'auto' && (typeof size !== 'number' || size < 1 || size > 12)) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Expected a number from 1 to 12 or 'auto'.`);
    }
    return null;
};

/**
 * Column Component
 *
 * A child component of the Grid, representing a column in the grid layout.
 *
 * @component
 * @param {Object} props - The properties of the Column component.
 * @param {node} props.children - The content of the column.
 * @param {number|string} [props.size] - The width of the column, either as a number from 1 to 12 or 'auto'.
 *
 * @returns {ReactElement} A React component representing a column in the grid.
 */
const Column = ({ children, size, sticky = false }) => {
    // Get gutter value from context
    const { gutter } = useGutter();

    // Calculate responsive width styles for the column
    const responsiveWidth = useMemo(() => {
        return getResponsiveStyles('width', size);
    }, [size]);

    // Extract width value from responsive styles
    const grid = useResponsiveStyle(responsiveWidth?.style || {})?.res?.width;
    const columnWidth = (100 / 12) * grid + '%';
    // Define styles for the column
    const getWidthStyle = useMemo(() => {
        if (size === 'auto') {
            return { flexGrow: 0, flexShrink: 1 };
        } else if (size !== undefined) {
            return { flexGrow: 0, flexShrink: 1, width: columnWidth };
        } else {
            return { flexGrow: 1, flexBasis: 0, width: '100%' };
        }
    }, [columnWidth, size]);

    const columnStyles = StyleSheet.create({
        column: {
            ...getWidthStyle,
            paddingHorizontal: gutter
        }
    });

    // Render the column with calculated styles
    return <View style={columnStyles.column}>{children}</View>;
};

// PropTypes for the Column component
Column.propTypes = {
    children: PropTypes.node,
    size: isSizeInRange
};

// Attach the Column component to the Grid component for easy usage
Grid.Column = Column;

export default Grid;
