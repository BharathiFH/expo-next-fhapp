import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../Themes';
import PropTypes from 'prop-types';
import { GutterProvider, useGutter, useTheme } from './Utils/context';
import Box from './Box';
import Typography from './Typography';
import { hexToRgba } from './Utils/helpers';
import CustomIcon from '../UI/CustomUI/CustomIcon';
import { FONT_FAMILY } from '../Utils/Constants';
import { setFont } from '../Utils/ResponsiveFont';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

const ChipContainer = ({ spacing = 'xs', mb = 'md', screenName, id, children }) => {
    const theme = useTheme();
    const chipSpacing = theme.spacing[spacing] + 2;
    const marginBottom = theme.spacing[mb];

    // Define styles for the chip item
    const containerStyles = useMemo(() => {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginHorizontal: -chipSpacing,
                marginBottom: marginBottom
            }
        });
    }, [chipSpacing, marginBottom]);

    return (
        <GutterProvider spacing={chipSpacing}>
            <Box style={containerStyles.container} screenName={screenName} id={id}>
                {children}
            </Box>
        </GutterProvider>
    );
};
const ChipItem = (props) => {
    const {
        label = '',
        onPress,
        variant = 'rounded',
        selected,
        disabled = false,
        isIconEnabled = false,
        iconName,
        iconSize = 14,
        iconColor = Colors.textMain,
        showBadgeCount = false,
        badgeCount = 0,
        screenName,
        id,
        webID
    } = props;
    const theme = useTheme();
    const { spacing } = useGutter();
    const chipTheme = theme?.component?.chip;

    // Define styles for the Chip Button
    const componentStyles = useMemo(() => {
        const borderRadius = variant === 'rounded' ? theme?.borderRadius?.xl : theme?.borderRadius?.sm;
        const paddingHorizontal = theme?.spacing?.md;
        const paddingVertical = theme?.spacing?.sm;
        const boxShadow = chipTheme?.elevation;
        const backgroundColor = selected ? Colors.primaryColor + hexToRgba(Colors?.primaryColor, 0.15) : Colors.white;
        const borderColor = selected ? Colors.primaryColor : Colors.borderColor;
        const normalColor = hexToRgba(Colors?.black, 0.06);
        const activeColor = hexToRgba(Colors?.primaryColor, 0.15);
        const shadowColor = selected ? activeColor : normalColor;
        const textMargin = selected ? -1 : 0;
        return {
            borderRadius,
            paddingHorizontal,
            paddingVertical,
            boxShadow,
            backgroundColor,
            borderColor,
            shadowColor,
            textMargin
        };
    }, [theme, variant, chipTheme, selected]);

    // Define styles for the chip item
    const itemStyles = useMemo(() => {
        return StyleSheet.create({
            chipButton: {
                flexDirection: 'row',
                backgroundColor: componentStyles?.backgroundColor,
                borderColor: componentStyles?.borderColor,
                borderWidth: 1,
                borderRadius: componentStyles?.borderRadius,
                paddingVertical: componentStyles?.paddingVertical,
                paddingHorizontal: componentStyles?.paddingHorizontal,
                margin: spacing,
                ...componentStyles?.boxShadow,
                shadowColor: componentStyles?.shadowColor
            },
            chipText: {
                marginHorizontal: componentStyles?.textMargin
            },
            badgeCounterContainerStyle: {
                minWidth: 15,
                minHeight: 15,
                backgroundColor: Colors.primaryColor,
                fontFamily: FONT_FAMILY.MEDIUM,
                color: Colors.white,
                borderRadius: 15 / 2,
                position: 'absolute',
                justifyContent: 'center',
                right: -15,
                top: -15,
                overflow: 'hidden',
                zIndex: 5
            },
            badgeCounterTextStyle: {
                textAlign: 'center',
                fontSize: setFont(9),
                fontFamily: FONT_FAMILY.MEDIUM,
                color: Colors.defaultWhite
            }
        });
    }, [componentStyles, spacing]);

    return (
        <TouchableOpacity
            disabled={disabled}
            activeOpacity={1}
            style={itemStyles.chipButton}
            onPress={onPress}
            {...setTestId(screenName, id, webID)}>
            <Typography style={itemStyles.chipText} fontWeight={selected ? 'bold' : 'regular'} variant="caption">
                {label}
            </Typography>
            {isIconEnabled ? (
                <Box pl={label?.length > 0 ? 'sm' : 'none'}>
                    <CustomIcon name={iconName} size={iconSize} color={iconColor} onPress={onPress} />
                    {showBadgeCount ? (
                        <View style={itemStyles.badgeCounterContainerStyle}>
                            <Text style={itemStyles.badgeCounterTextStyle}>{badgeCount}</Text>
                        </View>
                    ) : null}
                </Box>
            ) : null}
        </TouchableOpacity>
    );
};

//PropTypes;
ChipContainer.propTypes = {
    children: PropTypes.node.isRequired
};
ChipItem.propTypes = {
    label: PropTypes.string.isRequired,
    onPress: PropTypes.node.isRequired
};

// This function checks if specific props have not changed between renders
function containerPropCheck(prevProps, nextProps) {
    return prevProps.children === nextProps.children;
}
function itemPropCheck(prevProps, nextProps) {
    return prevProps.onPress === nextProps.onPress && prevProps.label === nextProps.label;
}
const Chip = {
    Container: React.memo(ChipContainer, containerPropCheck),
    Item: React.memo(ChipItem, itemPropCheck)
};

export default Chip;
