export const S3_PUBLIC_URL = {
    LIVE: 'public.touch2success.com',
    SIT: 'nativepoc.t2scdn.com'
};

/**
 * Currentyl we dont have s3 env paths for QA and DEV environments
 * so we are having sit for all env paths of qa and dev
 */
export const S3_ENV_PATH = {
    LIVE: 'production',
    SIT: 'sit',
    QA: 'sit',
    DEV: 'sit',
    SITFOODHUB: 'sit',
    DEVFOODHUB: 'sit',
    QAFOODHUB: 'sit'
};

export const LOWER_ENV_SUB_DOMAINS = ['qa', 'dev', 'sit'];
export const LOWER_ENV_DOMAIN = ['sitfoodhub', 'devfoodhub', 'qafoodhub', 'localhost'];
export const LOWER_PREPROD_DOMAINS = ['preprod'];

export const FOODHUB_DOMAINS = ['foodhub', 'food-hub'];

export const WEB_CONSTANTS = {
    LEGACY_SLASH_API: '/api',
    FALCON_SLASH_API: '/falconapi',
    FALCON_SLASH_API_NEW: '/api/fm',
    CX_SLASH_API: '/cx/',
    PROTOCOL: 'https://',
    PLATFORM_ID: 1,
    SHORT_URL: '/takeaway/shorturl',
    SHORT_URL_STATS: '/takeaway/shorturl/stats',
    CACHE_URL: 'webcache.googleusercontent.com'
};

export const CLIENT_TYPE_CONSTANTS = {
    FOOD_HUB: ['FOOD HUB', 'T2S', 'ULTIMATE-UK'],
    RESELLER: 'RESELLER',
    ORDERS2ME: 'ORDERS2ME'
};

export const APP_TYPE_CONSTANTS = {
    FOODHUB: 'FOODHUB',
    FRANCHISE: 'FRANCHISE',
    CUSTOMER: 'CUSTOMER'
};

export const RECOMMENDATION_CONSTANTS = {
    ITEM_RECOMMENDATION: '/recommendations/item',
    TA_RECOMMENDATION: '/recommendations/takeaway'
};

export const whatsAppURL = 'https://wa.me/?text=';
