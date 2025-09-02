import { Dimensions } from 'react-native';
import PixelRatio from 'react-native/Libraries/Utilities/PixelRatio';
import { isTablet } from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const isTabletDevice = isTablet();

export const setFont = (fontSize) => {
    const isLandscapeDevice = deviceWidth >= deviceHeight;
    //here i've neutralised the deviveWidth and deviceHeight by dividing with the respective pixel resolution of iphone 8, by which they designed the UI
    const scale = Math.min(deviceWidth / 375, deviceHeight / 667);
    const responsiveFont = PixelRatio.roundToNearestPixel(fontSize * scale);
    return isTabletDevice ? (isLandscapeDevice ? responsiveFont : responsiveFont * 0.72) : responsiveFont;
};

export const setFontWeb = (fontSize) => {
    const scale = Math.max(0.6, deviceWidth / 1920);
    const responsiveFont = Math.round(fontSize * scale);
    return responsiveFont;
};
