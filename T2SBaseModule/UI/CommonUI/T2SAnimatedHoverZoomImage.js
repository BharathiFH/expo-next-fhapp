import React, { useCallback, useMemo, useRef, useState, memo } from 'react';
import { Animated, View } from 'react-native';
import T2STouchableOpacity from './T2STouchableOpacity';
import { VIEW_ID } from 'appmodules/MenuModule/Utils/MenuConstants';
import { getMenuImageResolutionChange } from 'appmodules/BaseModule/GlobalAppHelper';

const IMAGE_HEIGHT = 10;
const T2SAnimatedHoverZoomImage = memo(
    ({ styles, imageUrl, width, height, showFullImage = false, handleSelectedItem }) => {
        const [scaleAnim] = useState(() => new Animated.Value(1));
        const [translate] = useState(() => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0)
        }));
        const isZoomingRef = useRef(false);
        const imageContainerRef = useRef(null);
        const lastMousePosition = useRef({ x: 0, y: 0 });
        const animationConfig = useMemo(
            () => ({
                useNativeDriver: true,
                friction: 8,
                tension: 40
            }),
            []
        );

        const handleMouseMove = useCallback(
            (e) => {
                if (!imageContainerRef.current) return;

                const rect = imageContainerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Only update if mouse position has changed significantly (more than 5 pixels)
                if (Math.abs(x - lastMousePosition.current.x) < 5 && Math.abs(y - lastMousePosition.current.y) < 5) {
                    return;
                }

                lastMousePosition.current = { x, y };

                // Calculate the center point of the container
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate the distance from cursor to center
                const distanceX = x - centerX;
                const distanceY = y - centerY;

                // Get current scale
                const currentScale = scaleAnim._value;

                // Calculate maximum allowed translation based on current scale
                const maxTranslateX = (rect.width * (currentScale - 1)) / 2;
                const maxTranslateY = (rect.height * (currentScale - 1)) / 2;

                // Calculate new translation values
                const newTranslateX = (-distanceX * (currentScale - 1)) / currentScale;
                const newTranslateY = (-distanceY * (currentScale - 1)) / currentScale;

                // Clamp the translation values
                const clampedTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX));
                const clampedTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY));

                // Update translation with animation
                Animated.parallel([
                    Animated.spring(translate.x, {
                        toValue: clampedTranslateX,
                        ...animationConfig
                    }),
                    Animated.spring(translate.y, {
                        toValue: clampedTranslateY,
                        ...animationConfig
                    })
                ]).start();

                // Start zooming if not already zooming
                if (!isZoomingRef.current) {
                    isZoomingRef.current = true;
                    Animated.spring(scaleAnim, {
                        toValue: 2,
                        ...animationConfig
                    }).start();
                }
            },
            [scaleAnim, translate, animationConfig]
        );

        const handleFullImageClick = useCallback(
            (imageUrl) => {
                if (showFullImage) {
                    handleSelectedItem(imageUrl);
                }
            },
            [showFullImage, handleSelectedItem]
        );

        const onMouseLeave = useCallback(() => {
            isZoomingRef.current = false;
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    ...animationConfig
                }),
                Animated.spring(translate.x, {
                    toValue: 0,
                    ...animationConfig
                }),
                Animated.spring(translate.y, {
                    toValue: 0,
                    ...animationConfig
                })
            ]).start();
        }, [scaleAnim, translate, animationConfig]);

        return (
            <View
                ref={imageContainerRef}
                style={[
                    styles.itemImageContainerStyle,
                    {
                        width,
                        height: height + IMAGE_HEIGHT,
                        overflow: 'hidden',
                        borderRadius: 10
                    }
                ]}
                onMouseMove={handleMouseMove}
                onMouseLeave={onMouseLeave}>
                <T2STouchableOpacity webID={VIEW_ID.ITEM_HEADER_IMAGE} onPress={() => handleFullImageClick(imageUrl)}>
                    <Animated.Image
                        source={{ uri: getMenuImageResolutionChange(imageUrl) }}
                        style={[
                            styles.itemImage,
                            styles.twoColumnItemImageStyle,
                            {
                                width,
                                height,
                                transform: [{ scale: scaleAnim }, { translateX: translate.x }, { translateY: translate.y }]
                            }
                        ]}
                        resizeMode="cover"
                    />
                </T2STouchableOpacity>
            </View>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.imageUrl === nextProps.imageUrl &&
            prevProps.width === nextProps.width &&
            prevProps.height === nextProps.height &&
            prevProps.showFullImage === nextProps.showFullImage &&
            prevProps.handleSelectedItem === nextProps.handleSelectedItem
        );
    }
);

export default T2SAnimatedHoverZoomImage;
