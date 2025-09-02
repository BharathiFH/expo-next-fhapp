import React, { useMemo } from 'react';
import FlexBox from './FlexBox';
import Box from './Box';
import { useColorScheme } from 'react-native';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const getActiveDotIndex = (activeSlide, totalSlide) => {
    if (activeSlide === 1) {
        return 0;
    } else if (activeSlide === totalSlide && totalSlide > 2) {
        return 2;
    } else if (activeSlide === totalSlide && totalSlide === 2) {
        return 1;
    } else {
        return 1;
    }
};

const AnimatedDot = ({ isActive, activeColor, defaultColor, activeSlide, totalSlide }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: 6,
            backgroundColor: withTiming(isActive ? activeColor : defaultColor, {
                duration: 300,
                easing: Easing.inOut(Easing.ease)
            }),
            marginHorizontal: 3,
            borderRadius: 6,
            minWidth: 6
        };
    }, [isActive, activeColor, defaultColor]);

    return <Animated.View style={animatedStyle} />;
};

const CarouselDots = (props) => {
    const { totalSlide = 1, color = 'greyDark', activeColor = 'dark', activeSlide = 0 } = props;
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const defaultColor = Colors?.[color];
    const active = Colors?.[activeColor];
    const activeDotIndex = getActiveDotIndex(activeSlide, totalSlide);
    const totalDots = totalSlide < 3 ? 2 : 3;

    const dots = useMemo(() => {
        return [...Array(totalDots)].map((_, i) => {
            const isActive = activeDotIndex === i;
            return (
                <AnimatedDot
                    key={i}
                    isActive={isActive}
                    activeColor={active}
                    defaultColor={defaultColor}
                    activeSlide={activeSlide}
                    totalSlide={totalSlide}
                />
            );
        });
    }, [totalDots, activeDotIndex, active, defaultColor, activeSlide, totalSlide]);

    return (
        <Box position={'absolute'} bottom={-16} right={0} left={0} mt={'sm'}>
            <FlexBox alignItems={'center'} justifyContent={'center'}>
                {dots}
            </FlexBox>
        </Box>
    );
};

export default CarouselDots;
