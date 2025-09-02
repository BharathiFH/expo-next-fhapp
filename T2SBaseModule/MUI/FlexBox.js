/**
 * FlexBox Component
 * A reusable component to create flexible layouts using Flexbox.
 * @param {Object} props - Component props
 * @param {string} props.flexDirection - Direction of the main axis.
 * @param {string} props.justifyContent - Alignment of children along the main axis.
 * @param {string} props.alignItems - Alignment of children along the cross axis.
 * @param {string} props.alignSelf - Alignment of the component within its container.
 * @param {string} props.flexWrap - Whether children should wrap if they overflow the container.
 * @param {number} props.flexGrow - Flex grow factor of the component.
 * @param {number} props.flexShrink - Flex shrink factor of the component.
 * @param {string} props.flexBasis - Initial main size of the component.
 * @param {number} props.order - Order of the component in its flex container.
 * @param {string} props.screenName - Name of the screen for test automation.
 * @param {string} props.id - Unique identifier for test automation.
 * @param {Object} props.style - Additional styles to be applied.
 * @param {ReactNode} props.children - Child components to be rendered.
 * @returns {ReactNode} FlexBox component
 */

import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import Box from './Box';

const FlexBox = (props) => {
    const {
        flexDirection = 'row',
        justifyContent,
        alignItems,
        alignSelf,
        flex,
        flexWrap,
        flexGrow,
        flexShrink,
        flexBasis,
        order,
        screenName,
        id,
        style,
        children
    } = props;

    // Memoize styles to optimize performance
    const styles = useMemo(() => {
        return StyleSheet.create({
            flex: {
                flexDirection: flexDirection,
                justifyContent: justifyContent,
                alignItems: alignItems,
                alignSelf: alignSelf,
                flex: flex,
                flexWrap: flexWrap,
                flexGrow: flexGrow,
                flexShrink: flexShrink,
                flexBasis: flexBasis,
                order: order,
                ...style
            }
        });
    }, [alignItems, alignSelf, flex, flexBasis, flexDirection, flexGrow, flexShrink, flexWrap, justifyContent, order, style]);

    return (
        <Box {...props} style={styles.flex} {...setTestId(screenName, id)}>
            {children}
        </Box>
    );
};

export default React.memo(FlexBox);
