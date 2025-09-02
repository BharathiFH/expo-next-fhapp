import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../../Card';
import FlexBox from '../../FlexBox';
import Heading from '../../Heading';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Typography from '../../Typography';
import { useTheme } from 't2sbasemodule/MUI/Utils/context';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
import { Colors } from 't2sbasemodule/Themes';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import useResponsiveStyle from 't2sbasemodule/UI/CommonUI/Style/UseResponsiveStyle';
import { takeAwaySearchListStyle } from 'FoodHubApp/TakeawayListModule/Style/TakeawaySearchListStyle';

/**
 * SeoCard Component
 * A card component with expandable content, animated expand/collapse functionality.
 *
 * @param {object} props - Props passed to the component
 * @param {string} props.title - The title text displayed in the header of the card
 * @param {string} props.titleId - The unique ID for the title element for accessibility
 * @param {string} props.content - The content text displayed inside the card
 * @param {string} props.contentID - The unique ID for the content element for accessibility
 * @param {string} props.screenName - The screen name where this component is used (for tracking purposes)
 * @param {object} props.style - Additional style properties passed to the Card component
 */
const SeoCard = (props) => {
    const { title, titleId, content, contentID, screenName, mb = 'none', style } = props;
    const theme = useTheme();

    const typoTheme = theme.typography;
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(false);
    const handleContentLayout = (event) => setContentHeight(event.nativeEvent.layout.height);
    const maxHeight = useSharedValue(36);
    const rotate = useSharedValue(0);
    const showArrow = contentHeight > typoTheme?.body2?.lineHeight;
    const styles = useResponsiveStyle(takeAwaySearchListStyle);

    // Toggle expand/collapse state with animation
    const toggleExpand = useCallback(() => {
        maxHeight.value = withTiming(isExpanded ? 36 : contentHeight, { duration: 300 });
        rotate.value = withTiming(isExpanded ? 0 : 180, { duration: 300 });
        setIsExpanded(!isExpanded);
    }, [contentHeight, isExpanded, maxHeight, rotate]);

    // Animated style for content
    const contentAnimationStyle = useAnimatedStyle(() => {
        return {
            maxHeight: maxHeight.value,
            overflow: 'hidden',
            paddingHorizontal: 10
        };
    });

    // Animated style for the icon
    const iconAnimationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotate.value + 'deg' }],
            marginLeft: 16
        };
    });

    // Render header with animated icon and toggle button
    const renderHeader = useMemo(() => {
        return (
            <FlexBox alignItems={'center'} justifyContent={'space-between'} px={'md'} pt={'md'}>
                <Heading level={1} size={'h6'} fontSize={setFont(16)} id={titleId} spacing={'none'}>
                    {title}
                </Heading>
                {showArrow ? (
                    <T2STouchableOpacity onPress={toggleExpand}>
                        <T2SIcon
                            screenName={screenName}
                            icon={isExpanded ? FONT_ICON.ARROW_UP : FONT_ICON.ARROW_DOWN}
                            style={{ color: Colors.black }}
                            size={35}
                        />
                    </T2STouchableOpacity>
                ) : null}
            </FlexBox>
        );
    }, [iconAnimationStyle, showArrow, title, titleId, toggleExpand]);

    return (
        <Card header={() => renderHeader} headerBorder={true} bordered={true} style={style} mb={mb} p={'sm'}>
            <Animated.View style={contentAnimationStyle}>
                <Typography
                    accessibilityRole={'heading'}
                    accessibilityLevel={2}
                    onLayout={handleContentLayout}
                    color={'textGrey'}
                    fontWeight="light"
                    variant="body2"
                    style={styles.seoTextStyle}
                    screenName={screenName}
                    id={contentID}>
                    {content}
                </Typography>
            </Animated.View>
        </Card>
    );
};

// PropTypes
SeoCard.propTypes = {
    title: PropTypes.string.isRequired,
    titleId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    contentID: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired,
    style: PropTypes.object
};

// This function checks if specific props have not changed between renders
function propCheck(prevProps, nextProps) {
    return (
        prevProps.titleId === nextProps.titleId &&
        prevProps.title === nextProps.title &&
        prevProps.content === nextProps.content &&
        prevProps.contentID === nextProps.contentID &&
        prevProps.screenName === nextProps.screenName
    );
}

export default React.memo(SeoCard, propCheck);
