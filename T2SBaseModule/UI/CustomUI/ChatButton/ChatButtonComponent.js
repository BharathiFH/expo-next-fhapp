import T2STouchableOpacity from '../../CommonUI/T2STouchableOpacity';
import { View } from 'react-native';
import { T2SText } from '../../index';
import React, { useCallback } from 'react';
import { chatButtonStyle } from './ChatButtonStyle';
import { VIEW_ID } from './ChatButtonConstant';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { startLiveChat } from 'appmodules/BaseModule/Helper';
import { useSelector } from 'react-redux';
import { selectIsNewChatBot } from 't2sbasemodule/Utils/AppSelectors';

export const ChatButtonComponent = (props) => {
    const { screenName, profileResponse, orderId, data, hanldeChatWithUsClick } = props;
    const showNewChatbot = useSelector(selectIsNewChatBot);
    const handleChatClick = useCallback(() => {
        if (hanldeChatWithUsClick) {
            hanldeChatWithUsClick();
        } else {
            startLiveChat({ profileResponse, orderID: orderId, data, showNewChatbot });
        }
    }, [data, hanldeChatWithUsClick, orderId, profileResponse, showNewChatbot]);

    return (
        <T2STouchableOpacity id={VIEW_ID.CHAT_BUTTON_CLICKED} screenName={screenName} onPress={handleChatClick}>
            <View style={chatButtonStyle.buttonViewStyle}>
                <T2SText style={chatButtonStyle.buttonTextStyle} id={VIEW_ID.CHAT_BUTTON_TEXT} screenName={screenName}>
                    {LOCALIZATION_STRINGS.CHAT_WITH_US}
                </T2SText>
            </View>
        </T2STouchableOpacity>
    );
};
