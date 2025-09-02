import React, { useCallback, useMemo, useState } from 'react';
import { Image as Img, StyleSheet, useColorScheme, View } from 'react-native';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { useTheme } from './Utils/context';

const Image = (props) => {
    const {
        screenName,
        dynamicBorder = false,
        bordered = false,
        borderWidth = 1,
        borderColor = 'borderColor',
        id,
        height,
        width,
        resizeMode,
        radius = 'none',
        source,
        style,
        makeResponsive = false,
        srcUrl = ''
    } = props;
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    const bordercolor = Colors[borderColor];
    const [imageHeight, setImageHeight] = useState(null);

    // Define styles for the button element
    const componentStyles = useMemo(() => {
        const borderRadius = theme?.borderRadius[radius];
        const borderSize = bordered || dynamicBorder ? borderWidth : 0;
        return {
            borderRadius,
            borderSize
        };
    }, [theme, radius, bordered, dynamicBorder, borderWidth]);

    const getDynamicWidth = useCallback(
        (layout) => {
            let viewWidth = layout.width;
            Img.getSize(
                srcUrl,
                (width, height) => {
                    const aspectRatio = height / width;
                    const calculatedHeight = viewWidth * aspectRatio;
                    setImageHeight(calculatedHeight);
                },
                (error) => {
                    console.log('error', error);
                }
            );
        },
        [srcUrl]
    );
    const styles = useMemo(() => {
        return StyleSheet.create({
            img: {
                width: width,
                height: makeResponsive ? imageHeight ?? height : height,
                borderWidth: componentStyles?.borderSize,
                borderRadius: componentStyles?.borderRadius,
                borderColor: bordercolor,
                ...style
            }
        });
    }, [width, height, componentStyles, bordercolor, style, makeResponsive, imageHeight]);

    const imageTag = <Img {...props} style={styles.img} resizeMode={resizeMode} source={source} {...setTestId(screenName, id)} />;
    if (makeResponsive) {
        return (
            <View
                onLayout={(event) => {
                    getDynamicWidth(event.nativeEvent.layout);
                }}>
                {imageTag}
            </View>
        );
    }
    return imageTag;
};

function propCheck(prevProps, nextProps) {
    return (
        prevProps.height === nextProps.height &&
        prevProps.width === nextProps.width &&
        prevProps.id === nextProps.id &&
        prevProps.screenName === nextProps.screenName &&
        prevProps.source === nextProps.source &&
        prevProps.makeResponsive === prevProps.makeResponsive &&
        prevProps.srcUrl === prevProps.srcUrl
    );
}

export default React.memo(Image, propCheck);
