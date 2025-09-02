import { getWebHost } from '../../AppModules/BaseModule/GlobalAppHelper';
import { FRANCHISE_NAME } from '../../AppModules/ConfiguratorModule/Utils/ConfiguratorAutomationConstants';
import { formatCategoryName } from '../../AppModules/MenuModule/Utils/MenuHelpers';
import { ROUTER_LIST_IDENTIFIER } from '../../AppModules/RouterModule/Utils/Constants';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { cuisinesList } from '../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { LOCAL_SCHEMA } from './Constants';
import { schemaId } from './SeoConstant';
import { constructOpenHours, getRandomElementsWithImages } from './SeoHelper';
import {
    addSchemaToHead,
    generateSameAs,
    isArrayNonEmpty,
    isCustomerApp,
    isFoodHubApp,
    isValidArray,
    isValidElement,
    isValidString,
    localSchema,
    makeFirstLetterUpperCase,
    seoFriendlyUrl
} from './helpers';
import { Platform } from 'react-native';

const isWebDevice = Platform.OS === 'web';
const host = getWebHost();
const isBigfoodie = host?.includes(FRANCHISE_NAME.BF);
const franchiseNameFromHost = host?.split('.')?.[0];
export const debugGTM = 'GTM-K2BFB35';
export const schemaOrgUrl = 'https://schema.org';

export const SCHEMA_CONSTANTS = {
    INFO: { url: 'info', title: 'Info' },
    FR_REVIEW: { url: 'reviews', title: 'Reviews' },
    CA_REVIEW: { url: 'review', title: 'Reviews' }
};

/**
 * Add organization schema taking from initial Config
 * @param {*} initialConfigWeb
 * @returns
 */
export const franchiseOrgSchema = (initialConfigWeb) => {
    if (!isWebDevice || isCustomerApp()) {
        return;
    }
    if (isValidElement(initialConfigWeb?.schema?.organisationSchema)) {
        addSchemaToHead(JSON.stringify(initialConfigWeb.schema.organisationSchema), schemaId.ORG_SCHEMA);
        return;
    }
    const logoUrl = initialConfigWeb?.images?.websiteLogoUrl ?? '';
    const name = isFoodHubApp()
        ? LOCAL_SCHEMA.FOODHUB_SCHEMA
        : initialConfigWeb?.franchise?.name ?? makeFirstLetterUpperCase(franchiseNameFromHost) ?? '';
    let contactPoint = {
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: initialConfigWeb?.country?.customerCareNumber ?? undefined,
            contactType: 'customer service',
            areaServed: initialConfigWeb?.country?.iso ?? undefined
        }
    };
    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Corporation',
        name: name,
        url: `https://${host}/`,
        logo: logoUrl,
        ...contactPoint,
        sameAs: generateSameAs(initialConfigWeb)
    });
    addSchemaToHead(schema, schemaId.ORG_SCHEMA);
};

/**
 * Add organization schema taking from store Config
 * @param {*} storeConfigResponse
 * @returns
 */
export const customerOrgSchema = (storeConfigResponse = {}) => {
    if (!isWebDevice || !isCustomerApp()) {
        return;
    }
    const { name, number, street, town, city, postcode, website_logo_url, phone } = storeConfigResponse;
    const country = isArrayNonEmpty(storeConfigResponse?.country) ? storeConfigResponse?.country?.[0]?.iso : '';
    const description = storeConfigResponse?.seo_details?.ordernow?.description ?? '';
    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        description,
        url: `https://${host}/`,
        logo: website_logo_url,
        address: {
            '@type': 'PostalAddress',
            streetAddress: `${number} ${street}`,
            addressLocality: town,
            addressRegion: city,
            postalCode: postcode,
            addressCountry: country
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: phone
        }
    });
    addSchemaToHead(schema, schemaId.ORG_SCHEMA);
};

/**
 * Adds local schema for foodhub and bigfoodie
 * @param {*} countryCode
 * @param {*} initialConfigWeb
 * @returns
 */
export const foodhubSchema = (countryCode, initialConfigWeb) => {
    if (!isWebDevice) {
        return;
    }
    if (isValidElement(initialConfigWeb?.schema?.localSchema)) {
        addSchemaToHead(JSON.stringify(initialConfigWeb.schema.localSchema), schemaId.LOCAL_SCHEMA);
        return;
    }

    if (!isFoodHubApp() || !isBigfoodie) {
        return;
    }

    let localSchemaConfig = '';
    if (isBigfoodie) {
        localSchemaConfig = localSchema({
            logo: 'https://foodhub.co.uk/compressed_images/bigfoodie_logo.svg',
            url: 'https://bigfoodie.co.uk',
            telephone: '01782444282',
            streetAddress: 'Duke Street, Stoke-on-Trent',
            addressLocality: 'staffordshire',
            postalCode: 'ST4 3NR',
            addressCountry: 'GB',
            sameAs: [
                'https://www.facebook.com/bigfoodie.co.uk',
                'https://twitter.com/bigfoodie',
                'https://www.instagram.com/bigfoodie.co.uk/',
                'https://www.youtube.com/@Foodhub-online-food-ordering',
                'https://bigfoodie.co.uk/'
            ]
        });
    } else {
        switch (countryCode) {
            case 'GB':
                localSchemaConfig = localSchema({
                    countryCode: countryCode,
                    initialConfigWeb: initialConfigWeb,
                    url: 'https://foodhub.co.uk/',
                    telephone: '01782444282',
                    streetAddress: '55 Duke Street',
                    addressLocality: 'Stoke-on-Trent',
                    postalCode: 'ST43NR',
                    addressCountry: 'GB',
                    latitude: 52.9956,
                    longitude: -2.15347,
                    sameAs: [
                        'https://www.instagram.com/foodhub.co.uk/',
                        'https://www.facebook.com/Foodhub.co.uk/',
                        'https://www.youtube.com/@Foodhub-online-food-ordering',
                        'https://en.wikipedia.org/wiki/Foodhub',
                        'https://foodhub.co.uk/',
                        'https://twitter.com/FoodhubUK',
                        'https://www.tiktok.com/@foodhubuk',
                        'https://www.pinterest.co.uk/Foodhub_UK/'
                    ]
                });
                break;
            case 'US':
                localSchemaConfig = localSchema({
                    countryCode: countryCode,
                    initialConfigWeb: initialConfigWeb,
                    url: 'https://foodhub.com/',
                    telephone: '+1 2724442826',
                    streetAddress: '1209 Orange Street',
                    addressLocality: 'Wilmington',
                    addressRegion: 'DE',
                    postalCode: '19801',
                    addressCountry: 'US',
                    latitude: 52.9956,
                    longitude: -2.15347,
                    sameAs: [
                        'https://www.facebook.com/FoodhubUS/',
                        'https://www.instagram.com/foodhub.usa/',
                        'https://www.youtube.com/@Foodhub-online-food-ordering',
                        'https://twitter.com/FoodhubUS',
                        'https://en.wikipedia.org/wiki/Foodhub',
                        'https://www.pinterest.co.uk/Foodhub_UK/'
                    ]
                });
                break;

            case 'AU':
                localSchemaConfig = localSchema({
                    countryCode: countryCode,
                    initialConfigWeb: initialConfigWeb,
                    url: 'https://foodhub.com.au',
                    telephone: '+61 285034155',
                    streetAddress: 'Level 8, 65 York Street',
                    addressLocality: 'Sydney',
                    addressRegion: 'NSW',
                    postalCode: '2000',
                    addressCountry: 'AU',
                    latitude: 52.9956,
                    longitude: -2.15347,
                    sameAs: [
                        'https://foodhub.com.au/',
                        'https://www.facebook.com/FoodhubAustralia/',
                        'https://www.instagram.com/foodhubaustralia/',
                        'https://www.youtube.com/@Foodhub-online-food-ordering',
                        'https://twitter.com/foodhubaus',
                        'https://en.wikipedia.org/wiki/Foodhub',
                        'https://www.pinterest.co.uk/Foodhub_UK/'
                    ]
                });
                break;

            case 'IE':
                localSchemaConfig = localSchema({
                    countryCode: countryCode,
                    initialConfigWeb: initialConfigWeb,
                    url: 'https://food-hub.ie/',
                    telephone: '01782444282',
                    streetAddress: '55 Duke Street',
                    addressLocality: 'Stoke-on-Trent',
                    postalCode: 'ST43NR',
                    addressCountry: 'IE',
                    latitude: 52.9956,
                    longitude: -2.15347,
                    sameAs: [
                        'https://food-hub.ie/',
                        'https://www.instagram.com/foodhub.co.uk/',
                        'https://www.facebook.com/Foodhub.co.uk/',
                        'https://www.youtube.com/@Foodhub-online-food-ordering',
                        'https://en.wikipedia.org/wiki/Foodhub',
                        'https://twitter.com/FoodhubUK',
                        'https://www.pinterest.co.uk/Foodhub_UK/'
                    ]
                });
                break;

            case 'NZ':
                localSchemaConfig = localSchema({
                    countryCode: countryCode,
                    initialConfigWeb: initialConfigWeb,
                    url: 'https://food-hub.nz/',
                    streetAddress: 'Level 8, 65 York Street',
                    addressLocality: 'Sydney NSW',
                    postalCode: '2000',
                    addressCountry: 'NZ',
                    latitude: 52.9956,
                    longitude: -2.15347,
                    sameAs: [
                        'https://food-hub.nz/',
                        'https://www.facebook.com/FoodhubAustralia',
                        'https://www.instagram.com/foodhubaustralia/',
                        'https://twitter.com/foodhubaus',
                        'https://www.youtube.com/@Foodhub-online-food-ordering',
                        'https://en.wikipedia.org/wiki/Foodhub',
                        'https://www.pinterest.co.uk/Foodhub_UK/'
                    ]
                });
                break;
            default:
                return {};
        }
    }
    if (localSchemaConfig !== '') {
        addSchemaToHead(localSchemaConfig, schemaId.LOCAL_SCHEMA);
    }
};

export const getImageArray = (menuItems, storeConfigResponse) => {
    let imageArray = [];
    const { banner_url, thumbnail_url, logo_url } = storeConfigResponse || {};
    if (isValidElement(menuItems)) {
        const shuffledMenuItems = getRandomElementsWithImages(menuItems, 5);
        imageArray = shuffledMenuItems.map((value) => value?.image);
    }
    if (!isValidArray(imageArray) && (banner_url || thumbnail_url || logo_url)) {
        banner_url && imageArray.push(banner_url);
        thumbnail_url && imageArray.push(thumbnail_url);
        logo_url && imageArray.push(logo_url);
    }
    return imageArray;
};

/**
 * Construct takeaway schema, used only on order now
 * @param {*} storeConfigResponse
 * @param {*} currency
 * @param {*} menuItems
 * @returns
 */
export const constructTakeAwaySchema = (storeConfigResponse, currency, menuItems = null) => {
    if (!isWebDevice) {
        return;
    }
    const takeawayName = storeConfigResponse?.name ?? '';
    const doorNo = storeConfigResponse?.number ?? '';
    const street = storeConfigResponse?.street ?? '';
    const town = storeConfigResponse?.town ?? '';
    const city = storeConfigResponse?.city ?? '';
    const postcode = storeConfigResponse?.postcode ?? '';
    const country = isArrayNonEmpty(storeConfigResponse?.country) ? storeConfigResponse?.country?.[0]?.iso : '';
    const latitude = storeConfigResponse?.lat ?? '';
    const longitude = storeConfigResponse?.lng ?? '';
    const websiteLogo = storeConfigResponse?.website_logo_url ?? '';
    const totalReview = storeConfigResponse?.total_reviews ?? '';
    const averageReview = storeConfigResponse?.rating ? storeConfigResponse.rating : '0';
    const storeConfigPhone = storeConfigResponse?.phone ?? '';
    const topCuisines = cuisinesList(storeConfigResponse?.cuisines);
    const townName = seoFriendlyUrl(storeConfigResponse?.town);
    const slugName = seoFriendlyUrl(storeConfigResponse?.slug_name);
    const openingHoursData = constructOpenHours(storeConfigResponse);
    const orderNowUrl = isCustomerApp() ? `https://${host}/order-now` : `https://${host}/${townName}/${slugName}/ordernow`;
    let imageArray = getImageArray(menuItems, storeConfigResponse);
    if (!isValidArray(imageArray)) {
        imageArray = [websiteLogo];
    }
    const schema = JSON.stringify({
        '@context': schemaOrgUrl,
        '@type': 'Restaurant',
        '@id': orderNowUrl,
        url: orderNowUrl,
        name: takeawayName,
        logo: websiteLogo,
        image: imageArray,
        address: {
            '@type': 'PostalAddress',
            streetAddress: doorNo + ' ' + street + ', ' + town,
            addressLocality: city,
            addressRegion: city,
            postalCode: postcode,
            addressCountry: country
        },
        ...getAggregateRating(averageReview, totalReview),
        servesCuisine: topCuisines,
        openingHours: openingHoursData,
        priceRange: currency,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: latitude,
            longitude: longitude
        },
        telephone: storeConfigPhone,
        potentialAction: {
            '@type': 'OrderAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `https://${host}`,
                inLanguage: 'en-GB',
                actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
                url: `https://${host}?utm_source=google&utm_medium=organic&utm_campaign=orderaction`
            },
            deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp']
        }
    });
    addSchemaToHead(schema, schemaId.TAKEAWAY);
};

/**
 * Construct Breadcrumb Schema for Takeaway
 * @param {*} storeConfigResponse
 * @param {*} initialConfigWeb
 * @param {*} route
 * @returns
 */
export const constructTakeAwayBreadCrumbSchema = (storeConfigResponse, initialConfigWeb, route) => {
    if (!isWebDevice) {
        return;
    }
    const takeawayName = storeConfigResponse?.name ?? '';
    const townName = storeConfigResponse?.town;
    const seoFriendlyTownName = seoFriendlyUrl(townName);
    const slugName = seoFriendlyUrl(storeConfigResponse?.slug_name);
    const orderNowUrl = `https://${host}/${seoFriendlyTownName}/${slugName}/${ROUTER_LIST_IDENTIFIER.TAKEAWAY_MENU_PAGE}`;
    const name = isFoodHubApp()
        ? LOCAL_SCHEMA.FOODHUB_SCHEMA
        : initialConfigWeb?.franchise?.name ?? makeFirstLetterUpperCase(franchiseNameFromHost) ?? '';
    let itemPosition = 1;
    let itemListElement = [
        {
            '@type': 'ListItem',
            position: itemPosition,
            item: {
                name: `${name}`,
                '@id': `https://${host}`
            }
        }
    ];
    if (townName?.length > 1) {
        const breadCrumbTown = `${townName}`;
        const breadCrumbTownUrl = `https://${host}/locations/${seoFriendlyTownName}`;
        itemListElement.push({
            '@type': 'ListItem',
            position: (itemPosition = itemPosition + 1),
            item: {
                name: breadCrumbTown,
                '@id': breadCrumbTownUrl
            }
        });
    }
    itemListElement.push({
        '@type': 'ListItem',
        position: (itemPosition = itemPosition + 1),
        item: {
            name: `${takeawayName}`,
            '@id': orderNowUrl
        }
    });
    if (route === SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name || route === SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name) {
        const { url, title } = route === SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name ? SCHEMA_CONSTANTS.INFO : SCHEMA_CONSTANTS.FR_REVIEW;
        let itemLink = `https://${host}/${seoFriendlyTownName}/${slugName}/${url}`;

        itemListElement.push({
            '@type': 'ListItem',
            position: (itemPosition = itemPosition + 1),
            item: {
                name: `${takeawayName} - ${title}`,
                '@id': itemLink
            }
        });
    }
    const breadCrumbsSchema = JSON.stringify({
        '@context': schemaOrgUrl,
        '@type': 'BreadcrumbList',
        itemListElement
    });
    addSchemaToHead(breadCrumbsSchema, schemaId.TAKEAWAY_BREADCRUMBS);
};

/**
 * This schema shows search box in google, this one works only on franchise
 * @param {*} initialConfigWeb
 * @returns
 */
export const searchSchema = (initialConfigWeb) => {
    if (!isWebDevice || isCustomerApp()) {
        return;
    }
    if (isValidElement(initialConfigWeb?.schema?.searchSchema)) {
        addSchemaToHead(JSON.stringify(initialConfigWeb.schema.searchSchema), schemaId.SEARCH_SCHEMA);
        return;
    }
    const url = `https://${host}`;
    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: url,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${url}?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    });
    addSchemaToHead(schema, schemaId.SEARCH_SCHEMA);
};

/**
 * This schema shows FAQ and it is applicable only for franchise
 * @param {*} initialConfigWeb
 * @returns
 */
export const faqSchema = (initialConfigWeb) => {
    if (!isWebDevice || isCustomerApp()) {
        return;
    }
    if (isValidElement(initialConfigWeb?.schema?.faqSchema)) {
        addSchemaToHead(JSON.stringify(initialConfigWeb.schema.faqSchema), schemaId.FAQ);
        return;
    }
    const name = isFoodHubApp()
        ? LOCAL_SCHEMA.FOODHUB_SCHEMA
        : initialConfigWeb?.franchise?.name ?? makeFirstLetterUpperCase(franchiseNameFromHost) ?? '';
    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `Why should I order Food online through ${name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Our purpose first and foremost is to bring you the best local food. We know you appreciate good food, value for money, and convenience and we are the friendly local voice here to help you find what you need.  We offer discounts and coupon codes on a regular basis in addition to competitions and prize drawings we organise especially for our customers.If you are looking for the best selection of local takeaways, choosing ${name} is a no brainer!`
                }
            },
            {
                '@type': 'Question',
                name: `How Do I Contact ${name} Customer Service?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `We are here to help! The fastest way to resolve your queries is to use the app or website. ${name} Website :Login to your account. Click on the dropdown list and select Order History and then use Live Chat to report your query.${name} App :Login to your account, Click on the menu and select support and then use Live Chat to report your query. Or you can mail us at hello@${host}`
                }
            },
            ...(isFoodHubApp()
                ? [
                      {
                          '@type': 'Question',
                          name: `What is a ${name} Wallet?`,
                          acceptedAnswer: {
                              '@type': 'Answer',
                              text: `${name} Wallet is an e-wallet where you can choose to receive the funds for cancelled online payment orders. The refunds will be credited to the ${name} wallet instantly. If you select a card for the refund, the process of refund may take 3 to 5 working days. You can use the balance in the ${name} wallet to place an order through our ${name} online portal. Note : Minimum one credit card should be saved to your account to receive the amount to the ${name} wallet.`
                          }
                      }
                  ]
                : [])
        ]
    });
    addSchemaToHead(schema, schemaId.FAQ);
};

/**
 * This schema shows FAQ and it is applicable only for franchise and only on order now page
 * @param {*} initialConfigWeb
 * @returns
 */
export const orderFAQSchema = (initialConfigWeb, storeConfig, getFaqList = false) => {
    if (!isWebDevice || isCustomerApp()) {
        return;
    }
    if (isValidElement(initialConfigWeb?.schema?.orderFAQSchema)) {
        addSchemaToHead(JSON.stringify(initialConfigWeb.schema.orderFAQSchema), schemaId.FAQ);
        return;
    }

    const name = isFoodHubApp()
        ? LOCAL_SCHEMA.FOODHUB_SCHEMA
        : initialConfigWeb?.franchise?.name ?? makeFirstLetterUpperCase(franchiseNameFromHost) ?? '';
    const takeawayName = storeConfig?.name ?? '';
    const isDeliveryAvailable = storeConfig?.show_delivery;
    const items = cuisinesList(storeConfig?.cuisines);

    const faqList = [
        {
            question: `How do I place an order on ${name} for ${takeawayName}?`,
            answer: isBigfoodie
                ? `Visit the store ${takeawayName} menu on the ${name} website or app. Choose the items you'd like to order, add them to your basket, and proceed to checkout. You will be guided to enter your delivery address and payment information to complete your order.`
                : `To place an order, visit the ${takeawayName} menu on the ${name} website or app. Select the items you'd like to order, add them to your basket, and proceed to checkout. Follow the prompts to enter your delivery address and payment information to complete your order.`
        },
        {
            question: `What items are available on the ${takeawayName} menu?`,
            answer: isBigfoodie
                ? `The ${takeawayName} menu on ${name} has a variety of delicious dishes you can choose from. Find an option and select them.`
                : `The ${takeawayName} menu on ${name} features a variety of delicious items including ${items}, and more. You'll find options for ordering and placing your favourites.`
        },
        {
            question: `Can I customise my order from ${takeawayName} on ${name}?`,
            answer: isBigfoodie
                ? 'Yes, if you want a certain dish done the way it suits your palette or simply to avoid any allergic reaction. When selecting an item, look for options to add or remove ingredients according to your preferences.'
                : 'Yes, you can customise certain items on the menu. When selecting an item, look for options to add or remove ingredients according to your preferences.'
        }
    ];

    if (isDeliveryAvailable) {
        faqList.push(
            {
                question: `Is there a minimum order value for delivery from ${takeawayName} on ${name}?`,
                answer: isBigfoodie
                    ? `The terms and conditions set by ${takeawayName} also include the minimum value; it varies and changes based on the location. You can check the ${name} website or app for the minimum order requirement in your area.`
                    : `The minimum order value may vary depending on your location and the specific terms set by ${takeawayName}. You can check the ${name} website or app for the minimum order requirement in your area.`
            },
            {
                question: `Can I schedule an order for later from ${takeawayName} on ${name}?`,
                answer: isBigfoodie
                    ? `Yes, with ${name}, you can schedule your order. When placing your order, you have the option to schedule and select a delivery time that works best for you.`
                    : `Yes, ${name} allows you to schedule orders for later delivery. When placing your order, you'll have the option to select a delivery time that works best for you.`
            }
        );
    }

    if (getFaqList) {
        return faqList;
    }

    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer
            }
        }))
    });

    addSchemaToHead(schema, schemaId.FAQ);
};

export const topRestaurantsSchema = (takeawayData, currency, countryIso, path) => {
    if (!isWebDevice || isCustomerApp()) {
        return;
    }
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: []
    };
    const filteredTakeawayData = takeawayData?.filter((restaurant) => isValidString(restaurant?.banner_url))?.slice(0, 5);
    filteredTakeawayData?.forEach((restaurant, index) => {
        const servesCuisine = isArrayNonEmpty(restaurant?.cuisines) ? restaurant?.cuisines : [];
        const bannerImage = isValidString(restaurant?.banner_url) ? restaurant?.banner_url : '';
        const townName = seoFriendlyUrl(restaurant?.town);
        const slugName = seoFriendlyUrl(restaurant?.slug_name);
        const restaurantSchema = {
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Restaurant',
                url: `https://${host}/${townName}/${slugName}/ordernow`,
                name: restaurant?.name,
                image: bannerImage,
                servesCuisine: servesCuisine,
                priceRange: currency,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: restaurant?.town,
                    postalCode: restaurant?.postcode,
                    addressCountry: countryIso
                },
                ...getAggregateRating(restaurant?.rating, restaurant?.total_reviews)
            }
        };
        schema.itemListElement.push(restaurantSchema);
    });

    const jsonString = JSON.stringify(schema);
    addSchemaToHead(jsonString, schemaId.TOP_RESTAURANTS_SCHEMA);
};

export function getAggregateRating(rating, total_reviews) {
    return {
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: `${isValidString(rating) && rating?.toString() !== '0' ? rating.toString() : '5'}`,
            reviewCount: `${isValidString(total_reviews) && total_reviews?.toString() !== '0' ? total_reviews.toString() : '1'}`
        }
    };
    // removed to valdiate the review snippet issue with gsc
    // bestRating: '5',
    // worstRating: '1'
}

export const topProductsSchema = (menuItems, currencyIso, rating, total_reviews) => {
    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'ItemList',
        itemListElement: []
    };
    const shuffledMenuItems = getRandomElementsWithImages(menuItems);
    shuffledMenuItems.forEach((itemObj, index) => {
        const itemImage = [itemObj?.image];
        const itemCat = seoFriendlyUrl(formatCategoryName(itemObj?.categoryName));
        const itemSubCat = seoFriendlyUrl(formatCategoryName(itemObj?.subCategoryName));
        const itemId = itemObj?.id;
        const itemName = seoFriendlyUrl(formatCategoryName(itemObj?.name));
        const productSchema = {
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                name: itemObj?.name ?? '',
                image: itemImage,
                description: isValidString(itemObj?.description) ? itemObj?.description : `Enjoy delicious ${itemObj?.name}`,
                ...getAggregateRating(rating, total_reviews),
                offers: {
                    '@type': 'Offer',
                    price: itemObj?.price ?? '0',
                    availability: 'InStock',
                    priceValidUntil: '2026-04-08',
                    priceCurrency: currencyIso ?? '' // As per https://schema.org/priceCurrency
                }
            }
        };
        if (isCustomerApp()) {
            productSchema.item.url = `https://${host}/order-now/${itemCat}/${itemSubCat}/${itemName}/${itemId}`;
        }
        schema.itemListElement.push(productSchema);
    });

    const jsonString = JSON.stringify(schema);
    addSchemaToHead(jsonString, schemaId.TOP_PRODUCTS_SCHEMA);
};

/**
 * Construct website schema, used for brand/site details
 * @param {String} appName - Expected site name
 * @returns
 */
export const constructWebsiteSchema = (appName = '') => {
    if (!isWebDevice && !isValidString(appName)) {
        return;
    }
    const appUrl = `https://${host}`;
    const schema = JSON.stringify({
        '@context': schemaOrgUrl,
        '@type': 'WebSite',
        name: appName,
        url: appUrl
    });
    addSchemaToHead(schema, schemaId.WEBSITE_SCHEMA);
};
