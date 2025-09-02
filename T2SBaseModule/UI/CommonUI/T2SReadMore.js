import React from 'react';
import T2SText from './T2SText';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { LOCALIZATION_STRINGS } from '../../../AppModules/LocalizationModule/Utils/Strings';
import useResponsiveStyle from './Style/UseResponsiveStyle';
import { readMoreStyles } from './Style/T2SReadMoreStyles';
import { isValidElement } from '../../Utils/helpers';

export const T2SReadMoreTextView = (props) => {
    const [readMore, setReadMore] = useState(false);
    const { screenName, numberOfLines, children, showFullText, readMoreStyle } = props || {};
    const styles = useResponsiveStyle(readMoreStyles);
    const handleReadMore = useCallback(() => {
        setReadMore(!readMore);
    }, [readMore]);
    return (
        <View>
            <T2SText {...props} numberOfLines={showFullText || readMore ? null : numberOfLines}>
                {children}
            </T2SText>
            {!showFullText ? (
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.READ_MORE_BUTTON}
                    style={isValidElement(readMoreStyle) ? readMoreStyle : styles.readMoreStyle}
                    onPress={handleReadMore}>
                    {readMore ? LOCALIZATION_STRINGS.READ_LESS : LOCALIZATION_STRINGS.READ_MORE}
                </T2SText>
            ) : null}
        </View>
    );
};
const VIEW_ID = {
    READ_MORE_BUTTON: 'read_more_button'
};
