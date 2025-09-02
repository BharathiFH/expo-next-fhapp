import React from 'react';
import FlexBox from './FlexBox';
import Box from './Box';
import Button from './Button';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from '../../AppModules/TakeawayDetailsModule/Utils/TakeawayDetailsConstants';

const CarouselNav = (props) => {
    const { prevClick, nextClick, isLeftArrowDisabled = false, isRightArrowDisabled = false, screenName } = props;
    return (
        <Box
            position={'absolute'}
            bottom={'100%'}
            right={0}
            mb={'md'}
            {...props}
            id={VIEW_ID.CAROUSEL_NAV_CONTAINER}
            screenName={screenName}>
            <FlexBox>
                <Box pr="sm">
                    <Button
                        screenName={screenName}
                        id={VIEW_ID.CAROUSEL_NAV_LEFT_ARROW}
                        disabled={isLeftArrowDisabled}
                        size="sm"
                        type="icon"
                        color="default"
                        icon={FONT_ICON.ARROW_LEFT_SMALL}
                        onPress={() => {
                            prevClick();
                        }}
                    />
                </Box>
                <Button
                    screenName={screenName}
                    id={VIEW_ID.CAROUSEL_NAV_RIGHT_ARROW}
                    disabled={isRightArrowDisabled}
                    size="sm"
                    type="icon"
                    color="default"
                    icon={FONT_ICON.ARROW_RIGHT_SMALL}
                    onPress={() => {
                        nextClick();
                    }}
                />
            </FlexBox>
        </Box>
    );
};

export default CarouselNav;
