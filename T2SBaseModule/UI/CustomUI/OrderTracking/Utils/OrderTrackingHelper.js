import {
    DEFAULT_DISPLAY_PROPS,
    DEFAULT_DISPLAY_PROPS_COLLECTION,
    ORDER_STATUS_ENUM,
    ORDER_STATUS_ICON_ANIMATION_JSON,
    ORDER_STATUS_ICON_ANIMATION_JSON_BLACK
} from './OrderTrackingConfig';
import { ORDER_STATUS, ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import moment from 'moment-timezone';
import { DATE_FORMAT } from '../../../../Utils/DateUtil';
import { isValidElement } from '../../../../Utils/helpers';

/**
 *  This method is to get status text constant based on Order type and Display type
 *  Input params displayMode and orderType
 *  Return order status string object
 */
const getStatusText = (orderType, currentStatus, isFromOrderStatus, isNotARestaurant) => {
    if (orderType === ORDER_TYPE.COLLECTION) {
        return {
            PLACED: isFromOrderStatus
                ? LOCALIZATION_STRINGS.PLACED
                : currentStatus === ORDER_STATUS_ENUM.PLACED
                ? LOCALIZATION_STRINGS.PLACED
                : LOCALIZATION_STRINGS.ORDER_ACCEPTED,
            COOKING: LOCALIZATION_STRINGS[isNotARestaurant ? 'PACKING' : 'COOKING'],
            DELIVERED: LOCALIZATION_STRINGS.ORDER_DELIVERED,
            COLLECTED: LOCALIZATION_STRINGS.ORDER_COLLECTED,
            READY: LOCALIZATION_STRINGS.ORDER_READY
        };
    } else {
        return {
            PLACED: isFromOrderStatus
                ? LOCALIZATION_STRINGS.PLACED
                : currentStatus === ORDER_STATUS_ENUM.PLACED
                ? LOCALIZATION_STRINGS.PLACED
                : LOCALIZATION_STRINGS.ORDER_ACCEPTED,
            COOKING: LOCALIZATION_STRINGS[isNotARestaurant ? 'PACKING' : 'COOKING'],
            READY: LOCALIZATION_STRINGS.ON_THE_WAY,
            DELIVERED: LOCALIZATION_STRINGS.ORDER_DELIVERED
        };
    }
};

/**
 *  This method is to get status icon constant based on Order type
 *  Input params orderType
 *  Return order status icon object
 */
const getStatusIcon = (orderType, currentStatus, isFromOrderStatus, isNotARestaurant, isNotFoodProduct) => {
    return orderType === ORDER_TYPE.COLLECTION
        ? getAnimationForCollectionBasedOnCurrentStatus(currentStatus, isFromOrderStatus)
        : getAnimationForDeliveryBasedOnCurrentStatus(currentStatus, isFromOrderStatus, isNotARestaurant, isNotFoodProduct);
};

const getAnimationForDeliveryBasedOnCurrentStatus = (currentStatus, isFromOrderStatus, isNotARestaurant, isNotFoodProduct) => {
    if (isFromOrderStatus) {
        switch (currentStatus) {
            case ORDER_STATUS_ENUM.PLACED:
                return isNotARestaurant
                    ? {
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_1,
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.GROCERY_DELIVERY_COOKING_SILVER
                      }
                    : ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_1;
            case ORDER_STATUS_ENUM.COOKING:
                return isNotARestaurant || isNotFoodProduct
                    ? {
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_2,
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.GROCERY_DELIVERY_COOKING_GREEN
                      }
                    : ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_2;
            case ORDER_STATUS_ENUM.READY:
                return isNotARestaurant
                    ? {
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_3,
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.GROCERY_DELIVERY_COOKING_BLACK
                      }
                    : ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_3;
            case ORDER_STATUS_ENUM.DELIVERED:
                return isNotARestaurant
                    ? {
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_4,
                          ...ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.GROCERY_DELIVERY_COOKING_BLACK
                      }
                    : ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_4;
            case ORDER_STATUS_ENUM.OTHER:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.DELIVERY_TYPE_WITH_STAGE_1;
        }
    } else {
        switch (currentStatus) {
            case ORDER_STATUS_ENUM.PLACED:
                return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_1;
            case ORDER_STATUS_ENUM.COOKING:
                return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_2;
            case ORDER_STATUS_ENUM.READY:
                return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_3;
            case ORDER_STATUS_ENUM.DELIVERED:
                return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_4;
            case ORDER_STATUS_ENUM.OTHER:
                return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_1;
        }
    }
};

const getAnimationForCollectionBasedOnCurrentStatus = (currentStatus, isFromOrderStatus) => {
    if (isFromOrderStatus) {
        switch (currentStatus) {
            case ORDER_STATUS_ENUM.PLACED:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.COLLECTION_TYPE_WITH_STAGE_1;
            case ORDER_STATUS_ENUM.COOKING:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.COLLECTION_TYPE_WITH_STAGE_2;
            case ORDER_STATUS_ENUM.READY:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.COLLECTION_TYPE_WITH_STAGE_3;
            case ORDER_STATUS_ENUM.DELIVERED:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.COLLECTION_TYPE_WITH_STAGE_4;
            case ORDER_STATUS_ENUM.OTHER:
                return ORDER_STATUS_ICON_ANIMATION_JSON_BLACK.COLLECTION_TYPE_WITH_STAGE_1;
        }
    } else {
        switch (currentStatus) {
            case ORDER_STATUS_ENUM.PLACED:
                return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_1;
            case ORDER_STATUS_ENUM.COOKING:
                return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_2;
            case ORDER_STATUS_ENUM.READY:
                return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_3;
            case ORDER_STATUS_ENUM.DELIVERED:
                return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_4;
            case ORDER_STATUS_ENUM.OTHER:
                return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_1;
        }
    }
};

export const getDisplayProps = (currentStatus, orderType, isFromOrderStatus, isNotARestaurant, isNotFoodProduct) => {
    let updatedDisplayProps = [];
    const displayProps =
        (currentStatus === ORDER_STATUS_ENUM.READY || currentStatus === ORDER_STATUS_ENUM.DELIVERED) && orderType !== ORDER_TYPE.COLLECTION
            ? DEFAULT_DISPLAY_PROPS
            : orderType !== ORDER_TYPE.COLLECTION
            ? DEFAULT_DISPLAY_PROPS.filter((item) => item.stageNo !== ORDER_STATUS_ENUM.READY)
            : DEFAULT_DISPLAY_PROPS_COLLECTION;
    displayProps.forEach((item, key) => {
        let updatedItem;
        if (item.stageNo < currentStatus || currentStatus === DEFAULT_DISPLAY_PROPS.length) {
            updatedItem = {
                ...item,
                isCompleted: true,
                textColor: currentStatus === item.stageNo ? Colors.green : Colors.black,
                stageLinkColor: Colors.primaryColor,
                stagePointColor: Colors.primaryColor
            };
        } else if (item.stageNo === currentStatus) {
            updatedItem = {
                ...item,
                isCompleted: false,
                textColor: isFromOrderStatus ? Colors.green : Colors.black,
                stagePointColor: Colors.orange
            };
        } else {
            if (isFromOrderStatus) {
                updatedItem = {
                    ...item,
                    textColor: Colors.textGrey
                };
            } else {
                updatedItem = item;
            }
        }
        updatedDisplayProps[key] = {
            ...updatedItem,
            statusText: getStatusText(orderType, currentStatus, isFromOrderStatus, isNotARestaurant)[item.stageKey],
            statusIcon: getStatusIcon(orderType, currentStatus, isFromOrderStatus, isNotARestaurant, isNotFoodProduct)[item.stageKey]
        };
    });
    return updatedDisplayProps;
};

export const getOrderStatusEnum = (orderStatus) => {
    let orderStatusEnum;

    switch (orderStatus) {
        case ORDER_STATUS.PENDING:
        case ORDER_STATUS.PLACED:
            orderStatusEnum = ORDER_STATUS_ENUM.PLACED;
            break;
        case ORDER_STATUS.ACCEPTED:
        case ORDER_STATUS.COOKING:
            orderStatusEnum = ORDER_STATUS_ENUM.COOKING;
            break;
        case ORDER_STATUS.SENT:
            orderStatusEnum = ORDER_STATUS_ENUM.READY;
            break;
        case ORDER_STATUS.DELIVERED:
        case ORDER_STATUS.HIDDEN:
        case ORDER_STATUS.MANAGER_DELETED:
        case ORDER_STATUS.DELETED:
        case ORDER_STATUS.NOT_USED:
            orderStatusEnum = ORDER_STATUS_ENUM.DELIVERED;
            break;
        case ORDER_STATUS.CARD_PROCESSING:
            orderStatusEnum = ORDER_STATUS_ENUM.OTHER;
            break;
        default:
            orderStatusEnum = ORDER_STATUS_ENUM.OTHER;
            break;
    }
    return orderStatusEnum;
};

export const getMinutesAndSeconds = (timeZone, orderPlacedTime) => {
    const storeLocalTime = moment().tz(timeZone).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
    const placedTime = moment(orderPlacedTime).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
    const timeDifference = moment(storeLocalTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS).diff(
        moment(placedTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)
    );
    let duration = moment.duration(timeDifference);
    const minutes = Math.floor(duration.asMinutes());
    const seconds = Math.floor(duration.asSeconds());
    return { minutes, seconds };
};

export const getOrderStatusText = (status, orderType, isDynamicIsland = false, isNotARestaurant = false) => {
    if (isValidElement(status)) {
        switch (status) {
            case ORDER_STATUS.PLACED:
                return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_ORDER_PLACED : LOCALIZATION_STRINGS.LA_ORDER_PLACED;
            case ORDER_STATUS.ACCEPTED:
                return isDynamicIsland === true
                    ? LOCALIZATION_STRINGS[isNotARestaurant ? 'DI_PACKING_YOUR_ORDER' : 'DI_PREPARING_YOUR_ORDER']
                    : LOCALIZATION_STRINGS[isNotARestaurant ? 'LA_PACKING_YOUR_ORDER' : 'LA_PREPARING_YOUR_ORDER'];
            case ORDER_STATUS.SENT:
                if (orderType === ORDER_TYPE.COLLECTION) {
                    return isDynamicIsland === true
                        ? LOCALIZATION_STRINGS.DI_READY_FOR_COLLECTION
                        : LOCALIZATION_STRINGS.LA_READY_FOR_COLLECTION;
                } else {
                    return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_OUT_FOR_DELIVERY : LOCALIZATION_STRINGS.LA_OUT_FOR_DELIVERY;
                }
            case ORDER_STATUS.HIDDEN:
                if (orderType === ORDER_TYPE.COLLECTION) {
                    return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_ORDER_COLLECTED : LOCALIZATION_STRINGS.LA_ORDER_COLLECTED;
                } else if (orderType === ORDER_TYPE.DELIVERY) {
                    return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_ORDER_DELIVERED : LOCALIZATION_STRINGS.LA_ORDER_DELIVERED;
                } else {
                    return isDynamicIsland === true
                        ? LOCALIZATION_STRINGS.DI_ORDER_COLLECTED_ORDER_CANCELLED
                        : LOCALIZATION_STRINGS.LA_ORDER_CANCELLED;
                }
            case ORDER_STATUS.DELIVERED:
                if (orderType === ORDER_TYPE.DELIVERY) {
                    return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_ORDER_DELIVERED : LOCALIZATION_STRINGS.LA_ORDER_DELIVERED;
                } else if (orderType === ORDER_TYPE.COLLECTION) {
                    return isDynamicIsland === true ? LOCALIZATION_STRINGS.DI_ORDER_COLLECTED : LOCALIZATION_STRINGS.LA_ORDER_COLLECTED;
                } else {
                    return isDynamicIsland === true
                        ? LOCALIZATION_STRINGS.DI_ORDER_COLLECTED_ORDER_CANCELLED
                        : LOCALIZATION_STRINGS.LA_ORDER_CANCELLED;
                }
        }
    }
    return null;
};
