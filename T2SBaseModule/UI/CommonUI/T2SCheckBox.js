import React, { useMemo } from 'react';
import T2STouchableOpacity from './T2STouchableOpacity';
import { CheckBoxStyle } from './Style/CheckBoxStyle';
import { StyleSheet } from 'react-native';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SIcon from './T2SIcon';
import T2SView from './T2SView';
import { VIEW_ID } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import T2SText from './T2SText';
import T2SModal from './T2SModal';
import { Colors } from '../../Themes';
import { isValidElement } from '../../Utils/helpers';
const T2SCheckBox = ({
    onPress,
    status,
    label,
    style,
    textstyle = CheckBoxStyle.checkBoxTextStyle,
    disabled = false,
    checkBoxStyle,
    size,
    unFillCheckBoxStyle,
    screenName,
    id,
    focusable = true
}) => {
    const checkBoxStyles = useMemo(() => {
        //to set primaryColor dynamic ,set color here instead of stylesSheet
        return StyleSheet.flatten([
            status && !disabled ? { color: Colors.primaryColor } : CheckBoxStyle.checkBoxUnFillStyle,
            status && !disabled ? checkBoxStyle : unFillCheckBoxStyle
        ]);
    }, [checkBoxStyle, disabled, status, unFillCheckBoxStyle]);
    return (
        <T2STouchableOpacity
            disabled={disabled}
            screenName={screenName}
            id={id}
            onPress={onPress}
            style={style}
            accessible={false}
            focusable={focusable}>
            <T2SView style={CheckBoxStyle.orderTypeViewStyle}>
                {status && !disabled ? (
                    <T2SIcon
                        screenName={screenName}
                        id={VIEW_ID.CHECKED + '_' + id}
                        name={FONT_ICON.CHECKBOX_CHECKED}
                        size={size}
                        style={checkBoxStyles}
                    />
                ) : (
                    <T2SIcon
                        screenName={screenName}
                        id={VIEW_ID.UN_CHECKED + '_' + id}
                        name={FONT_ICON.CHECKBOX_UNCHECKED}
                        size={size}
                        style={checkBoxStyles}
                    />
                )}
                {label ? (
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.LABEL_TEXT}
                        style={[
                            textstyle,
                            { color: disabled ? Colors.textGrey : isValidElement(textstyle.color) ? textstyle.color : Colors.black }
                        ]}>
                        {label}
                    </T2SText>
                ) : null}
            </T2SView>
        </T2STouchableOpacity>
    );
};

T2SModal.defaultProps = {
    size: 30
};

export default T2SCheckBox;
