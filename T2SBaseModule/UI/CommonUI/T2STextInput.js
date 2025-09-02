import React, { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';

const T2STextInput = (props) => {
    const { screenName, id, autoCorrect, style, autoFocus } = props;
    const inputRef = useRef(null);
    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => {
                inputRef?.current?.focus();
            }, 100);
        }
    }, [autoFocus, inputRef, screenName]);
    return <TextInput {...props} autoCorrect={autoCorrect} {...setTestId(screenName, id)} ref={props.inputRef ?? inputRef} style={style} />;
};

T2STextInput.defaultProps = {
    autoCorrect: false
};
export default T2STextInput;
