import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../Utils/ResponsiveFont';
import T2SIcon from './T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';

export default class RadioButton extends Component {
    render() {
        const { label, onPress, status, disabled = false, focusable = true } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.radioText}>{label}</Text>
                <TouchableOpacity style={styles.radioButtonView} disabled={disabled} onPress={onPress} focusable={focusable}>
                    <T2SIcon
                        icon={status ? FONT_ICON.RADIO_BUTTON_SELECTED : FONT_ICON.RADIO_BUTTON_UNSELECTED}
                        color={status ? Colors.primaryColor : Colors.iconColor}
                        size={22}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    radioText: {
        fontSize: setFont(15)
    },
    radioButtonView: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
