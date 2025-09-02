import React, { useMemo, useEffect, useRef } from 'react';
import { Modal as LegacyModal, View, Animated, StyleSheet, Easing, useColorScheme } from 'react-native';
import { getColorSchemeColors } from 'appmodules/BaseModule/Helper';
import { bodyScroll } from 't2sbasemodule/Utils/StyleHelper';
import Card from './Card';
import BlurFill from './BlurFill';
import Box from './Box';
import Heading from './Heading';
import T2SStatusBar from '../UI/CommonUI/T2SStatusBar';

const BottomSheet = (props) => {
    const { title, children } = props;
    const colorScheme = useColorScheme();
    const Colors = useMemo(() => getColorSchemeColors(colorScheme), [colorScheme]);
    // Define styles for the button element using StyleSheet
    // const styles = useMemo(() => StyleSheet.create({}), []);
    const translateY = useRef(new Animated.Value(50)).current;
    const opacityValue = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        props.visible && bodyScroll('hidden', true);
        return () => {
            props.visible && bodyScroll('unset', true);
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const translateAnimation = Animated.timing(translateY, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
        });

        const opacityAnimation = Animated.timing(opacityValue, {
            toValue: 1,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
        });

        Animated.parallel([translateAnimation, opacityAnimation]).start();
    }, [opacityValue, translateY]);

    const styles = StyleSheet.create({
        sheetHeader: {
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 9,
            elevation: 9
        },
        sheet: {
            position: 'absolute',
            width: '100%',
            bottom: 0
        }
    });

    const sheetHeader = () => (
        <Box p="md" style={styles.sheetHeader}>
            <Heading level={6} spacing={'none'} align="center" size={'h6'}>
                {title}
            </Heading>
        </Box>
    );

    const sheetContent = () => <Box p="md">{children}</Box>;

    return (
        <LegacyModal {...props}>
            <T2SStatusBar isModal={true} />
            <BlurFill onPress={props.onRequestClose} blurType="dark" blurColor={Colors.overlay} blurAmount={10} />
            <View style={styles.sheet}>
                <Animated.View style={{ transform: [{ translateY: translateY }] }}>
                    <Card disableBottomRadius={true} p="none">
                        {sheetHeader()}
                        {sheetContent()}
                    </Card>
                </Animated.View>
            </View>
        </LegacyModal>
    );
};

export default BottomSheet;
