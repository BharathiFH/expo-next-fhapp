import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

const BlurFill = ({ blurColor, children, onPress }) => {
    const styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFill
        },
        blur: {
            ...StyleSheet.absoluteFill,
            backgroundColor: blurColor,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.blur}>{children}</View>
        </Pressable>
    );
};

export default BlurFill;
