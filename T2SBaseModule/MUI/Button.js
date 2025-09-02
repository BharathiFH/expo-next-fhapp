/**
 * Button Component
 *
 * A component for rendering buttons with theme-based styles.
 *
 * @component
 * @example
 * <Button onPress={() => handlePress()} variant="solid" color="primary" size="lg">
 *   Click me
 * </Button>
 *
 * @param {Object} props - The properties of the Button component.
 * @param {function} props.onPress - The function to be called when the button is pressed.
 * @param {string} [props.variant='solid'] - The variant of the button (e.g., 'solid', 'outline', 'flat').
 * @param {string} [props.color='primary'] - The color of the button (e.g., 'default', 'primary', 'secondary').
 * @param {string} [props.size='lg'] - The size of the button (e.g., 'sm', 'md', 'lg').
 * @param {string} [props.radius='md'] - The border radius of the button.
 * @param {string} [props.spacing='none'] - The spacing factor used as margin-bottom.
 * @param {ReactNode} [props.image] - The optional image/icon displayed in the button.
 * @param {Object} [props.style] - Additional styles to apply to the button.
 * @param {string} props.screenName - The screen name for automation testing.
 * @param {string} props.id - The unique identifier for automation testing.
 * @param {ReactNode} props.children - The content of the button.
 *
 * @returns {ReactElement} A React component representing the styled button.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from './Utils/context';
// import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import Typography from './Typography';
import { getTextColor, hexToRgba, scaleFont } from './Utils/helpers';
import Image from './Image';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Colors } from '../Themes';
import { FONT_FAMILY } from '../Utils/Constants';
import { useLinkProps } from '@react-navigation/native';
import HoverGradient from './HelperComponents/HoverGradient';
import { useSelector } from 'react-redux';

const NavLink = ({ to, action, children, style, ...rest }) => {
    const { onPress, ...props } = useLinkProps({ to, action });

    const handleWebCallback = useCallback(
        (e) => {
            e.preventDefault();
            action(e);
        },
        [action]
    );
    return (
        <TouchableOpacity style={style} href={isValidString(props.href) ? props.href : '/'} onPress={handleWebCallback} {...rest}>
            {children}
        </TouchableOpacity>
    );
};

const Button = (props) => {
    const {
        onPress,
        variant = 'solid',
        color = 'primary',
        size = 'lg',
        radius = 'sm',
        spacing,
        type = 'button',
        icon = '',
        disabled,
        uppercase = false,
        image,
        to,
        hoverGradient = false,
        screenName,
        id,
        children,
        style,
        buttonTextStyle = {}
    } = props;
    const theme = useTheme();
    // const colorScheme = useColorScheme();
    // const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);

    const [isHovered, setIsHovered] = useState(false);
    const [cursorX, setCursorX] = useState(0);
    const [cursorY, setCursorY] = useState(0);
    const show_hover_button_gradient = useSelector((state) => state?.appConfiguratorState?.hover_button_gradient);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseMove = (event) => {
        const { nativeEvent } = event;
        const { layerX, layerY } = nativeEvent;
        setCursorX(layerX);
        setCursorY(layerY);
    };

    // Define styles for the button element
    const buttonStyles = useMemo(() => {
        const buttonTheme = theme?.component?.button;
        const themeColor = buttonTheme?.colors[color];
        const backgroundColor = Colors[themeColor?.backgroundColor];
        const borderColor = Colors[themeColor?.borderColor];
        const txtColor = Colors[themeColor?.color];

        /* Button Color */
        const normalColor = hexToRgba(backgroundColor, buttonTheme?.variant[variant]?.alpha);
        const hoverColor = hexToRgba(backgroundColor, buttonTheme?.variant[variant]?.hoverAlpha);
        const buttonColor = isHovered && !hoverGradient ? hoverColor : normalColor;
        const buttonBorderColor = variant === 'solid' ? buttonColor : borderColor;
        const buttonTextColor = variant === 'solid' ? getTextColor(backgroundColor, Colors) : txtColor;

        /* Button Radius */
        const buttonHeight = variant !== 'link' ? buttonTheme?.size[type][size].height : null;
        const buttonRadius = type === 'icon' || radius === 'full' ? buttonHeight : theme.borderRadius[radius];
        const borderRadius = variant === 'link' ? theme.borderRadius.xs : buttonRadius;

        /* Button Sizing */
        const borderWidth = buttonTheme?.variant[variant]?.borderWidth;
        const buttonWidth = buttonTheme?.size[type][size].width || 'auto';
        const buttonPadding = variant === 'link' ? theme.spacing.xs : buttonTheme?.size[type][size].padding;
        const marginBottom = theme.spacing[spacing];
        const fontSize = scaleFont(buttonTheme?.size[type][size].fontSize);
        const imgSpacing = isValidElement(image) || isValidString(icon) ? theme.spacing.xs : 0;
        const buttonOpacity = disabled ? 0.5 : 1;
        const iconSize = buttonTheme?.size[type][size].iconSize;
        const textTransform = uppercase ? 'uppercase' : 'none';

        return {
            buttonColor,
            buttonTextColor,
            buttonBorderColor,
            buttonRadius,
            borderWidth,
            buttonHeight,
            buttonWidth,
            buttonPadding,
            marginBottom,
            fontSize,
            borderRadius,
            imgSpacing,
            buttonOpacity,
            iconSize,
            textTransform
        };
    }, [theme, color, variant, isHovered, hoverGradient, type, size, radius, spacing, image, icon, disabled, uppercase]);

    // Define styles for the button element using StyleSheet
    const styles = useMemo(
        () =>
            StyleSheet.create({
                button: {
                    backgroundColor: buttonStyles.buttonColor,
                    borderColor: buttonStyles.buttonBorderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: buttonStyles.borderWidth,
                    height: buttonStyles.buttonHeight,
                    width: buttonStyles.buttonWidth,
                    borderRadius: buttonStyles.borderRadius,
                    paddingHorizontal: buttonStyles.buttonPadding,
                    marginBottom: buttonStyles.marginBottom,
                    opacity: buttonStyles.buttonOpacity,
                    overflow: 'hidden',
                    flexDirection: 'row',
                    zIndex: 1,
                    ...style
                },
                buttonText: {
                    fontSize: buttonStyles.fontSize,
                    fontFamily: FONT_FAMILY.BOLD,
                    marginLeft: buttonStyles.imgSpacing,
                    color: buttonStyles.buttonTextColor,
                    textTransform: buttonStyles.textTransform,
                    ...buttonTextStyle
                },
                icon: {
                    color: buttonStyles.buttonTextColor
                },
                hoverGradient: {
                    zIndex: -1
                }
            }),
        [buttonStyles, style, buttonTextStyle]
    );

    const renderContent =
        type === 'button' ? (
            <>
                <CustomIcon style={styles.icon} name={icon} size={buttonStyles.iconSize} onPress={onPress} />
                <Typography style={styles.buttonText}>{children}</Typography>
                {hoverGradient && show_hover_button_gradient ? (
                    <HoverGradient style={styles.hoverGradient} cursorX={cursorX} cursorY={cursorY} isHovered={isHovered} />
                ) : null}
            </>
        ) : (
            <CustomIcon style={styles.icon} name={icon} size={24} onPress={onPress} />
        );

    return to ? (
        <NavLink
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={styles.button}
            {...setTestId(`${color}_${variant}_btn_${screenName}`, id)}>
            {renderContent}
        </NavLink>
    ) : (
        <TouchableOpacity
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            activeOpacity={0.8}
            disabled={disabled}
            onPress={onPress}
            style={styles.button}
            {...setTestId(`${color}_${variant}_btn_${screenName}`, id)}>
            {isValidElement(image) ? <Image source={image} width={20} height={20} /> : null}
            {renderContent}
        </TouchableOpacity>
    );
};

// PropTypes
Button.propTypes = {
    onPress: PropTypes.func.isRequired,
    variant: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    radius: PropTypes.string,
    spacing: PropTypes.string,
    image: PropTypes.node,
    style: PropTypes.object,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    uppercase: PropTypes.bool,
    disabled: PropTypes.bool
};

// This function checks if specific props have not changed between renders
function propCheck(prevProps, nextProps) {
    return (
        prevProps.onPress === nextProps.onPress &&
        prevProps.variant === nextProps.variant &&
        prevProps.color === nextProps.color &&
        prevProps.size === nextProps.size &&
        prevProps.radius === nextProps.radius &&
        prevProps.spacing === nextProps.spacing &&
        prevProps.image === nextProps.image &&
        prevProps.children === nextProps.children &&
        prevProps.style === nextProps.style &&
        prevProps.screenName === nextProps.screenName &&
        prevProps.id === nextProps.id &&
        prevProps.disabled === nextProps.disabled
    );
}

export default React.memo(Button, propCheck);
