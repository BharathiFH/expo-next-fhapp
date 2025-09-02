/**
 * Widget Component
 * A reusable component that displays a title, optional button, children content, and an optional separator.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Title text to be displayed.
 * @param {string} [props.titleId] - Unique identifier for the title (used for test automation).
 * @param {ReactNode} [props.btnComponent] - A React component to be rendered as a button next to the title.
 * @param {boolean} [props.separator=true] - Flag to determine if a separator should be displayed below the children.
 * @param {ReactNode} props.children - Child components to be rendered inside the Widget.
 * @param {string} props.screenName - Name of the screen for test automation.
 * @param {Object} [props.style] - Additional styles to be applied to the Widget container.
 * @returns {ReactNode} Widget component
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { useTheme } from 't2sbasemodule/MUI/Utils/context';
import Heading from '../../Heading';
import Box from '../../Box';
import FlexBox from '../../FlexBox';

const Widget = (props) => {
    const { title, titleId, titleIcon, btnComponent = null, children, screenName, style, size = 'h6', marginBottom } = props;
    const theme = useTheme();
    const componentProps = theme?.microComponents?.widget;

    // Title
    const renderTitle = useMemo(() => {
        if (isValidString(title)) {
            return (
                <FlexBox minHeight={30} justifyContent={'space-between'} alignItems={'center'} mb={marginBottom || 'sm'}>
                    <Heading
                        icon={titleIcon}
                        level={2}
                        size={size}
                        spacing={'none'}
                        screenName={screenName}
                        id={`${titleId}_Heading`}
                        fontWeight="Black">
                        {title}
                    </Heading>
                    {btnComponent}
                </FlexBox>
            );
        }
        return null;
    }, [btnComponent, marginBottom, screenName, size, title, titleIcon, titleId]);

    return (
        <Box {...componentProps} style={style}>
            {renderTitle}
            {children}
        </Box>
    );
};

// PropTypes
Widget.propTypes = {
    title: PropTypes.string,
    titleId: PropTypes.string,
    btnComponent: PropTypes.element,
    separator: PropTypes.bool,
    children: PropTypes.node,
    screenName: PropTypes.string.isRequired,
    style: PropTypes.object,
    size: PropTypes.string
};

// This function checks if specific props have not changed between renders
function propCheck(prevProps, nextProps) {
    return (
        prevProps.title === nextProps.title &&
        prevProps.titleId === nextProps.titleId &&
        prevProps.btnComponent === nextProps.btnComponent &&
        prevProps.separator === nextProps.separator &&
        prevProps.children === nextProps.children &&
        prevProps.screenName === nextProps.screenName &&
        prevProps.style === nextProps.style &&
        prevProps.size === nextProps.size
    );
}

export default React.memo(Widget, propCheck);
