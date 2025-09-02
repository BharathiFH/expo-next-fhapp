import React, { useMemo } from 'react';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import Card from '../../Card';
import Heading from '../../Heading';
import FlexBox from '../../FlexBox';
import Typography from '../../Typography';
import Image from '../../Image';
import Button from '../../Button';
import Box from '../../Box';

/**
 * PreviousOrderCard Component
 * A card component to display information about a previous order.
 *
 * @param {object} props - Props passed to the component
 * @param {string} props.storeNameId - The unique ID for the store name element for accessibility
 * @param {string} [props.storeName] - The store name text displayed in the card
 * @param {string} [props.storeLogo] - The URL of the store logo image displayed in the card
 * @param {string} props.date - The date text displayed in the card
 * @param {string} props.dateId - The unique ID for the date element for accessibility
 * @param {string} [props.summary] - The summary text displayed in the card
 * @param {string} props.summaryId - The unique ID for the summary element for accessibility
 * @param {string} [props.btnText] - The text displayed on the button in the card
 * @param {function} props.onPress - The callback function triggered when the button is pressed
 * @param {string} props.screenName - The screen name where this component is used (for tracking purposes)
 * @param {object} [props.style] - Additional style properties passed to the Card component
 * @param {string} props.itemId - The unique ID for the item id element for accessibility
 */

const PreviousOrderCard = ({
    storeNameId,
    storeName = '',
    storeLogo = '',
    date,
    dateId,
    summary = '',
    summaryId,
    btnText = '',
    onPress,
    screenName,
    style,
    itemId = ''
}) => {
    // Memoized render function for order information
    const renderInfo = useMemo(
        () => (
            <FlexBox flex={1} flexDirection={'column'} pr={'sm'} importantForAccessibility="no-hide-descendants">
                <Heading id={storeNameId} numberOfLines={2} size={'subtitle2'} spacing={'none'}>
                    {storeName}
                </Heading>
                <Typography numberOfLines={1} id={summaryId + itemId} color={'textGrey'} variant="body2" screenName={screenName}>
                    {summary}
                </Typography>
            </FlexBox>
        ),
        [storeNameId, storeName, summaryId, itemId, screenName, summary]
    );

    // Memoized render function for date and button
    const renderBtn = useMemo(
        () => (
            <FlexBox minHeight={60} flexDirection={'column'} importantForAccessibility="no-hide-descendants">
                <Typography id={dateId} align={'right'} color={'textGrey'} variant="caption2" screenName={screenName}>
                    {date}
                </Typography>
                <Box mt="auto">
                    <Button variant={'bordered'} size={'sm'} onPress={() => onPress()}>
                        {btnText}
                    </Button>
                </Box>
            </FlexBox>
        ),
        [btnText, date, dateId, onPress, screenName]
    );

    // Memoized render function for store logo image
    const renderImage = useMemo(
        () =>
            isValidString(storeLogo) ? (
                <Box mr={'md'} importantForAccessibility="no-hide-descendants">
                    <Image bordered={true} resizeMode={'contain'} radius={'sm'} source={{ uri: storeLogo }} width={60} height={60} />
                </Box>
            ) : null,
        [storeLogo]
    );

    // Memoized render function for the entire content of the card
    const renderContent = useMemo(
        () => (
            <FlexBox importantForAccessibility="no-hide-descendants">
                {renderImage}
                {renderInfo}
                {renderBtn}
            </FlexBox>
        ),
        [renderBtn, renderImage, renderInfo]
    );

    // Return the Card component with the rendered content
    return (
        <Card elevation={'sm'} mb={'md'} bordered style={style}>
            {renderContent}
        </Card>
    );
};

export default React.memo(PreviousOrderCard, (prevProps, nextProps) => {
    return (
        prevProps.storeName === nextProps.storeName &&
        prevProps.storeNameId === nextProps.storeNameId &&
        prevProps.itemId === nextProps.itemId &&
        prevProps.storeLogo === nextProps.storeLogo
    );
});
