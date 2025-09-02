import { useState, useEffect, React, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { isWeb } from 'appmodules/BaseModule/GlobalAppHelper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { isIOS } from 'appmodules/BaseModule/Helper';

let isWebDevice = isWeb();

const FHReadMoreText = ({
    text,
    numberOfLines = 3,
    readMoreText = LOCALIZATION_STRINGS.READ_MORE.toLowerCase(),
    readLessText = LOCALIZATION_STRINGS.READ_LESS.toLowerCase(),
    textStyle = {},
    buttonStyle = {},
    containerStyle = {}
}) => {
    const [showFullText, setShowFullText] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);
    const [truncatedText, setTruncatedText] = useState('');

    useEffect(() => {
        setShowFullText(false);
        setShouldShowButton(false);
        setTruncatedText('');
    }, [text]);

    // Handle text layout measurement
    const handleTextLayout = (e) => {
        if (isWebDevice) {
            return;
        }

        const { lines } = e.nativeEvent;
        const isTruncated = lines.length > numberOfLines;

        setShouldShowButton(isTruncated);

        if (isTruncated) {
            // Build visible text for allowed lines
            let visibleText = '';
            for (let i = 0; i < Math.min(numberOfLines, lines.length); i++) {
                visibleText += lines[i].text;
            }
            visibleText = visibleText.trimEnd();
            const readMoreLength = readMoreText.length + 4; // Account for '... '
            if (visibleText.length > readMoreLength) {
                visibleText = visibleText.slice(0, visibleText.length - readMoreLength) + '...';
            }
            setTruncatedText(visibleText);
        }
    };

    // Web fallback
    const TEXT_CONFIG = {
        CHARS_PER_LINE: 40,
        ELLIPSIS: '...',
        PADDING_CHARS: 4
    };

    const calculateMaxCharacters = useCallback(
        () => numberOfLines * TEXT_CONFIG.CHARS_PER_LINE,
        [TEXT_CONFIG.CHARS_PER_LINE, numberOfLines]
    );

    const processTextForWeb = useCallback(
        (text, readMoreText) => {
            // Helper functions for better modularity

            const shouldTruncateText = (textLength, maxChars) => {
                return textLength > maxChars;
            };
            const createTruncatedText = (text, maxChars, readMoreTextLength) => {
                const availableChars = maxChars - readMoreTextLength - TEXT_CONFIG.PADDING_CHARS;
                return text.slice(0, availableChars) + TEXT_CONFIG.ELLIPSIS;
            };
            const maxChars = calculateMaxCharacters();
            const shouldTruncate = shouldTruncateText(text.length, maxChars);

            const trimText = shouldTruncate ? createTruncatedText(text, maxChars, readMoreText.length) : text;

            return {
                shouldShowButton: shouldTruncate,
                truncatedText: trimText
            };
        },
        [TEXT_CONFIG.ELLIPSIS, TEXT_CONFIG.PADDING_CHARS, calculateMaxCharacters]
    );
    // Improved useEffect
    useEffect(() => {
        if (!isWebDevice || !text) {
            return;
        }

        const { shouldShowButton, truncatedText } = processTextForWeb(text, readMoreText);

        setShouldShowButton(shouldShowButton);
        setTruncatedText(truncatedText);
    }, [text, numberOfLines, readMoreText, processTextForWeb]);

    const toggleShowFullText = () => setShowFullText((prev) => !prev);

    // Initial render for mobile - just measure the text
    if (!isWebDevice && !shouldShowButton) {
        return (
            <View style={[style.container, containerStyle]}>
                <Text key={text} style={[style.text, textStyle]} ellipsizeMode="tail" onTextLayout={handleTextLayout}>
                    {text}
                </Text>
            </View>
        );
    }

    // Render based on state
    return (
        <View style={[style.container, containerStyle]}>
            <Text
                key={text + '_' + showFullText}
                style={[style.text, textStyle]}
                numberOfLines={shouldShowButton ? undefined : numberOfLines}
                ellipsizeMode="tail">
                {showFullText ? text : truncatedText}
                {shouldShowButton && (
                    <Text style={[style.button, buttonStyle]}>{showFullText ? ` ${readLessText}` : ` ${readMoreText}`}</Text>
                )}
            </Text>
            {shouldShowButton && <TouchableOpacity onPress={toggleShowFullText} style={style.touchableOverlay} />}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR
    },
    button: {
        color: Colors.blue,
        fontSize: 14,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center',
        ...(isWebDevice ? { cursor: 'pointer' } : isIOS() ? { top: 12, left: 5 } : { top: 3 })
    },
    touchableOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent'
    }
});

export default FHReadMoreText;
