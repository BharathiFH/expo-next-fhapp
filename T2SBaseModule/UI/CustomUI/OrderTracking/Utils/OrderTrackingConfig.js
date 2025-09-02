import Colors from 't2sbasemodule/Themes/Colors';
import { isDarkTheme } from '../../../../../AppModules/BaseModule/ColorsHelper';

const isDarkMode = isDarkTheme();
export const ORDER_STATUS_ENUM = Object.freeze({
    PLACED: 1,
    COOKING: 2,
    READY: 3,
    COLLECT: 3.5,
    DELIVERED: 4,
    OTHER: 0
});

export const darkThemeDomains = ['supperlondonfh.com', 'localhost:8080'];

export const ORDER_STATUS_ICON_ANIMATION_JSON = {
    COLLECTION_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver.json'),
        READY: require('./OrderTrackingAnimation/Collection_silver.json')
    },
    COLLECTION_TYPE_WITH_STAGE_2: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_orange.json'),
        READY: require('./OrderTrackingAnimation/Collection_silver.json')
    },
    COLLECTION_TYPE_WITH_STAGE_3: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green.json'),
        READY: require('./OrderTrackingAnimation/Collection.json')
    },
    COLLECTION_TYPE_WITH_STAGE_4: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green.json'),
        READY: require('./OrderTrackingAnimation/Collection_green.json')
    },
    DELIVERY_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_2: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_orange.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_3: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_orange.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_4: {
        PLACED: require('./OrderTrackingAnimation/placed_green.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_green.json'),
        DELIVERED: require('./OrderTrackingAnimation/Deliverd.json')
    }
};

export const ORDER_STATUS_ICON_ANIMATION_JSON_BLACK = {
    COLLECTION_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/Placed_green_1.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver.json'),
        READY: require('./OrderTrackingAnimation/Collection_silver.json')
    },
    COLLECTION_TYPE_WITH_STAGE_2: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: require('./OrderTrackingAnimation/cooking_green_1.json'),
        READY: require('./OrderTrackingAnimation/Collection_silver.json')
    },
    COLLECTION_TYPE_WITH_STAGE_3: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: isDarkMode
            ? require('./OrderTrackingAnimation/Cooking_White.json')
            : require('./OrderTrackingAnimation/cooking_black.json'),
        READY: require('./OrderTrackingAnimation/collection_green_1.json')
    },
    COLLECTION_TYPE_WITH_STAGE_4: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: isDarkMode
            ? require('./OrderTrackingAnimation/Cooking_White.json')
            : require('./OrderTrackingAnimation/cooking_black.json'),
        READY: require('./OrderTrackingAnimation/collection_green_1.json')
    },
    DELIVERY_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/Placed_green_1.json'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_2: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: require('./OrderTrackingAnimation/cooking_green_1.json'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_3: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: isDarkMode
            ? require('./OrderTrackingAnimation/Cooking_White.json')
            : require('./OrderTrackingAnimation/cooking_black.json'),
        READY: require('./OrderTrackingAnimation/on_the_way_green_1.json'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver.json')
    },
    DELIVERY_TYPE_WITH_STAGE_4: {
        PLACED: isDarkMode ? require('./OrderTrackingAnimation/Placed_White.json') : require('./OrderTrackingAnimation/Placed_black.json'),
        COOKING: isDarkMode
            ? require('./OrderTrackingAnimation/Cooking_White.json')
            : require('./OrderTrackingAnimation/cooking_black.json'),
        READY: isDarkMode
            ? require('./OrderTrackingAnimation/On-the-way_White.json')
            : require('./OrderTrackingAnimation/on_the_way_black.json'),
        DELIVERED: require('./OrderTrackingAnimation/Deliverd.json')
    },
    GROCERY_DELIVERY_COOKING_SILVER: {
        COOKING: require('./OrderTrackingAnimation/grocery_gift_grey.json')
    },
    GROCERY_DELIVERY_COOKING_GREEN: {
        COOKING: require('./OrderTrackingAnimation/grocery_gift_green.json')
    },
    GROCERY_DELIVERY_COOKING_BLACK: {
        COOKING: require('./OrderTrackingAnimation/grocery_gift_black.json')
    }
};

export const ORDER_STATUS_ANIMATION_ICON = {
    PLACED: require('./OrderTrackingAnimation/Placed_White.json'),
    COOKING: require('./OrderTrackingAnimation/Cooking_White.json'),
    READY_DELIVERY: require('./OrderTrackingAnimation/On-the-way_White.json'),
    READY_COLLECTION: require('./OrderTrackingAnimation/Collection_White.json')
};

export const ORDER_STATUS_TEXT = {
    ORDER_PLACED: 'Order placed',
    PREPARING_YOUR_ORDER: 'Preparing your order',
    ON_THE_WAY: 'On the way',
    ORDER_IS_READY: 'Your order is ready'
};

export const DEFAULT_DISPLAY_PROPS = [
    {
        stageNo: ORDER_STATUS_ENUM.PLACED,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'PLACED'
    },
    {
        stageNo: ORDER_STATUS_ENUM.COOKING,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'COOKING'
    },
    {
        stageNo: ORDER_STATUS_ENUM.READY,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'READY'
    },
    {
        stageNo: ORDER_STATUS_ENUM.DELIVERED,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'DELIVERED'
    }
];

export const DEFAULT_DISPLAY_PROPS_COLLECTION = [
    {
        stageNo: ORDER_STATUS_ENUM.PLACED,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'PLACED'
    },
    {
        stageNo: ORDER_STATUS_ENUM.COOKING,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'COOKING'
    },
    {
        stageNo: ORDER_STATUS_ENUM.READY,
        isCompleted: false,
        textColor: Colors.textGrey,
        stagePointColor: Colors.textGrey,
        stageLinkColor: Colors.textGrey,
        stageKey: 'READY'
    }
];
