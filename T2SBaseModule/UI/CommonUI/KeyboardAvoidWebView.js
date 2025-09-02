import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_KEYBOARD_HEIGHT = 250;

const KeyboardAvoidWebView = (props) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS !== 'android') {
            return; // ✅ Skip listeners for non-Android
        }

        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setKeyboardVisible(true);
        });

        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setKeyboardVisible(false);
        });

        return () => {
            showSub?.remove();
            hideSub?.remove();
        };
    }, []);

    const keyboardPaddingHeight = useMemo(() => {
        if (Platform.OS !== 'android') {
            return 0;
        }
        return isKeyboardVisible ? keyboardHeight || DEFAULT_KEYBOARD_HEIGHT : 0;
    }, [isKeyboardVisible, keyboardHeight]);

    return (
        <View style={{ flex: 1, paddingBottom: keyboardPaddingHeight }}>
            <WebView {...props} />
        </View>
    );
};

export default KeyboardAvoidWebView;
