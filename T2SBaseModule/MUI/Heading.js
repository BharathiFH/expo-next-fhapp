/**
 * Heading Component
 *
 * A component for rendering headings with theme-based styles.
 *
 * @component
 * @example
 * <Heading size="h1" spacing={2}>This is a heading</Heading>
 *
 * @param {Object} props - The properties of the Heading component.
 * @param {number} props.level - The accessibility level of the heading.
 * @param {string} [props.size='h1'] - The size of the heading (e.g., 'h1', 'h2', etc.).
 * @param {number} [props.spacing=2] - The spacing factor used as margin-bottom.
 * @param {Object} [props.style] - Additional styles to apply to the heading.
 * @param {ReactNode} props.children - The content of the heading.
 *
 * @returns {ReactElement} A React component representing the styled heading.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import PropTypes from 'prop-types';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { useTheme } from './Utils/context';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_FAMILY } from '../Utils/Constants';

const isWebDevice = isWeb();
const Heading = (props) => {
    const {
        level,
        size = `h${level}`,
        color = 'textMain',
        align,
        spacing = 'md',
        fontWeight = 'bold',
        textTransform = 'none',
        icon,
        screenName,
        id,
        children,
        fontSize
    } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const textColor = Colors[color];
    const typography = theme?.typography;
    const marginBottom = theme?.spacing[spacing];
    const iconSpacing = theme?.spacing.xs;
    const weight = fontWeight?.toUpperCase();

    // Define styles for the heading element
    const styles = useMemo(() => {
        return StyleSheet.create({
            headingWrapper: {
                flexDirection: 'row'
            },
            heading: {
                fontSize: fontSize || typography[size]?.fontSize,
                lineHeight: typography[size]?.lineHeight,
                color: textColor,
                fontFamily: FONT_FAMILY[weight],
                textAlign: align,
                textTransform: textTransform,
                marginBottom: marginBottom
            },
            icon: {
                height: 24,
                width: 24,
                color: textColor,
                marginRight: iconSpacing,
                marginBottom: marginBottom
            }
        });
    }, [align, iconSpacing, marginBottom, size, textColor, textTransform, typography, weight]);

    const renderHeading = () => (
        <Text
            style={styles.heading}
            {...setTestId(screenName, id)}
            accessibilityRole={isWebDevice ? 'heading' : 'text'}
            accessibilityLevel={level}
            {...props}>
            {children}
        </Text>
    );

    // Render the styled heading element
    return isValidElement(icon) ? (
        <View style={styles.headingWrapper}>
            <CustomIcon style={styles.icon} name={icon} size={24} />
            {renderHeading()}
        </View>
    ) : (
        <>{renderHeading()}</>
    );
};

// PropTypes
Heading.propTypes = {
    level: PropTypes.number.isRequired,
    size: PropTypes.string,
    spacing: PropTypes.string,
    children: PropTypes.node.isRequired
};

// Default prop values
Heading.defaultProps = {
    size: 'h1',
    spacing: 'md'
};

export default Heading;
