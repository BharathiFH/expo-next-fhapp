import { Text, View } from 'react-native';
import React from 'react';
import T2STouchableOpacity from '../../CommonUI/T2STouchableOpacity';
import { Colors } from '../../../Themes';
import T2SIcon from '../../CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';

const Prompt = ({ children, style }) => {
    return <View style={style}>{children}</View>;
};

export default Prompt;

Prompt.Header = ({ children, onClose, styles }) => {
    return (
        <View style={styles.headerRow}>
            {children}
            <T2STouchableOpacity style={styles.closeIconStyle} onPress={onClose}>
                <T2SIcon name={FONT_ICON.CLOSE} size={22} color={Colors.textMain} />
            </T2STouchableOpacity>
        </View>
    );
};

Prompt.Title = ({ children, style }) => {
    return <Text style={style}>{children}</Text>;
};

Prompt.Describtion = ({ children, style }) => {
    return <Text style={style}>{children}</Text>;
};

Prompt.Footer = ({ children, style }) => {
    return <View style={style}>{children}</View>;
};
