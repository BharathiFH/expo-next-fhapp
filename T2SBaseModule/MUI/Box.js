import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './Utils/context';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

const Box = (props) => {
    const { elevation, ...boxProps } = props;
    const {
        direction,
        fullHeight = false,
        height,
        minHeight,
        minWidth,
        position,
        width,
        top,
        bottom,
        right,
        left,
        zIndex,
        screenName,
        id,
        webID,
        style,
        onPress,
        children
    } = props;
    const theme = useTheme();
    const {
        [props.p]: padding,
        [props.px]: paddingHorizontal,
        [props.py]: paddingVertical,
        [props.pt]: paddingTop,
        [props.pb]: paddingBottom,
        [props.pl]: paddingLeft,
        [props.pr]: paddingRight,
        [props.m]: margin,
        [props.my]: marginVertical,
        [props.mx]: marginHorizontal,
        [props.mt]: marginTop,
        [props.mb]: marginBottom,
        [props.mr]: marginRight,
        [props.ml]: marginLeft
    } = theme.spacing;

    const styles = useMemo(() => {
        return StyleSheet.create({
            box: {
                flexDirection: direction,
                padding: padding,
                paddingVertical: paddingVertical,
                paddingHorizontal: paddingHorizontal,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
                margin: margin,
                marginVertical: marginVertical,
                marginHorizontal: marginHorizontal,
                marginTop: marginTop,
                marginBottom: marginBottom,
                marginRight: marginRight,
                marginLeft: marginLeft,
                height: fullHeight ? '100%' : height,
                width: width,
                right: right,
                left: left,
                position: position,
                minHeight: minHeight,
                minWidth: minWidth,
                top: top,
                bottom: bottom,
                zIndex: zIndex,
                ...style
            }
        });
    }, [
        direction,
        fullHeight,
        height,
        margin,
        marginBottom,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginTop,
        marginVertical,
        padding,
        paddingBottom,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingVertical,
        position,
        minHeight,
        minWidth,
        style,
        top,
        bottom,
        right,
        left,
        width,
        zIndex
    ]);

    const RenderComponent = onPress ? TouchableOpacity : View;

    return (
        <RenderComponent {...boxProps} activeOpacity={0.5} onPress={onPress} style={styles.box} {...setTestId(screenName, id, webID)}>
            {children}
        </RenderComponent>
    );
};

export default React.memo(Box);
