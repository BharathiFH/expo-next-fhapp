import { selectOrderWaitingTime } from 'appmodules/BasketModule/Redux/BasketSelectors';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { T2SIcon, T2SText, T2SView } from 't2sbasemodule/UI';
import { preOrderSelectDateOnly } from 't2sbasemodule/Utils/AppSelectors';
import { ORDER_TYPE, ORDER_TYPE_STATUS } from '../../../AppModules/BaseModule/BaseConstants';
import { LOCALIZATION_STRINGS } from '../../../AppModules/LocalizationModule/Utils/Strings';
import { selectNextAvailableDaysSlots, selectUserSelectedPreorderSlot } from '../../../AppModules/PreorderModule/Redux/PreorderSelectors';
import { isPreorderAvailable } from '../../../AppModules/PreorderModule/Utils/PreorderHelper';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { getCollectionWaitingTime, getDeliveryWaitingTime } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { Colors } from '../../Themes';
import { VIEW_ID } from '../../Utils/Constants';
import { boolValue, firstLetterCapital, isValidElement } from '../../Utils/helpers';
import { StoreStatusIndicatorStyles } from './Style/StoreStatusIndicatorStyle';
import useResponsiveStyle from './Style/UseResponsiveStyle';
import { selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';

export const StoreStatusIndicator = ({ screenName, wrapperStyle = {}, defaultOrderType = null, showText = true }) => {
    const storeConfigResponse = useSelector((state) => state.appState.storeConfigResponse);
    const storeConfigShowDelivery = useSelector((state) => state.appState.storeConfigResponse?.show_delivery);
    const nextAvailableDaysSlots = useSelector(selectNextAvailableDaysSlots);
    const storeConfigShowCollection = useSelector((state) => state.appState.storeConfigResponse?.show_collection);
    const orderWaitingTime = useSelector(selectOrderWaitingTime);
    const timeZone = useSelector(selectTimeZone);
    const userSelectedSlot = useSelector(selectUserSelectedPreorderSlot);
    const selectedPreorderDate = useMemo(() => {
        const [datePart] = userSelectedSlot?.split(' ') || [];
        return datePart || null;
    }, [userSelectedSlot]);
    const displayDeliveryTime = useMemo(() => {
        return getDeliveryWaitingTime({
            item: storeConfigResponse,
            preOrderStatus: isPreorderAvailable({ nextNearBySlot: nextAvailableDaysSlots, orderType: ORDER_TYPE.DELIVERY }),
            orderWaitingTime,
            timeZone,
            customDate: selectedPreorderDate
        });
    }, [storeConfigResponse, orderWaitingTime, timeZone, nextAvailableDaysSlots, selectedPreorderDate]);
    const displayCollectionTime = useMemo(() => {
        return getCollectionWaitingTime({
            item: storeConfigResponse,
            preOrderStatus: isPreorderAvailable({ nextNearBySlot: nextAvailableDaysSlots, orderType: ORDER_TYPE.COLLECTION }),
            orderWaitingTime,
            timeZone,
            customDate: selectedPreorderDate
        });
    }, [storeConfigResponse, orderWaitingTime, timeZone, nextAvailableDaysSlots, selectedPreorderDate]);
    const menuAvailableObject = useSelector((state) => state.menuState.menuAvailableObject);
    const isDeliveryMenuAvailable = isValidElement(menuAvailableObject?.delivery) ? menuAvailableObject.delivery : true;
    const isCollectionMenuAvailable = isValidElement(menuAvailableObject?.collection) ? menuAvailableObject.collection : true;

    const styles = useResponsiveStyle(StoreStatusIndicatorStyles);
    const closeText = firstLetterCapital(ORDER_TYPE_STATUS.CLOSED);
    const defaultDelivery = defaultOrderType === ORDER_TYPE.DELIVERY;
    const defaultCollection = defaultOrderType === ORDER_TYPE.COLLECTION;

    const deliveryAvailable = boolValue(storeConfigShowDelivery) && isDeliveryMenuAvailable && !isValidElement(defaultOrderType);
    const collectionAvailable = boolValue(storeConfigShowCollection) && isCollectionMenuAvailable && !isValidElement(defaultOrderType);
    const show_single_orderType_toggle = useSelector((state) => state.appConfiguratorState?.show_single_orderType_toggle);
    const preOrderDateOnly = useSelector(preOrderSelectDateOnly);
    const showIcon = deliveryAvailable || defaultDelivery || collectionAvailable || defaultCollection;
    const showTime = !isValidElement(defaultOrderType);
    const getStatus = () => {
        if (deliveryAvailable || defaultDelivery) {
            return LOCALIZATION_STRINGS.DELIVERY_ONLY_TXT;
        } else if (collectionAvailable || defaultCollection) {
            return LOCALIZATION_STRINGS.COLLECTION_ONLY_TXT;
        } else {
            return closeText;
        }
    };

    const getContent = () => {
        return deliveryAvailable || defaultDelivery ? (
            <T2SText webID={!isDeliveryMenuAvailable ? VIEW_ID.CLOSE_TEXT : VIEW_ID.WAIT_TIME} style={styles.timeText}>
                {!isDeliveryMenuAvailable ? closeText : displayDeliveryTime}
            </T2SText>
        ) : collectionAvailable || defaultCollection ? (
            <T2SText webID={!isCollectionMenuAvailable ? VIEW_ID.CLOSE_TEXT : VIEW_ID.WAIT_TIME} style={styles.timeText}>
                {!isCollectionMenuAvailable ? closeText : displayCollectionTime}
            </T2SText>
        ) : null;
    };

    return show_single_orderType_toggle !== false ? (
        <T2SView
            webID={VIEW_ID.STORE_STATUS_INDICATOR}
            style={[showText ? styles.StoreStatusIndicatorView : styles.StoreStatusIndicatorIconView, wrapperStyle]}>
            {showIcon && showText ? (
                <T2SIcon
                    screenName={screenName}
                    icon={defaultDelivery || deliveryAvailable ? FONT_ICON.DELIVERY_CAR_FILL : FONT_ICON.COLLECTION_FILL}
                    size={20}
                    color={Colors.green}
                />
            ) : null}
            <T2SView style={{ alignItems: 'center' }}>
                <T2SText
                    webID={defaultDelivery || deliveryAvailable ? VIEW_ID.DELIVERY_TEXT : VIEW_ID.COLLECTION_TEXT}
                    style={styles.statusText}>
                    {getStatus()}
                </T2SText>
                {showTime && !preOrderDateOnly ? getContent() : null}
            </T2SView>
        </T2SView>
    ) : null;
};
