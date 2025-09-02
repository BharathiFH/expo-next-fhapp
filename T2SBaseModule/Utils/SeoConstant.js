import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { STORE_TYPE, STORE_TYPE_MAPPING } from './Constants';
import { firstLetterUppercase, isValidString, nonFormattedPostCode } from './helpers';

export const GROCERY_SEO_KEYS = {
    GROCERY_POSTAL_CODE: 'grocery_postal_code',
    GROCERY_LOCATION_AREA: 'grocery_location_area',
    GROCERY_STORE_INFO: 'grocery_store_info',
    GROCERY_STORE_REVIEWS: 'grocery_store_reviews',
    GROCERY_BRAND_HOME_PAGE: 'grocery_brand_home_page'
};

export const SEO_CONSTANTS = {
    [SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name]: { title: 'Order Takeaways & Restaurants in <location name> <postcode> - <app name>' },
    [SCREEN_OPTIONS.HOME_SCREEN.route_name]: { title: 'Order Food Online from Restaurants | Takeaway Food Delivery | <app name>' },
    [SCREEN_OPTIONS.MENU_SCREEN.route_name]: { title: '<takeaway name> Takeaway Menu in <takeaway town> | Order Online on <app name>' },
    [SCREEN_OPTIONS.CUISINES_LOCATION_LIST.route_name]: {
        title: '<cuisine name> Takeaway and Restaurants Near Me - Order Online on <app name>'
    },
    cuisines_location_list_all_cuisine: { title: 'Browse Your Favourite Takeaways and Restaurants by Cuisines | <app name>' },
    cuisines_location_list_all_location: { title: 'Takeaways and Restaurants Near Me - Browse By City Or Locality | <app name> ' },
    [SCREEN_OPTIONS.CUISINE_BASED_TA_LIST_SCREEN.route_name]: {
        title: '<cuisine name> Takeaway and Restaurants in <cuisine location> - Order Online from <app name>',
        description:
            'Order <cuisine name> Food Online from Takeaway and Restaurants in <cuisine location>. Choose from a wide range of <cuisine name> takeaways who offer doorstep delivery.'
    },
    [SCREEN_OPTIONS.BASKET_LOCATION_REQUEST_MODAL.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.LANGUAGE.route_name]: { title: 'Language | <app name>' },
    [SCREEN_OPTIONS.PROFILE_MODAL.route_name]: { title: ' Profile | <app name> ' },
    [SCREEN_OPTIONS.POST_REVIEW.route_name]: { title: ' Give Us Feedback | <app name> ' },
    [SCREEN_OPTIONS.CHANGE_PASSWORD.route_name]: { title: 'Change Password | <app name>' },
    [SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.ADDRESS_MODAL.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.ADD_LOCATION_SEARCH_SCREEN.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.EXTRA_SCREEN.route_name]: { title: 'Extra Page | <app name>' },
    [SCREEN_OPTIONS.OTP_SCREEN.route_name]: { title: 'Your User Profile In <app name> Online Ordering Portal | OTP' },
    [SCREEN_OPTIONS.DRIVER_TIP.route_name]: { title: 'Basket | <app name>' },
    [SCREEN_OPTIONS.NEW_MENU_ITEM_DETAIL_SCREEN.route_name]: {
        title: 'Order tasty <item name> in <location name> | <app name>',
        description:
            'Enjoy delicious <item name> from <app name> in <location name>. Explore different dishes available from the <category name> menu and order treats from this takeaway near you.'
    },
    [SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name]: { title: '<takeaway name> Takeaway in <takeaway town> | Ratings & Reviews' },
    [SCREEN_OPTIONS.ABOUT_US.route_name]: { title: 'About Us | <app name>' },
    [SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name]: { title: 'Terms & Condition | <app name>' },
    [SCREEN_OPTIONS.TERMS_OF_USE.route_name]: { title: 'Terms of Use | <app name>' },
    [SCREEN_OPTIONS.SCHEDULE_ORDER.route_name]: { title: 'Basket | <app name>' },
    [SCREEN_OPTIONS.PRIVACY_POLICY.route_name]: { title: 'Privacy Policy | <app name>' },
    [SCREEN_OPTIONS.SOCIAL_LOGIN.route_name]: { title: 'Social login  | <app name>' },
    [SCREEN_OPTIONS.LOGIN.route_name]: { title: 'Login | <app name>' },
    [SCREEN_OPTIONS.FORGOT_PASSWORD.route_name]: { title: 'Forgot Password | <app name>' },
    [SCREEN_OPTIONS.EMAIL_VERIFICATION.route_name]: { title: 'Email Verification  | <app name>' },
    [SCREEN_OPTIONS.BASKET.route_name]: { title: 'Basket | <app name>' },
    [SCREEN_OPTIONS.CHECKOUT.route_name]: { title: 'Basket | <app name>' },
    [SCREEN_OPTIONS.ORDER_TRACKING.route_name]: { title: 'Order tracking | <app name>' },
    [SCREEN_OPTIONS.ORDER_HISTORY.route_name]: { title: 'Repeat Your Previous Orders From The Order History | <app name>' },
    [SCREEN_OPTIONS.OFFERS.route_name]: { title: 'Exclusive Food Deals in <takeaway town>,<postcode> | Special Offers at <app name>' },
    [SCREEN_OPTIONS.ACCOUNT.route_name]: { title: 'Your User Profile In <app name> Online Ordering Portal' },
    [SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name]: { title: 'Your favourite| <app name>' }, //Done
    [SCREEN_OPTIONS.WALLET.route_name]: { title: 'Wallet | <app name>' },
    [SCREEN_OPTIONS.REFERRAL_SCREEN.route_name]: { title: 'Referral page | <app name>' },
    [SCREEN_OPTIONS.ADDRESS_SELECTION_SCREEN.route_name]: { title: 'Address | <app name>' },
    [SCREEN_OPTIONS.SAVED_CARD_DETAILS.route_name]: { title: 'Saved cards | <app name>' },
    [SCREEN_OPTIONS.SUPPORT.route_name]: { title: 'Support | <app name>' },
    [SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name]: { title: 'Allergy information | <app name>' },
    cuisines: { title: 'Browse Takeaway and Restaurants by cuisines in your Town | <app name>' },
    location: { title: 'Takeaways and Restaurants Near Me - Browse By City Or Locality | <app name>' },
    CUISINE_DISHES: { title: '<cuisine name> Takeaway and Restaurants Near Me - Order Online from <app name>' },
    category: { title: 'Order your favorite <category name> in <location name> | <takeaway name>' },
    [SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name]: {
        title: 'About <takeaway name> Takeaway in <takeaway town> - <postcode> | Order from <app name>'
    },
    takeaway_ordernow: { title: '<takeaway name> Takeaway Menu in <takeaway town> | Order Online on Foodhub' },
    [SCREEN_OPTIONS.SIGN_UP.route_name]: { title: 'Sign up | <app name>' },
    [SCREEN_OPTIONS.DELIVERY_ADDRESS.route_name]: { title: 'Delivery address | <app name>' },
    [SCREEN_OPTIONS.LOYALTY_POINTS.route_name]: { title: 'Loyalty points | <app name>' },
    [SCREEN_OPTIONS.CONTACT_US.route_name]: { title: 'Contact Us - <app name>' },
    [SCREEN_OPTIONS.GROCERY.route_name]: { title: 'Order Groceries in <location name> <postcode> | <app name>' },
    [SCREEN_OPTIONS.SERVICABLE_LOCATION_LIST.route_name]: { title: 'Takeaways and Restaurants Near Me - Explore By Location' },
    [SCREEN_OPTIONS.REGION_BASED_TA.route_name]: { title: 'Order Takeaway Food Online for Delivery in <location name>' },
    [SCREEN_OPTIONS.MAGIC_LOGIN.route_name]: { title: 'Sign in with link | <app name>' },
    LOCATION_AREA: { title: 'Order Takeaway Delivery Nearby in <location name> from Best Restaurants' },
    [SCREEN_OPTIONS.MENU_SEARCH_SCREEN.route_name]: { title: 'Search | <app name>' },
    [SCREEN_OPTIONS.BRAND_HOME_PAGE.route_name]: {
        title: '<brand name> | Food Delivery & Takeaway Near Me | Restaurant Food Menu',
        description:
            'Craving <brand name>? Get your favourite dishes delivered fast or grab takeout from a location near you! Explore our mouthwatering menu—all ready for quick pickup or fast delivery. Order now!'
    },
    [SCREEN_OPTIONS.BRANDED_TAKEAWAY_LIST.route_name]: {
        title: 'Order Online from <brand name> Restaurant and Takeaway in <location name> | Order Food Delivery',
        description:
            'Craving <brand name> in <location name>? Get mouthwatering food delivered fast or pick up hot & ready! Freshly prepared, always tasty—order online now for quick delivery or convenient takeaway! '
    },
    [SCREEN_OPTIONS.GIFT_CARDS.route_name]: {
        title: '<app name> Gift Cards',
        description:
            'Send the perfect food gifts with <app name> gift cards. Easy to order, instantly delivered, and redeemable at thousands of restaurants and takeaways across the UK.'
    },
    [SCREEN_OPTIONS.GIFT_CARD_PURCHASE_SCREEN.route_name]: {
        title: 'Restaurants, Takeaways & Groceries - <app name> Gift Cards Online',
        description:
            'Buy a gift for friends and family with a <app name> gift card – perfect for any occasion! Enjoy easy redemption at thousands of takeaways across the UK on <app name>.'
    },
    [SCREEN_OPTIONS.GIFT_CARD_VIEW_BALANCE_SCREEN.route_name]: {
        title: 'Check your <app name> Gift Card Balance | Restaurant & Food Gift Cards',
        description:
            'View your <app name> giftcard balance and redeem it today! Enjoy smooth access to restaurant gift cards and food giftcards across the UK.'
    },
    [GROCERY_SEO_KEYS.GROCERY_POSTAL_CODE]: {
        title: 'Online Grocery Shopping in <location name>, <postcode> | Delivery Same day Groceries',
        description:
            'Shop online for groceries in <location name>, <postcode> with same-day delivery. Get fresh groceries and essentials delivered straight to your door quickly and conveniently!',
        keywords: 'Online Grocery Shopping, Grocery Delivery Near Me, Same Day Grocery Delivery'
    },
    [GROCERY_SEO_KEYS.GROCERY_LOCATION_AREA]: {
        title: 'Best Online Grocery Shopping in <location name> | Grocery Delivery Near Me',
        description:
            'Best online grocery shopping in <location name> with quick and easy grocery delivery near me. Fresh food, everyday essentials—delivered straight to your door!',
        keywords: 'Online Grocery Shopping, Grocery Delivery Near Me, Same Day Grocery Delivery'
    },
    [GROCERY_SEO_KEYS.GROCERY_STORE_INFO]: {
        title: 'About <takeaway name> in <takeaway town> - <postcode> | Order Grocery Online',
        description:
            'Explore <takeaway name> in <takeaway town> and order groceries online. Enjoy a wide variety of products delivered right to your door!',
        keywords: 'Online Grocery Shopping, Grocery Delivery Near Me, Same Day Grocery Delivery'
    },
    [GROCERY_SEO_KEYS.GROCERY_STORE_REVIEWS]: {
        title: '<takeaway name> Store in <takeaway town> | Local Store Ratings & Reviews',
        description:
            'Explore <takeaway name> Store in <takeaway town> with top ratings & reviews. Find what you need from trusted and reviewed stores!',
        keywords: 'Online Grocery Shopping, Grocery Delivery Near Me, Same Day Grocery Delivery'
    },
    [GROCERY_SEO_KEYS.GROCERY_BRAND_HOME_PAGE]: {
        title: '<brand name> – Groceries Near Me & Grocery Delivery Online | Foodhub',
        description:
            'Find groceries near you at <brand name> on Foodhub. From fresh food to household goods, order online from a trusted local grocery store with delivery options.'
    }
};

export const SEO_CUSTOM_CONSTANTS_CUSTOMER = {
    [SCREEN_OPTIONS.MENU_SCREEN.route_name]: {
        title: '<takeaway name> - The Best Takeaway in <takeaway town> | Order Online',
        description:
            "Discover the best takeaway in <takeaway town> at <takeaway name>. With dishes ranging from starters to desserts, you are sure to find what you're looking for.",
        keywords: '<takeaway name> menu, <takeaway name> <takeaway town>, <takeaway name> delivery, <takeaway name> deals'
    },
    [SCREEN_OPTIONS.HOME_SCREEN.route_name]: {
        title: '<takeaway name> | Authentic Takeaway Dining in <takeaway town>',
        description:
            'Discover <takeaway name> - Authentic Indian Desi and Italian takeaway in <takeaway town>. Quality, authenticity & community. Order now for a delightful experience!'
    }
};

export const SEO_CONSTANTS_GROCERY = {
    [SCREEN_OPTIONS.MENU_SCREEN.route_name]: {
        title: '<takeaway name> - <takeaway town> | Grocery Shopping Online | Order on <app name>',
        description:
            "Buy groceries online from <takeaway name> in <takeaway town> <postcode> and enjoy the same great quality, freshness, and choice you'd find in-store. Order on <app name>!"
    }
};

//SEO Constant for Non foodhub
export const CUSTOM_SEO_CONSTANTS_FOR_NON_FOODHUB = {
    [SCREEN_OPTIONS.GIFT_CARDS.route_name]: {
        title: '<app name> Gift Cards',
        description:
            'Make someone’s day special with a <app name> gift card—instantly delivered, easy to redeem, and perfect for any occasion.'
    },
    [SCREEN_OPTIONS.GIFT_CARD_PURCHASE_SCREEN.route_name]: {
        title: 'Buy a Giftcard from <app name> – Perfect for Food Lovers!',
        description:
            'Treat someone special with a <app name> gift card! Enjoy delicious meals at their favorite takeaway. Buy now, redeem with ease, and share the joy of great food!'
    },
    [SCREEN_OPTIONS.GIFT_CARD_VIEW_BALANCE_SCREEN.route_name]: {
        title: 'Check your Gift Card balance | A delicious gift, perfect for food lovers everywhere.',
        description:
            'Treat the food lover in your life to a delicious meal with a <app name> Gift Card! Enjoy amazing takeaway deals and easily check your gift card balance anytime. Order now for the ultimate tasty delight!'
    }
};

export const replaceSeoTags = (
    categoryName = '',
    title = '',
    location = '',
    postcode = '',
    takeAwayName = '',
    takeAwayTown = '',
    cuisineName = '',
    cuisineLocation = '',
    appName = '',
    currentStoreType,
    itemName = '',
    brandName = ''
) => {
    currentStoreType = isValidString(currentStoreType) ? currentStoreType : STORE_TYPE.TAKEAWAY;
    const storeMappings = STORE_TYPE_MAPPING[currentStoreType];
    const pattern = new RegExp(Object.keys(storeMappings).join('|'), 'gi');
    let updatedTitle = title
        ?.replace(/<category name>/, replaceHyphenWithSpace(categoryName))
        ?.replace(/<item name>/, firstLetterUppercase(replaceHyphenWithSpace(itemName)))
        ?.replace(/<location name>/g, firstLetterUppercase(location))
        ?.replace(/<takeaway name>/g, takeAwayName)
        ?.replace(/<takeaway town>/g, firstLetterUppercase(takeAwayTown))
        ?.replace(/<cuisine name>/g, firstLetterUppercase(cuisineName))
        ?.replace(/<cuisine location>/g, cuisineLocation)
        ?.replace(/<app name>/g, appName)
        ?.replace(/<brand name>/g, firstLetterUppercase(brandName))
        ?.replace(pattern, (match) => storeMappings[match]);

    updatedTitle = updatedTitle
        ?.replace(STORE_TYPE_MAPPING.RESTAURANTS_WITH_AMP, STORE_TYPE_MAPPING.RESTAURANTS)
        ?.replace(STORE_TYPE_MAPPING.RESTAURANTS_WITH_AND, STORE_TYPE_MAPPING.RESTAURANTS);

    if (isValidString(postcode)) {
        updatedTitle = updatedTitle?.replace(/<postcode>/g, nonFormattedPostCode(postcode));
    } else {
        updatedTitle = updatedTitle?.replace(/ - <postcode>|<postcode>/g, ''); // Replace with blank
    }
    return updatedTitle;
};

export const formatCategoryMetaTags = (town, name, category, metaTags) => {
    const formattedMetaTags = {};
    Object.keys(metaTags).forEach((key) => {
        formattedMetaTags[key] = metaTags[key]
            ?.replace(/<takeaway name>/g, replaceHyphenWithSpace(name))
            ?.replace(/<category name>/g, replaceHyphenWithSpace(category))
            ?.replace(/<location name>/g, replaceHyphenWithSpace(town));
    });
    return formattedMetaTags;
};

export const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, function (l) {
        return l.toUpperCase();
    });
};

export const replaceHyphenWithSpace = (str = '') => {
    return str?.replace(/-/g, ' ');
};

export const locationRoute = 'LOCATION';
export const cuisinesRoute = 'CUISINES';
export const cuisines_dishes = 'CUISINE_DISHES';
export const cuisine = 'CUISINE';
export const locationArea = 'LOCATION_AREA';
export const postalCode = 'POSTAL_CODE';
export const homeScreenRoute = SCREEN_OPTIONS.HOME_SCREEN.route_name;

export const TAKEAWAY_TYPES = {
    RESTAURANT: 'restaurant',
    BRAND: 'brand',
    FLOWERS_2_YOU: 'flowers2you',
    GROCERY: 'grocery'
};

const SEO_PAGES_COMMON = {
    [SCREEN_OPTIONS.GIFT_CARDS.route_name]: 'giftcards',
    [SCREEN_OPTIONS.GIFT_CARD_PURCHASE_SCREEN.route_name]: 'giftcards_purchase',
    [SCREEN_OPTIONS.GIFT_CARD_VIEW_BALANCE_SCREEN.route_name]: 'giftcards_check_balance'
};

export const SEO_PAGES_CUSTOMER = {
    ...SEO_PAGES_COMMON,
    [SCREEN_OPTIONS.HOME_SCREEN.route_name]: 'index',
    [SCREEN_OPTIONS.ABOUT_US.route_name]: 'about-us',
    [SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name]: 'contact-us',
    [SCREEN_OPTIONS.AGREEMENT.route_name]: 'termsandcond',
    [SCREEN_OPTIONS.MENU_SCREEN.route_name]: 'ordernow',
    [SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name]: 'termsandcond',
    [SCREEN_OPTIONS.TERMS_OF_USE.route_name]: 'termsanduse',
    [SCREEN_OPTIONS.SOCIAL_LOGIN.route_name]: 'login',
    [SCREEN_OPTIONS.PRIVACY_POLICY.route_name]: 'privacy',
    TAKEAWAY_ORDER_NOW: 'ordernow',
    [SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name]: 'review',
    [SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name]: 'allergy',
    BOOKTABLE: 'booktable',
    CAMPAIGN: 'campaign',
    customer_custom_screen: 'ordernow',
    [SCREEN_OPTIONS.LOGIN.route_name]: 'login',
    COOKIES: 'cookies',
    EXTRA_PAGE: 'extra-page',
    ORDER_TRACKING: 'order-tracking',
    ORDERHISTORY: 'orderHistory',
    PAYBYLINK: 'paybylink',
    PROFILE: 'profile',
    REGISTER: 'register',
    RESET_PASSWORD: 'reset-password',
    SOCIAL: 'social',
    UNSUBSCRIBE: 'unsubscribe',
    WALLET: 'wallet',
    [SCREEN_OPTIONS.TABLE_BOOKING.route_name]: 'booktable',
    [SCREEN_OPTIONS.CHECKOUT.route_name]: 'basket',
    [SCREEN_OPTIONS.EXTRA_SCREEN.route_name]: 'extrascreen'
};

export const SEO_PAGES_FRANCISE = {
    ...SEO_PAGES_COMMON,
    [SCREEN_OPTIONS.HOME_SCREEN.route_name]: 'home',
    [SCREEN_OPTIONS.ABOUT_US.route_name]: 'about_us',
    [SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name]: 'terms_and_condition',
    [SCREEN_OPTIONS.TERMS_OF_USE.route_name]: 'terms_and_use',
    [SCREEN_OPTIONS.PRIVACY_POLICY.route_name]: 'privacy',
    LOCATION: 'location',
    CUISINES: 'cuisines',
    LOCATION_AREA: 'location_area',
    CUISINE_DISHES: 'cuisine_dishes',
    [SCREEN_OPTIONS.MENU_SCREEN.route_name]: 'takeaway_ordernow',
    [SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name]: 'takeaway_reviews',
    [SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name]: 'takeaway_info',
    POSTAL_CODE: 'postal_code',
    CUISINE: 'cuisine',
    [SCREEN_OPTIONS.LOGIN.route_name]: 'login',
    [SCREEN_OPTIONS.OFFERS.route_name]: 'offers',
    [SCREEN_OPTIONS.PROMOTION_DEALS.route_name]: 'promotions_deals',
    [SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name]: 'takeaway_ordernow',
    [SCREEN_OPTIONS.NEW_MENU_SUBCAT_ITEMS_SCREEN.route_name]: 'takeaway_ordernow',
    [SCREEN_OPTIONS.NEW_MENU_ITEM_DETAIL_SCREEN.route_name]: 'takeaway_ordernow',
    GROCERY_POSTAL_CODE: 'grocery_postal_code',
    GROCERY_LOCATION_AREA: 'grocery_location_area',
    GROCERY_STORE_INFO: 'grocery_store_info',
    GROCERY_STORE_REVIEWS: 'grocery_store_reviews'
};

export const SEO_CONSTANTS_GTM = {
    GOOGLE_ANALYTICS: 'google_analytics',
    FACEBOOK_PIXEL: 'facebook_pixel',
    ZSIQCHAT: 'zsiqchat',
    MOENGAGE: 'moengage',
    DAKTELA: 'daktela',
    CG_ADVERTISING: 'cgadvertising'
};
export const SEO_CG_ADVERTISING_KEY = 'LT4pdQwp';
export const QUERY_PARAM_PARSER = 'query_param_parser';

export const schemaRoutes = {
    MENU: 'ordernow',
    REVIEW: 'reviews',
    INFO: 'info'
};

export const schemaId = {
    FAQ: 'faq_schema',
    TAKEAWAY: 'takeaway_schema',
    REVIEW: 'review_schema',
    TOP_RESTAURANTS_SCHEMA: 'top_restaurants_schema',
    TOP_PRODUCTS_SCHEMA: 'top_products_schema',
    ORG_SCHEMA: 'org_schema',
    SEARCH_SCHEMA: 'search_schema',
    LOCAL_SCHEMA: 'local_schema',
    WEBSITE_SCHEMA: 'website_schema',
    TAKEAWAY_BREADCRUMBS: 'takeaway_breadcrumbs_schema'
};

export const chatApplicableRoutes = ['/account', '/support', '/orderHistory', '/order-tracking', '/view-order', '/chat'];

export const isGoogleWebCache = 'webcache.googleusercontent.com';

export const DEEPLINKING_MEDIUM = {
    PASSLINK: 'passlink'
};

export const SEO_SCRIPT_CONSTANTS = {
    SCRIPT: 'script',
    PLAIN_GTM: 'plainGtm'
};
