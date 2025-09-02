import { StyleSheet } from 'react-native';
import { isWeb } from '../../../../AppModules/BaseModule/GlobalAppHelper';
import { isValidElement } from '../../../Utils/helpers';

const isDeviceWeb = isWeb();

/**
 *
 * @param defaultStyle
 defaultStyle is common for all platforms, if the style is same for mobile app and web app and same for all dimensions of web we can put the style in mobile style.

 * @param tabletPortraitStyle
  tabletPortraitStyle is for portrait mode in tablet view, this will override mobile style and if style is common for mobile app tablet and web app app portrait
  we can put in tabletPortraitStyle.

 * @param tabletLandscapeStyle
  tabletLandscapeStyle is for landscape mode, this will override defaultStyle, if we have common style same for mobile app landscape, web app landscape and web app
  largeScreen we can put the style in tabletLandscapeStyle.

 * @param webStyle
   webStyle is for if we want style only for web not for mobile app this will basically override defaultStyle, and style is common for all web dimension modes than we
  can place our style in webStyle.

 * @param webLargeScreenStyle
  webLargeScreenStyle is for web app when we want specific style only for web largeScreen dimension than we can place it here, this will usually override defaultStyle and
  webStyle.

 * @param webTabletLandscapeStyle
  webTabletLandscapeStyle is for web app when we want any specific style only in web landscape mode than we can place it here, this will usually override defaultStyle,
  webStyle and tabletLandscapeStyle.

 * @param webTabletPortraitStyle
  webTabletPortraitStyle is for web app when we want any specific style only for web in tablet portrait mode than we can place it here, this will usually override
 defaultStyle, webStyle and tabletPortraitStyle.

 * @param webSmallScreenStyle
  webSmallScreenStyle is for web app when we want any specific style only for web in small screen mode than we can place it here, this will usually override defaultStyle,
  webStyle.

 */
function T2SResponsiveStyle({
    defaultStyle,
    tabletPortraitStyle,
    tabletLandscapeStyle,
    webStyle,
    webLargeScreenStyle,
    webTabletLandscapeStyle,
    webTabletPortraitStyle,
    webSmallScreenStyle
}) {
    this.setViewMode = (viewMode) => {
        if (this.lastViewMode === viewMode && isValidElement(this.style)) {
            return this.style;
        }
        this.lastViewMode = viewMode;
        let styles;
        if (isDeviceWeb) {
            if (viewMode?.isLargeScreenMode) {
                styles = {
                    ...defaultStyle,
                    ...webStyle,
                    ...tabletLandscapeStyle,
                    ...webTabletLandscapeStyle,
                    ...webLargeScreenStyle
                };
            } else if (viewMode?.isTabletLandscapeMode) {
                styles = {
                    ...defaultStyle,
                    ...webStyle,
                    ...tabletLandscapeStyle,
                    ...webTabletLandscapeStyle
                };
            } else if (viewMode?.isTabletPortraitMode) {
                styles = {
                    ...defaultStyle,
                    ...webStyle,
                    ...tabletPortraitStyle,
                    ...webTabletPortraitStyle
                };
            } else if (viewMode?.isSmallScreenMode) {
                styles = {
                    ...defaultStyle,
                    ...webStyle,
                    ...webSmallScreenStyle
                };
            } else {
                styles = {
                    ...defaultStyle,
                    ...webStyle
                };
            }
        } else {
            //in large screen tablet device, mode is set as largeScreenMode. Hence, added
            if (viewMode?.isLargeScreenMode) {
                styles = {
                    ...defaultStyle,
                    ...tabletLandscapeStyle
                };
            } else if (viewMode?.isTabletPortraitMode) {
                styles = { ...defaultStyle, ...tabletPortraitStyle };
            } else if (viewMode?.isTabletLandscapeMode) {
                styles = { ...defaultStyle, ...tabletLandscapeStyle };
            } else {
                styles = { ...defaultStyle };
            }
        }
        this.style = StyleSheet.create(styles);
        return this.style;
    };

    return this;
}
export default T2SResponsiveStyle;
