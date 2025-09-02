import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import PropTypes from 'prop-types';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { useTheme } from 't2sbasemodule/MUI/Utils/context';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { defaultTouchArea, isValidString } from 't2sbasemodule/Utils/helpers';
import Typography from 't2sbasemodule/MUI/Typography';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { T2STouchableOpacity } from '../../../UI';

const AddressTwoLine = (props) => {
    const { icon, lineOne, lineOneID, lineTwo, lineTwoID, seperator, spacing, onPress, screenName, id, style, editable, onEdit } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const componentTheme = theme?.microComponents?.address?.addressTwoLine;
    const componentIcon = componentTheme?.icon;
    const iconSize = componentIcon?.size;
    const iconColor = Colors[componentIcon?.color];
    const iconSpacing = componentIcon?.spacing;
    const verticalSpacing = componentTheme?.verticalSpacing;
    const sepColor = seperator ? componentTheme?.separatorColor : 'transparent';

    // Define styles for the button element
    const componentStyles = useMemo(() => {
        const themeSpacing = theme?.spacing;
        const iconMargin = themeSpacing[iconSpacing];
        const addressSpacing = themeSpacing[verticalSpacing];
        const separatorColor = Colors[sepColor];
        const marginBottom = themeSpacing[spacing];
        return {
            iconMargin,
            addressSpacing,
            separatorColor,
            marginBottom
        };
    }, [theme, iconSpacing, verticalSpacing, Colors, sepColor, spacing]);

    // Define styles for the button element using StyleSheet
    const styles = useMemo(
        () =>
            StyleSheet.create({
                addressButton: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: componentStyles.addressSpacing,
                    borderBottomWidth: 1,
                    borderBottomColor: componentStyles.separatorColor,
                    marginBottom: componentStyles.marginBottom,
                    ...style
                },
                iconWrapper: {
                    marginRight: componentStyles.iconMargin
                },
                address: {
                    flex: 1
                }
            }),
        [componentStyles, style]
    );

    const renderIcon = (
        <View style={styles.iconWrapper}>
            <CustomIcon color={iconColor} name={icon} size={iconSize} onPress={onPress} />
        </View>
    );

    const renderEdit = editable ? (
        <T2STouchableOpacity style={styles.iconWrapper} activeOpacity={0.8} hitSlop={defaultTouchArea()} onPress={onEdit}>
            <CustomIcon color={iconColor} name={FONT_ICON.EDIT_UNFILL} size={iconSize} />
        </T2STouchableOpacity>
    ) : null;

    const renderContent = (
        <View style={styles.address}>
            {isValidString(lineOne) ? (
                <Typography id={lineOneID} fontWeight="bold" spacing="xs" screenName={screenName} numberOfLines={1}>
                    {lineOne}
                </Typography>
            ) : null}
            {isValidString(lineTwo) ? (
                <Typography id={lineTwoID} variant="body1" color="textGrey" screenName={screenName} numberOfLines={1}>
                    {lineTwo}
                </Typography>
            ) : null}
        </View>
    );

    return (
        <TouchableOpacity {...props} activeOpacity={0.8} onPress={onPress} style={styles.addressButton} {...setTestId(screenName, id)}>
            {renderIcon}
            {renderContent}
            {renderEdit}
        </TouchableOpacity>
    );
};

// PropTypes
AddressTwoLine.propTypes = {
    icon: PropTypes.string.isRequired,
    lineOne: PropTypes.string.isRequired,
    lineOneID: PropTypes.string.isRequired,
    lineTwo: PropTypes.string.isRequired,
    lineTwoID: PropTypes.string.isRequired,
    seperator: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object
};

// This function checks if specific props have not changed between renders
function propCheck(prevProps, nextProps) {
    return (
        prevProps.lineOne === nextProps.lineOne &&
        prevProps.lineTwo === nextProps.lineTwo &&
        prevProps.seperator === nextProps.seperator &&
        prevProps.spacing === nextProps.spacing &&
        prevProps.id === nextProps.id
    );
}

export default React.memo(AddressTwoLine, propCheck);
