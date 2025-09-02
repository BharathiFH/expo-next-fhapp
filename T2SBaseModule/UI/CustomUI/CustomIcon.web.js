import React, { useMemo } from 'react';
import IcoMoon from 'react-icomoon';
import iconSet from '../../../resources/fonts/selection.json';
import Colors from 't2sbasemodule/Themes/Colors';
import { StyleSheet } from 'react-native';
const CustomIcon = ({ ...props }) => {
    const flattenStyle = useMemo(() => StyleSheet.flatten(props.style), [props.style]);
    return <IcoMoon iconSet={iconSet} icon={props.name} size={props.size} {...props} style={flattenStyle} />;
};
CustomIcon.defaultProps = {
    size: 40,
    color: Colors.textMain
};
export default CustomIcon;
