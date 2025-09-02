import { CHECKBOX_STATUS } from 'appmodules/HomeModule/Utils/HomeConstants';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SView from './T2SView';

const RadioIcon = (props) => {
    const { disabled, onPress, status, showDisabledColor = false, style, screenName, id, webID } = props;
    const showDisabled = showDisabledColor && disabled;
    return (
        <TouchableOpacity
            {...setTestId(screenName, id, webID)}
            disabled={disabled}
            //to set primaryColor dynamic ,set color here instead of styleSheet
            style={StyleSheet.flatten([
                status === CHECKBOX_STATUS.CHECKED
                    ? [
                          styles.radioCircleSelected,
                          { borderColor: Colors.primaryColor },
                          showDisabled && { borderColor: Colors.borderColor }
                      ]
                    : [styles.radioCircle, showDisabled ? { borderColor: Colors.borderColor } : {}],
                styles.radioContainer,
                style
            ])}
            onPress={onPress}>
            {status === CHECKBOX_STATUS.CHECKED && (
                <T2SView
                    webID={'radio_active'}
                    style={[
                        styles.selectedRb,
                        { backgroundColor: Colors.primaryColor },
                        showDisabled && { backgroundColor: Colors.borderColor }
                    ]}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioContainer: {
        marginHorizontal: 8
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.iconColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioCircleSelected: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedRb: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: Colors.primaryColor
    }
});
export default RadioIcon;
