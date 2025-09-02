import React from 'react';
import styles from './Style/T2STextInputStyle';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SView from './T2SView';
import T2SText from './T2SText';
import T2STextInput from './T2STextInput';
import { VIEW_ID } from '../../../AppModules/BasketModule/Utils/BasketConstants';

const T2STextInputField = ({
    ref,
    screenName,
    id,
    label,
    required,
    value,
    keyboardType,
    onFocus,
    onBlur,
    maxLength,
    onChangeText,
    error,
    errorNumberOfLines,
    disabled,
    style,
    autoFocus = false,
    inputRef,
    onSubmitEditing,
    errorText,
    ...props
}) => {
    return (
        <T2SView>
            <T2SView
                style={[
                    styles.textInputWrapper,
                    isValidString(value) && styles.textInputWrapperWithValue,
                    style,
                    error && styles.errorBorder
                ]}>
                {label && (
                    <T2SView style={styles.labelWrapper}>
                        <T2SText style={styles.labelStyle} numberOfLines={1}>
                            {label} {required && <T2SText style={styles.requiredStyle}>*</T2SText>}
                        </T2SText>
                    </T2SView>
                )}

                <T2STextInput
                    inputRef={isValidElement(inputRef) ? inputRef : ref}
                    screenName={screenName}
                    id={id}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    style={styles.textInputStyle}
                    onSubmitEditing={onSubmitEditing}
                    {...props}
                />
            </T2SView>
            <T2SText screenName={screenName} id={VIEW_ID.ERROR_TEXT} style={styles.errorStyle} numberOfLines={errorNumberOfLines}>
                {errorText}
            </T2SText>
        </T2SView>
    );
};

export default React.memo(T2STextInputField);
