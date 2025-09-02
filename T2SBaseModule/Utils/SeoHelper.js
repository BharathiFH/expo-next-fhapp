import {
    boolValue,
    getCategoryNameFromUrl,
    isArrayNonEmpty,
    isCustomerApp,
    isFoodHubApp,
    isGroceryType,
    isValidArray,
    isValidElement,
    isValidString,
    makeFirstLetterUpperCase,
    safeIntValue
} from './helpers';
import {
    SEO_CONSTANTS,
    SEO_PAGES_CUSTOMER,
    SEO_PAGES_FRANCISE,
    SEO_CONSTANTS_GTM,
    QUERY_PARAM_PARSER,
    formatCategoryMetaTags,
    capitalizeFirstLetter,
    SEO_CUSTOM_CONSTANTS_CUSTOMER,
    SEO_CG_ADVERTISING_KEY,
    SEO_CONSTANTS_GROCERY,
    chatApplicableRoutes,
    SEO_SCRIPT_CONSTANTS,
    TAKEAWAY_TYPES,
    CUSTOM_SEO_CONSTANTS_FOR_NON_FOODHUB
} from './SeoConstant';
import { isDebugBuildType } from 't2sbasemodule/Utils/helpers';
import { getWebHost, isFlowers2You, isWeb } from '../../AppModules/BaseModule/GlobalAppHelper';
import QueryParamParser from '../../CustomerApp/NativeDependencies/QueryParamParser/QueryParamParser';
import { formatCategoryName } from '../../AppModules/MenuModule/Utils/MenuHelpers';
import { getMetaTagsWithDetails } from '../../FoodHubApp/FooterComponent/Utils/Helper';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { redirectURL } from '../../AppModules/RouterModule/Utils/Constants';
import { OPEN_HOURS_CONSTANTS, WEEKDAYS_NAME_SHORT_ARRAY } from '../UI/CustomUI/OpenHours/Utils/OpenHoursConstants';
import { timeConvertTo12HrFormat } from '../UI/CustomUI/OpenHours/Utils/OpenHoursHelper';
import { COMMON_TEXT, CUSTOM_META } from './Constants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { CHATBOT_KEY } from 'CustomerApp/Utils/AppConfig';
const isWebView = isWeb();
const isCustomer = isCustomerApp();
const isFoodhub = isFoodHubApp();

export const getGoogleAnalyticsContent = (gtmKey) => {
    return `(function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js"
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "${gtmKey}")`;
};

export const getFacebookPixelContent = (pixelKey) => {
    return `!(function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.defer = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    fbq("init", "${pixelKey}");
    fbq("track", "PageView")`;
};
export const zohoSales = (showNewChatbot) => {
    let chatKeyValue = isValidElement(showNewChatbot) && showNewChatbot ? CHATBOT_KEY.NEW_KEY : CHATBOT_KEY.OLD_KEY;
    return `
var $zoho = $zoho || {};
$zoho.salesiq = $zoho.salesiq || {
  widgetcode: "${chatKeyValue}",
  values: {},
  ready: function () {},
};
var d = document;
s = d.createElement("script");
s.type = "text/javascript";
s.id = "zsiqscript";
s.defer = true;
s.src = "https://salesiq.zoho.com/widget";
t = d.getElementsByTagName("script")[0];
t.parentNode.insertBefore(s, t);
$zoho.salesiq.afterReady = () => $zoho.salesiq.floatbutton.visible("hide");
`;
};

export const cgAdvertising = (val, currency, id) => {
    return `
    (function(w, d){
  
      var id="vpr-capture", n = "script"
  
      if (!d.getElementById(id)) {
  
        vpr = w.vpr || function() {(w.vpr.a = w.vpr.a || []).push(arguments);};
  
        var e = d.createElement(n); e.id = id; e.async=1
  
        e.src = "https://cdn.veritonic.com/static/vpr-eu.min.js"
  
        var s = d.getElementsByTagName(n)[0]
  
        s.parentNode.insertBefore(e, s)
  
      }
  
      vpr("veritonic_id", '${id}'); // this is the Veritonic ID associated with your brand
  
      vpr("gdpr", ""); 
      vpr('lead', { // this is the action you want to track

        // update your lead details below for each lead you want to track with this action
  
        value: 50.00,

        currency: '${currency}',
  
        type: 'subscriber',
  
        category: 'newsletter'
  
      });
  
    })(window, document);`;
};

export const addScriptDynamically = (attr, id, src) => {
    const existingScript = document.getElementById(id);
    if (existingScript) {
        return;
    }
    const script = document.createElement('script');
    Object.keys(attr).forEach((key) => {
        script[key] = attr[key] ? attr[key] : '';
    });
    if (isValidElement(src)) {
        script.src = src;
    }
    if (attr['data-handle']) {
        script.setAttribute('crossorigin', '');
        script.setAttribute('data-handle', 'foodhub');
        script.setAttribute('data-lazy', true);
    }
    document.head.appendChild(script);
};
export const getLinkDyncamically = (href, integrity) => {
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (!existingLink) {
        return `<link rel="stylesheet" crossorigin="anonymous" href="${href}" integrity="${integrity ?? ''}">`;
    }
};

export const convertGTM = (script = '') => {
    return /GTM-[^'"]+/.exec(script)?.[0];
};

export const getTagManager = (tag_manager, tag_manager_store, customerApp, initialConfigGtmKey) => {
    let gtm = null;
    if (customerApp && isValidString(tag_manager_store)) {
        if (tag_manager_store.includes(SEO_SCRIPT_CONSTANTS.PLAIN_GTM) || !tag_manager_store.includes(SEO_SCRIPT_CONSTANTS.SCRIPT)) {
            gtm = tag_manager_store;
        } else if (tag_manager_store.includes(SEO_SCRIPT_CONSTANTS.SCRIPT)) {
            gtm = convertGTM(tag_manager_store);
        }
    } else if (!customerApp && isValidString(tag_manager)) {
        gtm = tag_manager;
    }
    return gtm;
};

export const getSeoJson = (seoResponse, storeConfigResponse, routeName, category, url, itemName) => {
    let apiKey = isCustomer ? SEO_PAGES_CUSTOMER[routeName] : SEO_PAGES_FRANCISE[routeName];
    let seoData;
    let isCategoryAvailable = url?.includes(redirectURL.ORDER_NOW) && !url?.endsWith(redirectURL.ORDER_NOW);
    const currentWebHost = getWebHost();
    const customMetaDomain = CUSTOM_META.includes(currentWebHost);
    const isGrocery = isGroceryType(storeConfigResponse?.businessType);
    if (isWebView && isValidString(routeName)) {
        const webUrl = window.location.href ?? '';
        apiKey =
            webUrl.includes(COMMON_TEXT.LAT) &&
            webUrl.includes(COMMON_TEXT.LNG) &&
            routeName.toLowerCase() === SEO_PAGES_FRANCISE.LOCATION_AREA
                ? SEO_PAGES_FRANCISE.LOCATION
                : apiKey;
    }

    if (isCustomerApp()) {
        if (
            customMetaDomain &&
            (routeName === SCREEN_OPTIONS.MENU_SCREEN.route_name || routeName === SCREEN_OPTIONS.HOME_SCREEN.route_name)
        ) {
            seoData = { ...SEO_CUSTOM_CONSTANTS_CUSTOMER[routeName] };
        } else if (routeName == SCREEN_OPTIONS.NEW_MENU_ITEM_DETAIL_SCREEN.route_name && itemName) {
            seoData = storeConfigResponse?.seo_details?.item;
        } else if (isValidElement(storeConfigResponse?.seo_details?.[apiKey]) && !isCategoryAvailable) {
            seoData = storeConfigResponse.seo_details?.[apiKey];
        } else if (routeName === SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name) {
            seoData = getCategoryJson(null, category);
        }
    } else {
        if (isValidElement(seoResponse?.pages?.[apiKey])) {
            seoData = seoResponse.pages?.[apiKey];
            if (isGrocery && routeName === SCREEN_OPTIONS.MENU_SCREEN.route_name) {
                seoData = SEO_CONSTANTS_GROCERY[routeName];
            }
        }
    }
    if (!isFoodhub && isValidElement(CUSTOM_SEO_CONSTANTS_FOR_NON_FOODHUB?.[routeName])) {
        seoData = CUSTOM_SEO_CONSTANTS_FOR_NON_FOODHUB[routeName];
    }
    if (!isValidElement(seoData) && SEO_CONSTANTS[routeName]) {
        return SEO_CONSTANTS[routeName];
    }
    return seoData;
};

export const getCategoryJson = (category, categoryJson, categoryName) => {
    if (isWebView && isCustomer) {
        const getCategoryName = isValidElement(category) ? category : getCategoryNameFromUrl(categoryName);
        if (isValidElement(categoryJson?.[getCategoryName])) {
            return categoryJson?.[getCategoryName];
        } else {
            return categoryJson?.default;
        }
    } else {
        return null;
    }
};

const getMetaTagsFromCategory = (title, description, keywords) => {
    if (isWebView && isCustomer) {
        let url = window?.location?.href;
        document.title = capitalizeFirstLetter(title);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="og:keywords"]')?.setAttribute('content', keywords);
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
        document.querySelector("link[rel='canonical']")?.setAttribute('href', url);
    } else {
        return null;
    }
};

export const updateMetaTags = (town, name, category, categoryMetaTags) => {
    if (isWebView && isCustomer && categoryMetaTags) {
        let seoFriendlyCategory = formatCategoryName(category);
        const categoryData = getCategoryJson(seoFriendlyCategory, categoryMetaTags, category) ?? null;
        const isNotFromFallbackMetaTags = isValidElement(categoryMetaTags?.[seoFriendlyCategory]);
        const metaTags = isNotFromFallbackMetaTags
            ? getMetaTagsWithDetails(categoryData, town, null, name)
            : formatCategoryMetaTags(town, name, category, categoryData);
        if (isValidElement(metaTags)) {
            const { title, description, keywords } = metaTags;
            return getMetaTagsFromCategory(title, description, keywords);
        }
    } else {
        return null;
    }
};

export const handleSeo = (gtm, webmasterTools, facebookPixel, showNewChatbot) => {
    if (isWebView) {
        /* eslint-disable valid-typeof */
        if (
            isValidString(gtm) &&
            !isDebugBuildType() &&
            !(typeof window !== undefined && window.location?.search?.includes('prerendering'))
        ) {
            addScriptDynamically(
                {
                    text: gtm.includes(SEO_SCRIPT_CONSTANTS.PLAIN_GTM) ? gtm : getGoogleAnalyticsContent(gtm),
                    id: SEO_CONSTANTS_GTM.GOOGLE_ANALYTICS,
                    defer: true
                },
                SEO_CONSTANTS_GTM.GOOGLE_ANALYTICS
            );
        }
        /* eslint-enable valid-typeof */
        const urlPath = window?.location?.pathname;
        if (isValidElement(urlPath) && chatApplicableRoutes.some((str) => urlPath.includes(str))) {
            addScriptDynamically(
                {
                    text: zohoSales(showNewChatbot),
                    type: 'text/javascript',
                    id: SEO_CONSTANTS_GTM.ZSIQCHAT,
                    async: true
                },
                SEO_CONSTANTS_GTM.ZSIQCHAT
            );
        }
        const webMasterPresent = document.getElementsByName('google-site-verification');
        if (isValidString(webmasterTools) && webMasterPresent?.length < 1) {
            document.head.insertAdjacentHTML('beforeend', webmasterTools);
        }
        if (isValidString(facebookPixel) && !isDebugBuildType()) {
            addScriptDynamically(
                {
                    text: getFacebookPixelContent(facebookPixel),
                    id: SEO_CONSTANTS_GTM.FACEBOOK_PIXEL,
                    defer: true
                },
                SEO_CONSTANTS_GTM.FACEBOOK_PIXEL
            );
        }
    }
};

export const handleQueryParamParser = () => {
    if (window?.location?.search?.includes('rwg')) {
        addScriptDynamically(
            {
                text: QueryParamParser(),
                id: QUERY_PARAM_PARSER
            },
            QUERY_PARAM_PARSER
        );
    }
};

export function cleanupOpenHourTime(hourStart, hourEnd, format24Hrs = true) {
    let startTime = hourStart[0];
    let endTime = hourEnd[1];
    if (!format24Hrs) {
        startTime = timeConvertTo12HrFormat(startTime);
        endTime = timeConvertTo12HrFormat(endTime);
    }
    if (isValidElement(startTime) && isValidElement(endTime)) {
        return format24Hrs
            ? `${startTime}-${endTime}`
            : `${startTime?.convertedTime} ${startTime?.amPmStr}-${endTime?.convertedTime} ${endTime?.amPmStr}`;
    } else {
        return null;
    }
}

/**
 * if format24Hrs true
 * hourStart ["MON", "00:00", "-", "23:59"] lengthStart 3 returns  00:00-23:59
 * hourEnd ["00:00", "-", "23:59"] lengthStart 2 returns  00:00-23:59
 *
 * if format24Hrs false
 * hourStart ["MON", "00:00", "-", "23:59"] lengthStart 3 returns  12:00 AM-11:59 PM
 * hourEnd ["00:00", "-", "23:59"] lengthStart 2 returns  12:00 AM-11:59 PM
 *
 * returns null otherwise
 */
export function extractTimeFromString(timeString) {
    if (isValidString(timeString)) {
        let timeStringArray = timeString.split(' ');
        // "00:00 - 12:59"
        if (timeStringArray.length === 3) {
            return [timeStringArray[0], timeStringArray[2]];
        }
        // "MON 00:00 - 12:59"
        if (timeStringArray.length === 4) {
            return [timeStringArray[1], timeStringArray[3]];
        }
        // "MON 00:00-12:59"
        if (timeStringArray.length === 2) {
            if (timeStringArray[1]?.includes('-')) {
                let splitTimeString = timeStringArray[1].split('-');
                return [splitTimeString[0], splitTimeString[1]];
            }
        }
        // "00:00-12:59"
        if (timeStringArray.length === 1) {
            if (timeStringArray[0]?.includes('-')) {
                let splitTimeString = timeStringArray[0].split('-');
                return [splitTimeString[0], splitTimeString[1]];
            }
        }
    }

    return null;
}

/**
 * Our open hours records will be with day value or without day value example ["MON 00:00 - 23:59"] or ["00:00 - 23:59"] or ["CLOSED"]
 * we need to extract only the time value by splitting based on the spaces, need to ignore if CLOSED, if the shift is more than one for
 * a day we need to pick the opening time of the first shift and closing time of last shift.
 * */

export const processTimeRecords = (records) => {
    if (isValidArray(records) && records?.length > 0) {
        if (records?.length === 1 && records?.[0] === OPEN_HOURS_CONSTANTS.CLOSED) {
            return null;
        } else {
            let openHourStart = extractTimeFromString(records[0]);
            let openHourEnd = extractTimeFromString(records[records.length - 1]);
            if (openHourStart && openHourEnd) {
                return cleanupOpenHourTime(openHourStart, openHourEnd);
            }
        }
    }
    return null;
};

/**
 * Prioritising Delivery open hours data, if Delivery is closed, need to pick from Collection open hours data
 * expected output should be in following format
 * ['Mo 00:00-23:59', 'Tu 14:00-23:59', 'We 14:00-23:59', 'Fr 00:00-23:59', 'Sa 00:00-23:59', 'Su 00:00-23:59']
 * returning so the schema will neglect the openHours key as the key is optional
 * */
export const constructOpenHours = (data) => {
    if (isValidElement(data)) {
        const { opening_hours, show_delivery, show_collection } = data || {};
        const { Collection, Delivery } = opening_hours?.advanced || {};
        const hoursData = show_delivery ? Delivery : show_collection ? Collection : null;
        if (isValidElement(hoursData)) {
            let formattedOpenHoursData = [];
            for (const dayName of WEEKDAYS_NAME_SHORT_ARRAY) {
                const dataDayName = makeFirstLetterUpperCase(dayName?.slice(0, -1));
                const timeString = processTimeRecords(hoursData?.[dayName]);
                isValidElement(timeString) && formattedOpenHoursData.push(`${dataDayName} ${timeString}`);
            }
            return isArrayNonEmpty(formattedOpenHoursData) ? formattedOpenHoursData : undefined;
        }
    } else {
        return undefined;
    }
};
export function getRandomElementsWithImages(obj, num = 0) {
    const keys = [];
    for (const key in obj) {
        if (isValidString(obj[key].image) && isValidString(obj[key].name)) {
            keys.push(obj[key]);
        }
    }
    const shuffled = keys.sort(() => 0.5 - Math.random());
    return num === 0 ? shuffled : shuffled.slice(0, num);
}

export const handlecgadvertising = (val, currency, key) => {
    const validKey = isValidString(key) ? key : SEO_CG_ADVERTISING_KEY;
    if (isValidString(validKey) && isWebView) {
        addScriptDynamically(
            {
                text: cgAdvertising(val, currency, validKey),
                id: SEO_CONSTANTS_GTM.CG_ADVERTISING
            },
            SEO_CONSTANTS_GTM.CG_ADVERTISING
        );
    }
};

export const getThirdPartyData = (initialConfigWeb, storeConfigResponse) => {
    let seoGtm,
        facebookPixel,
        webmasterTools,
        tagManager,
        analyticsGtm,
        chatData = {};
    if (isCustomer && isValidElement(storeConfigResponse)) {
        const { webmaster_tools, facebook_pixel_id, tag_manager } = storeConfigResponse;
        facebookPixel = facebook_pixel_id;
        webmasterTools = webmaster_tools;
        tagManager = tag_manager;
    } else if (!isCustomer && isValidElement(initialConfigWeb)) {
        const { seo, chat, analytics } = initialConfigWeb;
        seoGtm = seo?.gtm;
        facebookPixel = seo?.facebookPixel;
        webmasterTools = seo?.webmasterTools;
        analyticsGtm = analytics?.gtm;
        chatData = chat;
    }
    const gtm = getTagManager(seoGtm, tagManager, isCustomer, analyticsGtm);

    return {
        gtm,
        facebookPixel,
        webmasterTools,
        chat: chatData
    };
};

export const getParams = (url) => {
    const queryString = url?.split?.('?')?.[1];
    if (!queryString) {
        return {};
    }
    return queryString?.split('&')?.reduce((params, pair) => {
        const [key, value] = (pair && pair.split('=')) || [];
        params[decodeURIComponent(key)] = decodeURIComponent(value);
        return params;
    }, {});
};

export const getSeoFriendlyBrandName = (brandNameFromReducer, brandNameFromRoute) => {
    let brand_name = (isValidString(brandNameFromReducer) ? brandNameFromReducer : brandNameFromRoute?.replaceAll('-', ' ')) ?? '';
    return isValidString(brand_name) ? brand_name : '';
};

export const formatOrderNowSeoContents = (content = '', storeConfig = {}) => {
    const {
        name = '',
        town = '',
        postcode = '',
        brand = '',
        cuisines = [],
        show_collection,
        show_delivery,
        advanced_discounts = []
    } = storeConfig ?? {};

    const cuisineList = cuisines?.map((c) => c?.name).join(', ') || '';
    const maxAdvancedDiscount = isArrayNonEmpty(advanced_discounts)
        ? Math.max(...advanced_discounts.map((d) => safeIntValue(d?.value)))
        : 0;
    const offer = maxAdvancedDiscount > 0 ? `${isValidString(brand) ? 'with' : 'at'} ${maxAdvancedDiscount}% off` : 'anytime';
    const orderTypes =
        boolValue(show_delivery) && boolValue(show_collection)
            ? ORDER_TYPE.COLLECTION_AND_DELIVERY
            : boolValue(show_collection)
            ? ORDER_TYPE.PICKUP
            : ORDER_TYPE.DELIVERY;
    let formatted = content;

    if (!cuisineList) {
        formatted = formatted.replace(/\?\s*[^.?!]*<cuisines>[^.?!]*\.\s*/gi, '? ');
    }

    formatted = formatted
        .replace(/<takeaway name>/g, name)
        .replace(/<takeaway town>/g, town)
        .replace(/<brand Name>/g, brand)
        .replace(/<cuisines>/g, cuisineList)
        .replace(/<order types>/g, orderTypes)
        .replace(/<offer>/g, offer);
    return postcode ? formatted.replace(/<postcode>/g, `, ${postcode}`) : formatted.replace(/,?\s*<postcode>/g, '');
};

export const getOrderNowSeoContent = (storeConfigResponse = {}, dynamicSeoContents = {}) => {
    const { brand = '', businessType = '' } = storeConfigResponse ?? {};
    const business_type = businessType?.toLowerCase();
    const seoKey = isValidString(brand) ? TAKEAWAY_TYPES.BRAND : isFlowers2You() ? TAKEAWAY_TYPES.FLOWERS_2_YOU : business_type;
    const seoContent = dynamicSeoContents?.[seoKey];
    if (!isValidElement(seoContent)) {
        return { title: '', description: '' };
    }
    return {
        title: formatOrderNowSeoContents(seoContent.title, storeConfigResponse),
        description: formatOrderNowSeoContents(seoContent.description, storeConfigResponse)
    };
};
