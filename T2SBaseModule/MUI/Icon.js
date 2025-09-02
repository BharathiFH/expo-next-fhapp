import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Box from './Box';
import CustomIcon from '../UI/CustomUI/CustomIcon';

const Icon = (props) => {
    const { icon, name, size = 14, onPress, id, screenName, color = 'textMain' } = props;
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const iconColor = Colors[color];
    const iconName = isValidElement(icon) ? icon : name;
    return (
        <Box {...props} {...setTestId(screenName, id)}>
            <CustomIcon name={iconName} size={size} color={iconColor} onPress={onPress} />
        </Box>
    );
};

export default Icon;
