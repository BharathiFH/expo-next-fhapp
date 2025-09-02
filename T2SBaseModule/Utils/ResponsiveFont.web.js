import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const mobileScale = Math.max(Math.min(width / 375, height / 667, 1.25), 1);
const webScale = Math.max(0.6, width / 1920);

const calculateFontSize = (fontSize, scale) => {
    return Math.round(fontSize * scale);
};

export const setFont = (fontSize) => calculateFontSize(fontSize, mobileScale);

export const setFontWeb = (fontSize) => calculateFontSize(fontSize, webScale);
