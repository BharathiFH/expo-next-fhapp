import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import { isValidString } from '../../Utils/helpers';
import { setFont } from '../../Utils/ResponsiveFont';
import { OutlinedTextField, TextField } from 'rn-material-ui-textfield';
import { isAndroid, isIOS } from 'appmodules/BaseModule/Helper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { VIEW_ID } from '../../Utils/Constants';
import T2SIcon from './T2SIcon';
import { AppIcon } from '../../Utils/AppIcon';
import { isWeb } from 'appmodules/BaseModule/GlobalAppHelper';

let isAndroidDevice = isAndroid();
let isIOSDevice = isIOS();
const isWebDevice = isWeb();

const T2SMUITextInput = (props) => {
    const {
        screenName,
        id,
        label,
        autoFocus = false,
        value,
        changeUnderlineColor = false,
        error = '',
        errorNumberOfLines,
        isEditable,
        onEndEditing,
        onFocus,
        errorColor = Colors.red,
        baseColor = Colors.borderColor,
        tintColor = Colors.brownLight,
        isOutlined = false,
        prefixTxt = null,
        lineWidth = 2,
        contentInset,
        onBlur,
        color,
        errorLabelStyle,
        renderRightAccessory = null,
        isPasswordField = false,
        autoComplete,
        textContentType,
        accessibilityRole = 'text'
    } = props;

    const InputComponent = isOutlined ? OutlinedTextField : TextField;
    const inputRef = useRef(null);

    const setOnFocus = () => {
        if (typeof onFocus === 'function') {
            return onFocus(id);
        }
        return onFocus;
    };

    const setOnEndEditing = () => {
        if (typeof onEndEditing === 'function') {
            return onEndEditing(id);
        }
        return onEndEditing;
    };

    const renderTextInputIcon = useCallback(() => {
        return (error || errorNumberOfLines) && !isPasswordField ? (
            <T2SIcon name={AppIcon.dispute} size={25} color={Colors.primaryColor} />
        ) : renderRightAccessory ? (
            renderRightAccessory()
        ) : null;
    }, [error, errorNumberOfLines, renderRightAccessory, isPasswordField]);

    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus();
        }
    }, [autoFocus, screenName]);

    return (
        <InputComponent
            accessibilityLabel={`${label}`}
            accessibilityRole={accessibilityRole}
            ref={inputRef}
            onBlur={onBlur}
            labelTextStyle={styles.labelTextStyle}
            lineWidth={lineWidth}
            onEndEditing={setOnEndEditing}
            selectionColor={Colors.textMain}
            onFocus={setOnFocus}
            autofocus={autoFocus}
            activeLineWidth={1.5}
            textColor={Colors.black}
            baseColor={changeUnderlineColor ? Colors.red : baseColor}
            disabledLineType={'solid'}
            editable={isEditable}
            value={value}
            autoCorrect={false}
            spellCheck={false}
            hitSlop={20}
            prefix={
                isValidString(prefixTxt) ? (
                    <T2SView style={styles.prefixContainer} screenName={screenName} id={VIEW_ID.PREFIX_VIEW}>
                        <T2SText style={styles.prefixTextStyle} screenName={screenName} id={`${id} ${VIEW_ID.PREFIX}`}>
                            {prefixTxt}
                        </T2SText>
                    </T2SView>
                ) : null
            }
            {...setTestId(screenName, id)}
            {...props}
            label={
                <View style={styles.labelContainer}>
                    <T2SText
                        accessibilityLabel={`${label}`}
                        accessibilityRole={'text'}
                        style={
                            error
                                ? StyleSheet.flatten([styles.errorLabelTextStyle, errorLabelStyle ?? props.labelStyle])
                                : StyleSheet.flatten([styles.labelTextStyle, props.labelStyle, color ? { color: color } : {}])
                        }
                        screenName={screenName}
                        id={`${id} ${VIEW_ID.LABEL}`}>
                        {label}
                    </T2SText>
                </View>
            }
            error={
                error ? (
                    <T2SText
                        style={[styles.errorFontStyle, { color: isValidString(error) ? errorColor : Colors.textMain }]}
                        screenName={screenName}
                        id={`${id} ${VIEW_ID.ERROR_MESSAGE}`}>
                        {props.errorText}
                    </T2SText>
                ) : null
            }
            errorNumberOfLines={errorNumberOfLines}
            errorColor={isValidString(error) ? errorColor : Colors.textMain}
            tintColor={color ?? tintColor}
            renderRightAccessory={renderTextInputIcon}
            style={StyleSheet.flatten([isWebDevice && styles.outlineWebStyle, styles.textStyle, props.style])}
            underlineColor={props.dontShowUnderLine ? Colors.transparent : Colors.borderColor}
            contentInset={contentInset}
            {...(autoComplete ? { autoComplete } : {})}
            {...(textContentType ? { textContentType } : {})}
        />
    );
};

T2SMUITextInput.propTypes = {
    required: PropTypes.bool,
    selection: PropTypes.object,
    disabled: PropTypes.bool,
    fontSize: PropTypes.number,
    labelFontSize: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    isEditable: PropTypes.bool,
    keyboardType: PropTypes.string,
    returnKeyType: PropTypes.string,
    maxLength: PropTypes.number,
    error: PropTypes.any,
    errorColor: PropTypes.string,
    autoCapitalize: PropTypes.string
};
T2SMUITextInput.defaultProps = {
    fontSize: setFont(14),
    labelFontSize: setFont(12),
    mandatoryColor: Colors.red,
    required: false
};
const deviceScale = Dimensions.get('window').scale;
const isSmallResolutionDevice = deviceScale <= 2.0;

const styles = StyleSheet.create({
    outlineWebStyle: {
        outlineStyle: 'none',
        borderBottomColor: 'transparent',
        width: '100%'
    },
    labelTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        fontSize: setFont(14)
    },
    errorLabelTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.red
    },
    textStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        borderBottom: 'none',
        color: Colors.black
    },
    labelContainer: {
        alignSelf: 'baseline',
        flexDirection: 'row'
    },
    errorFontStyle: {
        fontFamily: FONT_FAMILY.REGULAR
    },
    prefixContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'baseline',
        paddingBottom: isAndroidDevice ? 24 : isWebDevice ? 4 : 0
    },
    prefixTextStyle: {
        alignSelf: 'baseline',
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        textAlign: 'center',
        paddingTop: isIOSDevice ? (isSmallResolutionDevice ? 6 : 5) : 0
    }
});

export default T2SMUITextInput;
