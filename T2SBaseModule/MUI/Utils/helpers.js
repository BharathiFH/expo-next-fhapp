import { PixelRatio } from 'react-native';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import T2SResponsiveStyle from '../../UI/CommonUI/Style/T2SResponsiveStyle';

/**
 * Generates responsive styles based on the provided prop and value for different screen sizes.
 * @param {string} prop - The property to apply the value to.
 * @param {object} value - An object containing values for different screen sizes.
 * @returns {object} - An object containing the configured responsive styles.
 */
export const getResponsiveStyles = (prop, value) => {
    const isNumber = typeof value === 'number';
    const { sm, md, lg, xl } = isNumber ? { sm: value, md: value, lg: value, xl: value } : value || {};

    // Define the styles for different screen sizes
    const screenStyles = {
        defaultStyle: { res: { [prop]: sm } },
        tabletPortraitStyle: { res: { [prop]: md } },
        tabletLandscapeStyle: { res: { [prop]: lg } },
        webStyle: { res: { [prop]: sm } },
        webSmallScreenStyle: { res: { [prop]: sm } },
        webTabletPortraitStyle: { res: { [prop]: md } },
        webTabletLandscapeStyle: { res: { [prop]: lg } },
        webLargeScreenStyle: { res: { [prop]: xl } }
    };

    // Create a T2SResponsiveStyle instance with the defined screen styles
    const style = new T2SResponsiveStyle(screenStyles);
    return { style };
};

export const scaleFont = (fontSize) => {
    const scale = PixelRatio.getFontScale();
    return fontSize * scale;
};

export const convertToSixDigit = (hex) => {
    // Check if the hex string is in 3-digit format
    if (hex.length === 4 && hex[0] === '#' && /^[0-9A-Fa-f]{3}$/.test(hex.substring(1))) {
        // Extract each digit and duplicate it
        return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex;
};

export const hexToRgba = (hex, alpha = 1) => {
    if (!isValidString(hex)) {
        return null;
    }
    hex = convertToSixDigit(hex);
    hex = hex.replace(/^#/, '');

    const [r, g, b] = hex.match(/.{1,2}/g).map((value) => parseInt(value, 16));

    alpha = Math.min(1, alpha);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getTextColor = (backgroundColor, Colors) => {
    if (isValidString(backgroundColor)) {
        const isPureWhite = backgroundColor === '#fff' || backgroundColor === '#ffffff';
        const isPureBlack = backgroundColor === '#000' || backgroundColor === '#000000';
        const rgb = parseInt(backgroundColor.slice(1), 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = (rgb >> 0) & 255;
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return brightness > 0.62 || (isPureWhite && !isPureBlack) ? Colors.defaultBlack : Colors.defaultWhite;
    } else {
        return Colors.black;
    }
};
