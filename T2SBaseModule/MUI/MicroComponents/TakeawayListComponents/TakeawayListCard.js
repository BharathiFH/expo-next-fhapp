import React, { useCallback, useMemo } from 'react';
import { currencyValue, distanceValue, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import Card from '../../Card';
import FlexBox from '../../FlexBox';
import Image from '../../Image';
import Box from '../../Box';
import TakeawayDetailsComponent from '../../../../FoodHubApp/TakeawayListModule/View/MicroComponents/TakeawayDetailsComponent';
import { useSelector } from 'react-redux';
import { selectCountryBaseFeatureGateResponse } from '../../../../AppModules/BasketModule/Redux/BasketSelectors';
import { getCurrency, isOrderTypeToggleEnabled, isWeb } from '../../../../AppModules/BaseModule/GlobalAppHelper';
import ReviewAndMilesComponent from '../../../../FoodHubApp/TakeawayListModule/View/MicroComponents/ReviewAndMilesComponent';
import {
    getCollectionWaitingTime,
    getDeliveryWaitingTime,
    getDistanceType,
    getStoreStatusDelivery,
    isDeliveryAvailable,
    isDeliveryChargeAvailable,
    isFreeDelivery,
    isNashTakeaway
} from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { getTotalReviewsCount } from '../../../../AppModules/ReviewModule/Utils/ReviewHelper';
import { FILTER_TAKEAWAY_CONSTANTS } from '../../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import { selectCurrencyFromS3Config, selectLanguageKey, selectTimeZone } from '../../../Utils/AppSelectors';
import { LOCALIZATION_STRINGS } from '../../../../AppModules/LocalizationModule/Utils/Strings';
import MinimumOrder from '../../../../FoodHubApp/TakeawayListModule/View/Components/MinimumOrder';
import { T2SText } from '../../../UI';
import { styles as TakeawayListstyles } from '../../../../FoodHubApp/TakeawayListModule/Style/TakeawayListWidgetStyle';
import { ORDER_TYPE } from '../../../../AppModules/BaseModule/BaseConstants';
import { View } from 'react-native';

const TakeawayListCard = ({ storeName = '', storeLogo = '', screenName, style, item, dispatchOpenMenuPage = () => {}, minHeight = 60 }) => {
    let viewType = FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST;
    let isSearched = null;
    const isWebDevice = isWeb();

    const externalLinks = useSelector((state) => state?.appState?.initialConfigWeb?.externalLinks);
    const featureGateResponse = useSelector(selectCountryBaseFeatureGateResponse);
    const countryId = useSelector((state) => state.appState.s3ConfigResponse?.country?.id);
    const selectedTAOrderType = useSelector((state) => state.addressState.selectedTAOrderType);
    const distanceType = useSelector((state) => state.appState.s3ConfigResponse?.country?.distance_type);
    const currency = useSelector(selectCurrencyFromS3Config);
    const defaultLanguage = useSelector(selectLanguageKey);
    const timeZone = useSelector(selectTimeZone);

    const renderTakeawayDetailsComponent = useCallback(() => {
        const { id, rating, total_reviews, slug_name, town } = item;
        let ratingValue = isValidElement(rating) && rating;
        return (
            <TakeawayDetailsComponent
                screenName={screenName}
                itemName={storeName}
                rating={ratingValue}
                reviews={total_reviews}
                isOrderTypeEnabled={isOrderTypeToggleEnabled(countryId, featureGateResponse)}
                onOrderNowPress={() => dispatchOpenMenuPage(item)}
                slugName={slug_name}
                town={town}
                storeId={id}
                isFromOffer={false}
                externalLinks={externalLinks}
            />
        );
    }, [item, countryId, featureGateResponse, screenName, externalLinks, storeName, dispatchOpenMenuPage]);

    const renderReviewAndRadioMilesView = useCallback(() => {
        let isTakeawayCurrentlyClosed = isValidElement(item?.isClosed) && item.isClosed;
        let milesText = `${
            isValidElement(item.distanceInMiles) ? distanceValue(item.distanceInMiles) + getDistanceType(distanceType) : ''
        }`;
        let ratingValue = isValidElement(item) && item?.rating;
        const { show_delivery, show_collection } = item;

        return (
            <ReviewAndMilesComponent
                screenName={screenName}
                itemName={item?.name}
                rating={ratingValue}
                selectedOrderType={selectedTAOrderType}
                viewType={viewType}
                milesText={milesText}
                distanceInMiles={item.distanceInMiles}
                totalReviewCount={getTotalReviewsCount(item?.total_reviews)}
                deliveryWaitingTime={getDeliveryWaitingTime({ item, timeZone })}
                collectionWaitingTime={getCollectionWaitingTime({ item, timeZone })}
                isTakeawayClosed={isTakeawayCurrentlyClosed}
                isOrderTypeEnabled={
                    viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST &&
                    isOrderTypeToggleEnabled(countryId, featureGateResponse) &&
                    !isValidString(isSearched)
                }
                show_delivery={show_delivery}
                show_collection={show_collection}
                isFromOffer={false}
                town={item?.town}
                isSimpleTakeawayListing={false}
            />
        );
    }, [item, countryId, distanceType, featureGateResponse, isSearched, screenName, selectedTAOrderType, viewType, timeZone]);

    const renderMinOrder = useCallback(
        (minOrder, itemName, currency, freeDelivery) => {
            return (
                <MinimumOrder
                    name={itemName}
                    minOrder={minOrder}
                    currency={currency}
                    freeDelivery={freeDelivery}
                    screenName={screenName}
                    defaultLanguage={defaultLanguage}
                    isFromOffer={false}
                />
            );
        },
        [defaultLanguage, screenName]
    );

    const renderDeliveryView = useCallback(() => {
        const currencySymbole = getCurrency(currency);
        const { show_delivery, name } = isValidElement(item) && item;
        let storeStatusDelivery = getStoreStatusDelivery(item);
        let deliveryCharge = isValidElement(item?.delivery) ? item.delivery : item?.charge;
        const deliveryChargeEllipsis = isWebDevice ? 1 : 2;

        let isNashTA = isValidElement(item?.assign_driver_through) && isNashTakeaway(item?.assign_driver_through);
        return isDeliveryAvailable(show_delivery, storeStatusDelivery) && !isNashTA && isValidElement(deliveryCharge) ? (
            <>
                <View style={TakeawayListstyles.deliveryTAViewStyle}>
                    {isDeliveryChargeAvailable(deliveryCharge) ? (
                        <T2SText
                            screenName={screenName}
                            id={item.name + '_' + 'delivery_charges_text'}
                            numberOfLines={deliveryChargeEllipsis}
                            style={[TakeawayListstyles.deliveryCharge]}>
                            {LOCALIZATION_STRINGS.DELIVERY + ': '}
                            {currencyValue(deliveryCharge.charge, currencySymbole, 2)}
                            {renderMinOrder(deliveryCharge.minimum_order, name, currencySymbole, false)}
                        </T2SText>
                    ) : isFreeDelivery(deliveryCharge) ? (
                        <T2SText
                            screenName={screenName}
                            id={item.name + '_' + 'delivery_charges_text'}
                            numberOfLines={deliveryChargeEllipsis}
                            style={[TakeawayListstyles.deliveryCharge]}>
                            {LOCALIZATION_STRINGS.FREE_DELIVERY}
                            {renderMinOrder(deliveryCharge?.minimum_order, name, currencySymbole, true)}
                        </T2SText>
                    ) : null}
                </View>
            </>
        ) : null;
    }, [item, currency, isWebDevice, renderMinOrder, screenName]);

    const renderBottomView = useCallback(() => {
        const { show_delivery } = isValidElement(item) && item;

        let orderTypeEnabled = isOrderTypeToggleEnabled(countryId, featureGateResponse);
        let storeStatusDelivery = getStoreStatusDelivery(item);

        if (viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST && orderTypeEnabled && !isValidString(isSearched)) {
            if (selectedTAOrderType === ORDER_TYPE.DELIVERY && isDeliveryAvailable(show_delivery, storeStatusDelivery)) {
                return renderDeliveryView(item);
            }
        }
        return null;
    }, [item, countryId, featureGateResponse, isSearched, selectedTAOrderType, viewType, renderDeliveryView]);

    const renderInfo = useMemo(
        () => (
            <FlexBox flex={1} flexDirection={'column'} pr={'sm'} justifyContent="space-around">
                {renderTakeawayDetailsComponent()}
                <FlexBox flexDirection={'row'} alignItems="center" pt={'md'}>
                    {renderReviewAndRadioMilesView()}
                    {renderBottomView()}
                </FlexBox>
            </FlexBox>
        ),
        [renderTakeawayDetailsComponent, renderReviewAndRadioMilesView, renderBottomView]
    );

    const renderImage = useMemo(
        () =>
            isValidString(storeLogo) ? (
                <Box mr={'md'}>
                    <Image bordered={true} resizeMode={'contain'} radius={'sm'} source={{ uri: storeLogo }} width={60} height={60} />
                </Box>
            ) : null,
        [storeLogo]
    );

    const renderContent = useMemo(
        () => (
            <FlexBox minHeight={minHeight}>
                {renderImage}
                {renderInfo}
            </FlexBox>
        ),
        [renderInfo, renderImage, minHeight]
    );

    return (
        <Card elevation={'sm'} bordered style={style}>
            {renderContent}
        </Card>
    );
};

export default React.memo(TakeawayListCard, (prevProps, nextProps) => {
    return prevProps.storeName === nextProps.storeName;
});
