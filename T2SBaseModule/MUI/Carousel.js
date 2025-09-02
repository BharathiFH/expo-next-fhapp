import React, { useCallback, useState, useRef } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { useTheme } from './Utils/context';
import Box from './Box';
import CarouselNav from './CarouselNav';

const screenWidth = Dimensions.get('window').width;
const CarouselComponent = React.memo(
    ({ screenName, data, gutter = 'sm', noOfSlide = 2, renderSlide, showNav = true, showDots = true }) => {
        const [carouselWidth, setCarouselWidth] = useState(0);
        const [scrollPosition, setScrollPosition] = useState({ isStart: true, isEnd: false });
        const [currentIndex, setCurrentIndex] = useState(0);
        const carouselRef = useRef(null);
        const theme = useTheme();
        const gutterSpacing = theme.spacing[gutter];
        const handleCarouselWidth = (event) => setCarouselWidth(event.nativeEvent.layout.width);
        const slideWidth = carouselWidth / noOfSlide;

        const slideItem = useCallback(
            (item, index) => {
                return (
                    <Box width={slideWidth} px={gutter} accessible={true} accessibilityLabel={`${item.name}`} accessibilityRole={'button'}>
                        {renderSlide(item, index)}
                    </Box>
                );
            },
            [slideWidth, gutter, renderSlide]
        );

        const prevClick = useCallback(() => {
            if (currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);
                carouselRef.current?.scrollToOffset({
                    offset: prevIndex * slideWidth,
                    animated: true
                });
            }
        }, [currentIndex, slideWidth]);

        const nextClick = useCallback(() => {
            if (currentIndex < data?.length - noOfSlide) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                carouselRef.current?.scrollToOffset({
                    offset: nextIndex * slideWidth,
                    animated: true
                });
            }
        }, [currentIndex, data?.length, noOfSlide, slideWidth]);

        const handleScroll = (event) => {
            const offset = event.nativeEvent.contentOffset.x;
            const contentWidth = event.nativeEvent.contentSize.width;
            const newIndex = Math.round(offset / slideWidth);
            setScrollPosition({ isStart: offset === 0, isEnd: offset !== 0 && offset + screenWidth >= contentWidth });
            setCurrentIndex(newIndex);
        };

        return (
            <Box>
                <Box screenName={screenName} onLayout={handleCarouselWidth} style={{ marginHorizontal: -gutterSpacing }}>
                    {slideWidth > 0 ? (
                        <FlatList
                            ref={carouselRef}
                            data={data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            pagingEnabled
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            renderItem={(item, index) => slideItem(item, index)}
                            keyExtractor={(item, index) => index}
                        />
                    ) : null}
                </Box>
                {showNav && data?.length > noOfSlide ? (
                    <CarouselNav
                        screenName={screenName}
                        prevClick={prevClick}
                        nextClick={nextClick}
                        isLeftArrowDisabled={scrollPosition.isStart}
                        isRightArrowDisabled={scrollPosition.isEnd}
                    />
                ) : null}
            </Box>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.data?.length === nextProps.data?.length &&
            prevProps.gutter === nextProps.gutter &&
            prevProps.noOfSlide === nextProps.noOfSlide &&
            prevProps.screenName === nextProps.screenName &&
            prevProps.renderSlide === nextProps.renderSlide &&
            prevProps.showNav === nextProps.showNav
        );
    }
);

export default CarouselComponent;
export { CarouselComponent as Carousel };
