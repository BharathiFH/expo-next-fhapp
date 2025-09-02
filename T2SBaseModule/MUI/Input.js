import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { TextInput, StyleSheet, View, useColorScheme } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from './Utils/context';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Typography from './Typography';
import CustomIcon from '../UI/CustomUI/CustomIcon';
import { FONT_FAMILY, VIEW_ID } from '../Utils/Constants';
import { AppIcon } from '../Utils/AppIcon';
import { ANDROID_TEXT_FIELD_PROPS } from '../../AppModules/AddressModule/Utils/AddressConstants';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const Input = (props) => {
    const {
        screenName,
        id,
        label,
        autoFocus = false,
        value,
        error,
        errorNumberOfLines,
        onEndEditing,
        onFocus,
        onBlur,
        renderRightAccessory = null,
        radius = 'xs',
        size = 'sm',
        inputRef,
        prefixTxt,
        style = {},
        inputStyle = {},
        handleDuplicates = false,
        isPasswordField = false,
        autoCorrect,
        autoComplete,
        keyboardType,
        helperText = ''
    } = props;

    const [focus, setFocus] = useState(false);
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const inputTheme = theme?.component.input;
    const borderWidth = inputTheme.borderWidth;
    const inputFontSize = inputTheme.size[size].fontSize;
    const scaledLabelSize = inputFontSize * 0.85;
    const borderRadius = inputTheme.radius[radius];
    const marginBottom = inputTheme.size[size].margin;
    const bColor = error ? Colors.red : focus ? Colors.blue : Colors.borderColor;
    const inputHeight = inputTheme.size[size].height;
    const paddingHorizontal = inputTheme.size[size].padding;
    const paddingVertical = inputHeight / 4;
    const shadow = focus ? inputTheme.shadow : null;
    const [inputBoxHeight, setinputBoxHeight] = useState(inputHeight);
    const translate = inputBoxHeight / 2;
    const hasValue = isValidString(value);
    const hasRightAccessory = isValidElement(renderRightAccessory);
    const paddingRight = hasRightAccessory ? inputHeight : paddingHorizontal;
    const translateY = useSharedValue(0);
    const zIndex = useSharedValue(-1);
    const fontSize = useSharedValue(inputFontSize);

    const setOnFocus = () => {
        setFocus(true);
        if (typeof onFocus === 'function') {
            return onFocus(id);
        }
        return onFocus;
    };

    const handleBlur = () => {
        setFocus(false);
        if (typeof onBlur === 'function') {
            return onBlur(id);
        }
        return onBlur;
    };

    const setOnEndEditing = () => {
        if (typeof onEndEditing === 'function') {
            return onEndEditing(id);
        }
        return onEndEditing;
    };

    const renderTextInputIcon = useCallback(() => {
        return (error || errorNumberOfLines) && !isPasswordField ? (
            <View style={styles.renderRightAccessory}>
                <CustomIcon name={AppIcon.dispute} size={25} color={Colors.primaryColor} />
            </View>
        ) : renderRightAccessory ? (
            <View style={styles.renderRightAccessory}>{renderRightAccessory(Colors.textGrey)}</View>
        ) : null;
    }, [Colors, error, errorNumberOfLines, renderRightAccessory, isPasswordField, styles]);

    const prefix = useMemo(() => {
        return isValidString(prefixTxt) ? (
            <Typography variant={'caption'} color={'grey'}>
                {prefixTxt}
            </Typography>
        ) : null;
    }, [prefixTxt]);

    useEffect(() => {
        if (autoFocus && inputRef?.current) {
            inputRef.current?.focus();
        }
    }, [autoFocus, inputRef]);

    const animateInput = useCallback(() => {
        const toValue = focus || hasValue ? -translate : 0;
        translateY.value = withTiming(toValue, { duration: 200 });
        const fontSizeValue = focus || hasValue ? scaledLabelSize : inputFontSize;
        fontSize.value = withTiming(fontSizeValue, { duration: 200 });

        const zIndexValue = focus || hasValue ? 1 : -1;
        zIndex.value = withTiming(zIndexValue, { duration: 200 });
    }, [focus, hasValue, inputFontSize, scaledLabelSize, translate, translateY, fontSize, zIndex]);

    useEffect(() => {
        animateInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus, hasValue, translate]);

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            fontSize: fontSize.value,
            zIndex: zIndex.value,
            position: 'absolute',
            color: Colors.textGrey,
            backgroundColor: Colors.white,
            marginHorizontal: paddingHorizontal / 2,
            paddingHorizontal: paddingHorizontal / 2
        };
    });

    const styles = useMemo(() => {
        return StyleSheet.create({
            inputWrapper: {
                marginBottom: marginBottom,
                zIndex: 1
            },
            inputBlock: {
                justifyContent: 'center'
            },
            input: {
                color: Colors.textMain,
                outlineStyle: 'none',
                borderWidth: borderWidth,
                borderRadius: borderRadius,
                borderColor: bColor,
                fontSize: inputFontSize,
                height: inputHeight,
                paddingHorizontal: paddingHorizontal,
                paddingVertical: paddingVertical,
                paddingRight: paddingRight,
                ...shadow
            },
            errorText: {
                paddingTop: 4,
                paddingHorizontal: paddingHorizontal
            },
            renderRightAccessory: {
                position: 'absolute',
                height: inputHeight,
                justifyContent: 'center',
                right: 0,
                paddingHorizontal: paddingHorizontal
            },
            requiredText: {
                color: Colors.red
            },
            noteText: {
                padding: 5,
                fontSize: setFont(11),
                fontFamily: FONT_FAMILY.MEDIUM,
                color: Colors.textGrey
            }
        });
    }, [
        Colors,
        bColor,
        borderRadius,
        borderWidth,
        inputFontSize,
        inputHeight,
        marginBottom,
        paddingHorizontal,
        paddingRight,
        paddingVertical,
        shadow
    ]);

    const renderLabel = isValidString(label) ? (
        <Animated.Text style={[animatedLabelStyle]}>
            {label}
            {props.required && <Typography style={styles.requiredText}> *</Typography>}
        </Animated.Text>
    ) : null;

    const renderError = error ? (
        <Typography
            variant={'caption'}
            color={'red'}
            style={styles.errorText}
            screenName={screenName}
            id={`${id} ${VIEW_ID.ERROR_MESSAGE}`}>
            {props.errorText}
        </Typography>
    ) : null;

    const renderHelperText = isValidString(helperText) ? (
        <Typography variant={'caption'} color={'grey'} style={styles.noteText}>
            {helperText}
        </Typography>
    ) : null;

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setinputBoxHeight(height);
    };

    return (
        <View style={[styles.inputWrapper, { ...style }]}>
            <View onLayout={handleLayout} style={styles.inputBlock}>
                {prefix}
                <TextInput
                    ref={inputRef}
                    {...props}
                    autoCorrect={autoCorrect}
                    autoComplete={autoComplete}
                    keyboardType={keyboardType}
                    {...setTestId(screenName, id)}
                    onFocus={setOnFocus}
                    onBlur={handleBlur}
                    onEndEditing={setOnEndEditing}
                    style={[styles.input, inputStyle]}
                    {...(handleDuplicates ? ANDROID_TEXT_FIELD_PROPS : {})}
                />

                {renderLabel}
                {renderTextInputIcon()}
            </View>
            {renderHelperText}
            {renderError}
        </View>
    );
};

Input.propTypes = {
    screenName: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
    errorNumberOfLines: PropTypes.number,
    onEndEditing: PropTypes.func,
    onFocus: PropTypes.func,
    renderRightAccessory: PropTypes.func,
    radius: PropTypes.string,
    size: PropTypes.string
};

export default Input;
