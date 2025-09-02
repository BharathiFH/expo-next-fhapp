import React from 'react';
import { Text, View } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { Colors } from 't2sbasemodule/Themes';
import { TextViewStyle } from './DynamicComponentStyles/TextViewStyle';
import useResponsiveStyle from '../CommonUI/Style/UseResponsiveStyle';
import CustomIcon from '../CustomUI/CustomIcon';

/*This component can be used to dynamically render a view, or a text, along with icon if required. */

const getFontFamily = (font) => {
    return isValidString(font) ? FONT_FAMILY[font?.toUpperCase()] : FONT_FAMILY.MEDIUM;
};
export const TextView = (props) => {
    const { text, customViewStyle, customTextStyle, fontFamily, icon = null, iconColor = Colors.black, iconSize = 20 } = props;
    const styles = useResponsiveStyle(TextViewStyle);
    let font = getFontFamily(fontFamily);
    return (
        <View style={[styles.viewStyle, icon && styles.flexRow, customViewStyle]}>
            {icon ? <CustomIcon name={icon} size={iconSize} color={iconColor} style={styles.iconStyle} /> : null}
            <Text style={[styles.textStyle, customTextStyle, { fontFamily: font }]}>{text}</Text>
        </View>
    );
};
