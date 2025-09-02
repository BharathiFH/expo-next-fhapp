export const Constants = {
    SUCCESS: 'success',
    FAILED: 'failed',
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    NA: 'NA',
    SESSION_SKIPPED: 'SESSION_SKIPPED',
    CHALLENGED: 'challenged',
    BANNED: 'BANNED',
    ACTIVE: 'ACTIVE',
    SUCCEEDED: 'Succeeded',
    CANCELLED: 'cancelled'
};
export const OS_PLATFORM = {
    iOS: 'iOS',
    ANDROID: 'ANDROID'
};

export const HapticFrom = {
    ITEM_ADDED: 'item_added',
    ADDON_ADDED: 'addon_added',
    ORDER_PLACED: 'order_placed',
    TAKEAWAY_ITEM_CLICKED: 'takeaway_item_clicked',
    ADD_TO_BASKET_WITHOUT_ITEM_SELECTED: 'add_to_basket_without_item_selected',
    ADD_ON_NOT_SELECTED: 'add_on_not_selected',
    TEXT_INPUT_ERROR: 'text_input_error',
    BOTTOM_TAB_OPTION_SELECTED: 'bottom_tab_option_selected',
    CUISINE_CLICKED: 'cuisine_clicked',
    FILTER_OPTION_CLICKED: 'filter_option_clicked',
    SORT_OPTION_CLICKED: 'sort_option_clicked',
    NONE: 'none'
};

export const HapticType = {
    NOTIFICATION_SUCCESS: 'notificationSuccess',
    IMPACT_MEDIUM: 'impactLight',
    IMPACT_LIGHT: 'impactLight'
};

export const NETWORK_CONSTANTS = {
    API_ERROR: 'API_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    EVENT_NAME: {
        API_ERROR_RESPONSE: 'APIErrorResponse'
    },
    ERROR: 'Error',
    ERROR_STATUS: 'ErrorStatus'
};

export const FONT_FAMILY = {
    MEDIUM: 'Lato-Medium',
    REGULAR: 'Lato-Regular',
    SEMI_BOLD: 'Lato-Semibold',
    LIGHT: 'Lato-Light',
    THIN: 'Lato-Thin',
    BOLD: 'Lato-Bold',
    BLACK: 'Lato-Black',
    HEAVY: 'Lato-Heavy'
};
export const RANDOM_STRING_ALPHA_NUMERIC = {
    ALPHANUMERIC: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
};

export const VIEW_ID = {
    ADDON_BUTTON: 'addon_button',
    ADDON_TEXT: 'addon_text',
    TIMER_TEXT: 'timer_text',
    MODAL_TITLE_TEXT: 'title',
    MODAL_DESCRIPTION_TEXT: 'description',
    MODAL_NEGATIVE_BUTTON: 'negativeButton',
    MODAL_POSITIVE_BUTTON: 'positiveButton',
    DELETE_POPUP_MODAL_CLOSE_ICON: 'delete_popup_modal_close_icon',
    CURRENT_LOCATION_SECTION: 'current_location_section',
    PREFIX: 'prefix',
    ERROR_MESSAGE: 'error_message',
    LABEL: 'label',
    FRANCHISE_HOME_PAGE_SHIMMER_1: 'franchise_home_page_1',
    FRANCHISE_HOME_PAGE_SHIMMER_2: 'franchise_home_page_2',
    FRANCHISE_HOME_PAGE_SHIMMER_3: 'franchise_home_page_3',
    FRANCHISE_HOME_PAGE_SHIMMER_4: 'franchise_home_page_4',
    PREFIX_VIEW: 'prefix_view',
    DELIVERY_TEXT: 'delivery_text',
    COLLECTION_TEXT: 'collection_text',
    CLOSE_TEXT: 'close_text',
    WAIT_TIME: 'wait_time',
    STORE_STATUS_INDICATOR: 'store_status_indicator',
    CHECKOUT_SECTION: 'checkout_section',
    CHECKOUT_SECTION_CARD: 'checkout_section_card',
    DELIVERY_NOT_AVAILABLE_TEXT: 'delivery_not_available_text',
    ENTER_ADDRESS_BUTTON: 'enter_address_button',
    ADD_ADDRESS_MESSAGE: 'add_address_message',
    ADD_ADDRESS_TEXT: 'add_address_text',
    ADD_ADDRESS_HELP_TEXT: 'add_address_help_text',
    ADD_ADDRESS_BUTTON: 'add_address_button',
    ADD_ADDRESS_SECTION_HEADER: 'add_address_section_header',
    GIFT_CARD_WEBVIEW_COMPONENT: 'gift_card_webview_component',
    SEARCH_ICON: 'search_icon',
    SEARCH_BAR_TEXT_INPUT: 'search_bar_text_input',
    GPS_ICON: 'gps_icon',
    CLOSED_ICON_TOUCHABLE: 'closed_icon_touchable',
    SEARCH_WITH_GPS_CONTAINER: 'search_with_gps_container',
    SEARCH_HEADER_CONTAINER: 'search_header_container',
    SEARCH_INPUT_CONTAINER: 'search_input_container',
    GIFT_CARD_REDEEM_NOW_BUTTON: 'gift_card_redeem_now_button',
    GIFT_CARD_REDEEM_STEPS_TEXT: 'gift_card_redeem_steps_text',
    GIFT_CARD_REDEEM_STEPS_TEXT_COUNT: 'gift_card_redeem_steps_text_count',
    HOW_TO_REDEEM_TEXT: 'how_to_redeem_text',
    GIFT_CARD_POPUP_MODAL_CLOSE_ICON: 'gift_card_redeem_popup_close_icon'
};

export const MESSAGE_ICON = {
    DANGER: 'danger',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info'
};

export const DUMMY_ADDON_ITEM = {
    background_color: '',
    categoryIndex: 0,
    created_date: '2023-02-01 09:35:43',
    font_color: '',
    host: 'd-1337.t2scdn.com',
    id: 380793788,
    isSelected: true,
    is_print_label: '0',
    item_addon_cat: 24898193,
    modifier: 'NONE',
    name: 'Curly Fries',
    next_move: '',
    nutrition: null,
    offer: 'NONE',
    partner_id: null,
    pos: 2,
    price: '3.00',
    region_tax_id: null,
    second_language_name: '',
    show_on_receipt: 1,
    show_online: 1,
    suitable_diet: null,
    sys: '',
    tax_percentage: null,
    type: 'radio',
    updated_at: '2023-02-01 09:36:13',
    user: ''
};

export const COMMON_TEXT = {
    FROM: 'From ',
    LAT: 'lat',
    LNG: 'lng'
};

export const SAFE_AREA_CONSTRAINTS = {
    POSITION: ['top', 'left', 'right', 'bottom'],
    POSITION_NO_BOTTOM: ['top', 'left', 'right'],
    POSITION_NO_TOP_BOTTOM: ['left', 'right']
};
export const DIMENSION_MODES = {
    IS_LARGE_SCREEN_MODE: 'isLargeScreenMode',
    IS_TABLET_LANDSCAPE_MODE: 'isTabletLandscapeMode',
    IS_TABLET_PORTRAIT_MODE: 'isTabletPortraitMode',
    IS_SMALL_SCREEN_MODE: 'isSmallScreenMode'
};
export const LARGE_SCREEN_WIDTH = 1024;
export const TABLET_PORTRAIT_MAXIMUM = 1080;
export const TABLET_SCREEN_WIDTH = 728;
export const SMALL_SCREEN_WIDTH = 530;
export const ON_ENTER_PRESS = 'Enter';
export const BIG_FODDIE_FRANCHISE_ID = 26;

export const CASE = {
    UPPER_CASE: 'UPPER_CASE',
    LOWER_CASE: 'LOWER_CASE',
    CAMEL_CASE: 'CAMEL_CASE'
};

export const FRANCHISE_APP_NAMES = {
    FOODHUB: 'FOODHUB',
    BIGFOODIE: 'Bigfoodie',
    EATAPPY: 'EatAppy'
};

export const NAVIGATION = {
    NAVIGATE: 'NAVIGATE',
    REPLACE: 'REPLACE',
    RESET: 'RESET'
};

export const LOCAL_SCHEMA = {
    FOODHUB_SCHEMA: 'Foodhub',
    BIGFOODIE_SCHEMA: 'Bigfoodie',
    RESTAURANT: 'Restaurant',
    FOODHUB_ESTABLISHMENT: 'FoodEstablishment',
    LOGO_URL: 'https://foodhub.co.uk/compressed_images/logo.svg',
    CUISINE_URL: 'https://bigfoodie.co.uk/cuisines',
    LOCATION_BANNER: 'https://foodhub.co.uk/compressed_images/location-banner.jpg'
};

export const DATA_TYPE = {
    OBJECT: 'object',
    STRING: 'string',
    FUNCTION: 'function',
    BOOLEAN: 'boolean',
    NUMBER: 'number'
};
export const Weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const ADVANCED_DISCOUND_SLIDE_ENABLE = {
    DESKTOP: 3,
    MOBILE: 1
};

export const ANIMATION_CONSTANTS = {
    CONFETTI: 'confetti',
    PULL_TO_REFRESH: 'pullToRefresh',
    GOAL_POST_ANIMATION: 'goalPostAnimation'
};

export const NETINFO_CONSTANTS = {
    APP_TIMEOUT: 10000, // 10 Seconds
    WEB_TIMEOUT: 20000, // 20 Seconds
    REACHABILITY_URL: 'https://clients3.google.com/generate_204'
};

export const ORDER_TIME_MESSAGE = {
    DEFAULT_COLLECTION_TIME: 'default collection time',
    DEFAULT_DELIVERY_TIME: 'default delivery time',
    ZONE_SPECIFIC_DELIVERY_TIME: 'zone specific delivery time',
    ITEM_PREP_TIME: 'item prep time',
    ORDER_TIME_BASED_ON_ORDER_SIZE: 'order time based on order size',
    DEFAULT: 'default',
    PREP_TIME: 'prep_time',
    ORDER_SIZE: 'order_size',
    ORDER_VOLUME: 'order_volume',
    DEFAULT_PREP_TIME: 'default_prep_time',
    DEFAULT_ORDER_SIZE: 'default_order_size',
    DEFAULT_ORDER_VOLUME: 'default_order_volume',
    PREP_TIME_ORDER_SIZE: 'prep_time_order_size',
    PREP_TIME_ORDER_VOLUME: 'prep_time_order_volume',
    ORDER_SIZE_VOLUME: 'order_size_volume',
    DEFAULT_PREP_TIME_ORDER_SIZE: 'default_prep_time_order_size',
    DEFAULT_PREP_TIME_ORDER_VOLUME: 'default_prep_time_order_volume',
    DEFAULT_ORDER_SIZE_VOLUME: 'default_order_size_volume',
    PREP_TIME_ORDER_SIZE_VOLUME: 'prep_time_order_size_volume',
    DEFAULT_PREP_TIME_ORDER_SIZE_VOLUME: 'default_prep_time_order_size_volume'
};

export const ZOHO_SALES_ID = 'zsiqcustomcss';

export const CUSTOM_META = ['rupeyaltunstall.com'];

export const reviewProductId = {
    FOODHUB: 4
};
export const googleBotUserAgent = /Googlebot|GoogleOther|Google-InspectionTool|Storebot-Google|googlebot/;

export const STORE_TYPE = {
    TAKEAWAY: 'TAKEAWAY',
    TAKEOUT: 'TAKEOUT',
    GIFT: 'GIFT'
};

export const STORE_TYPE_MAPPING = {
    [STORE_TYPE.TAKEOUT]: {
        Takeaway: 'Restaurant',
        takeaway: 'restaurant',
        Takeout: 'Restaurant',
        takeout: 'restaurant'
    },
    [STORE_TYPE.GIFT]: {
        Takeaway: 'Store',
        takeaway: 'store',
        restaurant: 'store',
        Restaurant: 'Store',
        Food: 'Flowers',
        food: 'flowers',
        tasty: 'your favourite'
    },
    [STORE_TYPE.TAKEAWAY]: { Takeaway: 'Takeaway', takeaway: 'takeaway' },
    RESTAURANTS_WITH_AMP: 'Restaurants & Restaurants',
    RESTAURANTS_WITH_AND: 'Restaurants and Restaurants',
    RESTAURANTS: 'Restaurants'
};

export const VISIBILITY_STATE_CONSTANTS = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden'
};

export const TIME_TYPE = {
    HOUR: 'hour',
    DAY: 'day',
    MINUTE: 'min'
};
