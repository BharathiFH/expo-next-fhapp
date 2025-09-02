import React, { useContext, useState } from 'react';
import { View, Pressable, LayoutAnimation } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Card from './Card';
import Heading from './Heading';
import { isValidString, MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { T2SIcon } from '../UI';
import { Colors } from '../Themes';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { isLandscapeScreen, isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
const isDeviceWeb = isWeb();
const Accordion = ({
    title = 'accordionTitle',
    icon,
    isExpanded = false,
    children,
    style,
    duration = 500,
    scrollViewRef = null,
    onOpen = null,
    onClose = null
}) => {
    const mode = useContext(MyResponsiveContext);
    const isLandscapeWebDevice = isLandscapeScreen(mode) && isDeviceWeb;
    const [showUpArrow, setShowUpArrow] = useState(false);
    const height = useSharedValue(0);

    const bodyStyle = useAnimatedStyle(() => ({
        flexBasis: 'auto'
    }));

    const toggleAccordion = () => {
        LayoutAnimation.easeInEaseOut();
        setShowUpArrow((prev) => !prev);
        if (height.value === 0) {
            height.value = 1;
            onOpen?.();
            if (isLandscapeWebDevice) {
                setTimeout(() => {
                    scrollViewRef?.current?.scrollToEnd?.({ animated: true });
                }, duration + 10);
            }
        } else {
            onClose?.();
            height.value = 0;
            setShowUpArrow(false);
        }
    };

    return (
        <Card color="grey" mb="md" radius="sm">
            {isValidString(title) && (
                <Pressable
                    onPress={toggleAccordion}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, margin: -16 }}>
                    <Heading icon={icon} level={3} size={'h6'} spacing={'none'} textTransform="uppercase">
                        {title}
                    </Heading>
                    <T2SIcon name={showUpArrow ? FONT_ICON.UP_ARROW : FONT_ICON.DOWN_ARROW} size={20} color={Colors.textGrey} />
                </Pressable>
            )}
            <Animated.View style={[bodyStyle, style, !showUpArrow ? { height: 0, overflow: 'hidden' } : {}]}>
                <View style={{ paddingTop: 20 }}>{children}</View>
            </Animated.View>
        </Card>
    );
};

export default Accordion;
