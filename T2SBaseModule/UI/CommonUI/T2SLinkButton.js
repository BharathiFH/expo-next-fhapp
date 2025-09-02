import React, { useCallback, useState, useEffect } from 'react';
import { useLinkProps } from '@react-navigation/native';
import { View, Platform, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { BUTTON_TYPE } from '../../../CustomerApp/Utils/AppContants';
import { T2STouchableNativeFeedback } from 't2sbasemodule/UI';
import T2STouchableWithoutFeedback from './T2STouchableWithoutFeedback';
import Colors from 't2sbasemodule/Themes/Colors';
import { isValidString } from '../../Utils/helpers';

const isWeb = Platform.OS === 'web';

const T2SLinkButton = ({ isHoverEnable = false, to, action, children, buttonType, overrideLinkStyle = {}, screenReaderOnly, ...rest }) => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        return () => {
            setIsHovered(false);
        };
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const { onPress, ...props } = useLinkProps({ to, action });

    const handleWebCallback = useCallback(
        (e) => {
            e.preventDefault();
            setIsHovered(false);
            action(e);
        },
        [action]
    );

    const isLightBackground = Colors.navbarMenuTextColor === Colors.defaultBlack;
    const hoverColor = isLightBackground ? styles.linkHoverDark : styles.linkHoverLight;
    const BtnText = () => {
        return (
            <View style={StyleSheet.flatten([styles.linkStyle, isHovered && hoverColor, overrideLinkStyle])}>
                {screenReaderOnly ? (
                    <>
                        <Text style={styles.screenReaderOnly}>{screenReaderOnly}</Text>
                    </>
                ) : null}
                <Text style={styles.linkText}>{children}</Text>
            </View>
        );
    };
    return isWeb ? (
        isHoverEnable ? (
            <T2STouchableOpacity
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPress={handleWebCallback}
                href={isValidString(props.href) ? props.href : '/'}
                {...rest}>
                <BtnText screenReaderOnly />
            </T2STouchableOpacity>
        ) : (
            <T2STouchableOpacity onPress={handleWebCallback} href={isValidString(props.href) ? props.href : '/'} {...rest}>
                {children}
            </T2STouchableOpacity>
        )
    ) : buttonType === BUTTON_TYPE.T2S_TOUCHABLE_NATIVE_FEEDBACK ? (
        <T2STouchableNativeFeedback onPress={action} {...rest}>
            {children}
        </T2STouchableNativeFeedback>
    ) : buttonType === BUTTON_TYPE.T2S_TOUCHABLE_WITHOUT_NATIVE_FEEDBACK ? (
        <T2STouchableWithoutFeedback onPress={action} {...rest}>
            {children}
        </T2STouchableWithoutFeedback>
    ) : (
        <T2STouchableOpacity onPress={action} {...rest}>
            {children}
        </T2STouchableOpacity>
    );
};
T2SLinkButton.propType = {
    to: PropTypes.string.isRequired,
    buttonType: PropTypes.string.isRequired
};
T2SLinkButton.defaultProps = {
    buttonType: BUTTON_TYPE.T2S_TOUCHABLE_OPACITY
};

const styles = StyleSheet.create({
    linkStyle: {
        lineHeight: 1.75,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-start',
        borderRadius: 50,
        transition: '0.2s all ease-in-out',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'relative',
        overflow: 'hidden'
    },
    linkHoverDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
    },
    linkHoverLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    linkText: {
        fontSize: 13,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'
    },
    screenReaderOnly: {
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0
    }
});

export default T2SLinkButton;
