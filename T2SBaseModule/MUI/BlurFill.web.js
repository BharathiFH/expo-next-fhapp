import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const BlurFill = ({ blurColor, onPress }) => {
    const styles = StyleSheet.create({
        blur: {
            ...StyleSheet.absoluteFill,
            backgroundColor: blurColor,
            backdropFilter: 'blur(5px)',
            zIndex: -1
        }
    });
    return <Pressable onPress={onPress} style={styles.blur} />;
};

export default BlurFill;
