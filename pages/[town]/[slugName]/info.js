import React, { } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'solito/router';
// import { theme } from 't2sbasemodule/Utils/StyleHelper';
// import T2SWebContainer from 't2sbasemodule/UI/CommonUI/T2SWebContainer';
// const TakeAwayDetail = function (props) {

//     return <TakeawayDetails buildLink={buildLink} {...props} />;
// };

const TakeAwayDetail = (props) => {
    const { storeData } = props || {};
    const { push } = useRouter();

    // const router = useRouter();
    // const { asPath } = router || {};
    // console.log('====buildLink', storeData, props, router, asPath);
    const orderNowClickHandler = () => {
        push(`/${storeData.town}/${storeData.slug_name}/orderNow`);
    }
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                {/* Left Side */}
                <View style={styles.headerLeft}>
                    <Image source={{ uri: 'https://foodhub.co.uk/compressed_images/logo.svg' }} style={styles.logo} resizeMode="contain" />

                    <Text style={styles.location}>AA11AA</Text>

                </View>

                {/* Right Side */}
                <View style={styles.headerRight}>
                    {['Home', 'Giftcard', 'Groceries', 'MyOrders', 'More'].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.navItem}>
                            <Text style={styles.navText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.safeAreaViewContainer}>
            {/* Header Section */}
            {renderHeader()}


            {/* Restaurant Overview */}
            <View style={styles.restaurantOverview}>
                <View style={[styles.restaurantMetrics, { justifyContent: 'space-between' }]}>
                    <Text style={styles.restaurantName}>{storeData.name}</Text>
                    <TouchableOpacity style={styles.orderButton} onPress={orderNowClickHandler}>
                        <Text style={styles.orderButtonText}>ORDER NOW</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.restaurantMetrics}>
                    <Text style={styles.metric}>0.02 mi</Text>
                    <Text style={styles.metric}>Delivery: £{storeData.charge?.charge || '0.01'}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.starIcon}>⭐</Text>
                        <Text style={styles.rating}>{storeData.rating} ({storeData.total_reviews}k+)</Text>
                    </View>
                </View>

            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Left Column */}
                <View style={styles.leftColumn}>
                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ABOUT {storeData.name.toUpperCase()}:</Text>
                        <Text style={styles.aboutText}>
                            {`Taste authentic ${storeData?.cuisines?.[0]?.name} cuisine at ${storeData.name}, a vibrant shop in ${storeData.town}, ${storeData.postcode}. With a focus on fresh, delicious item and quick service, {1} is the ultimate destination for those seeking authentic flavours.\n\nOrder effortlessly from {1}:\n\n1. Explore their menu on Foodhub.\n2. Add your favourites to the cart.\n3. Complete your order by choosing a payment method.\n\nPlace your order now for home delivery or collection in {2} and enjoy a memorable experience.`}
                        </Text>

                    </View>

                    {/* Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>INFO:</Text>
                        <Text style={styles.infoText}>
                            {storeData.description}   </Text>
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>LOCATION:</Text>
                        <Text style={styles.addressText}>
                            {storeData.street}, {storeData.city}, {storeData.city}, {storeData.postcode}
                        </Text>
                        <Text style={styles.phoneText}>{storeData.phone}</Text>
                        <View style={styles.mapContainer}>
                            <Text style={styles.mapPlaceholder}>Map showing location</Text>
                            <Text style={styles.weAreHere}>WE ARE HERE</Text>
                        </View>
                    </View>
                </View>

                {/* Right Column */}
                <View style={styles.rightColumn}>
                    {/* Cuisines Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>CUISINES:</Text>
                        <View style={styles.cuisinesContainer}>
                            {storeData.cuisines?.slice(0, 3).map((cuisine, index) => (
                                <View key={index} style={styles.cuisineItem}>
                                    <View style={styles.cuisineImage}>
                                        <Text style={styles.cuisineImageText}>{cuisine.name.charAt(0)}</Text>
                                    </View>
                                    <Text style={styles.cuisineName}>{cuisine.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Opening Hours Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OPENING HOURS:</Text>
                        <View style={styles.hoursTable}>
                            <View style={styles.hoursHeader}>
                                <Text style={styles.hoursHeaderText}>Day</Text>
                                <Text style={styles.hoursHeaderText}>Pickup</Text>
                                <Text style={styles.hoursHeaderText}>Delivery</Text>
                            </View>
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                                <View key={day} style={styles.hoursRow}>
                                    <Text style={styles.dayText}>{day}</Text>
                                    <Text style={styles.hoursText}>
                                        {storeData.opening_hours?.advanced?.Collection?.[day]?.[0]?.split(' ').slice(1).join(' ') || '12:00 AM - 11:59 PM'}
                                    </Text>
                                    <Text style={styles.hoursText}>
                                        {storeData.opening_hours?.advanced?.Delivery?.[day]?.[0]?.split(' ').slice(1).join(' ') || '12:00 AM - 11:59 PM'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export async function getServerSideProps(context) {
    // `resolvedUrl` gives you the full path including query string
    const currentPath = context.resolvedUrl;
    // `params` contains dynamic route params (if any)
    const params = context.params;
    // `query` contains query string values
    const query = context.query;
    try {
        const myHeaders = new Headers();
        myHeaders.append('accept', 'application/json, text/plain, */*');
        myHeaders.append('accept-language', 'en-GB,en;q=0.9');
        myHeaders.append('api-token', 'J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx');
        myHeaders.append(
            'authorization',
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOjg5MjU0NSwiaWF0IjoxNzU2NzEzMjk1LCJuYmYiOjE3NTY3MTMyOTUsImV4cCI6NDI0NTAzMzI5NSwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.62KdTCjR5X27SqeZzcS7db9H3woJTf0XR1UgrapImVI'
        );
        myHeaders.append('content-type', 'application/json');
        myHeaders.append(
            'deviceinfo',
            '{"os":"macOS","version":"11.22 (0901R1)","platform":"web","device":"Computer_Chrome","platform_id":1,"product_id":"14","path":"https://sit-foodhub-uk.stage.t2sonline.com/stoke-on-trent/test-nag-co-thor-uk-1/info"}'
        );
        myHeaders.append('franchise', 'sit-foodhub-uk.stage.t2sonline.com');
        myHeaders.append('origin', 'https://sit-foodhub-uk.stage.t2sonline.com');
        myHeaders.append('passport', '1');
        myHeaders.append('priority', 'u=1, i');
        myHeaders.append('referer', 'https://sit-foodhub-uk.stage.t2sonline.com/stoke-on-trent/test-nag-co-thor-uk-1/info');
        myHeaders.append('sec-ch-ua', '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"');
        myHeaders.append('sec-ch-ua-mobile', '?0');
        myHeaders.append('sec-ch-ua-platform', '"macOS"');
        myHeaders.append('sec-fetch-dest', 'empty');
        myHeaders.append('sec-fetch-mode', 'cors');
        myHeaders.append('sec-fetch-site', 'same-origin');
        myHeaders.append(
            'user-agent',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        );
        myHeaders.append(
            'Cookie',
            '_dd_s=logs=1&id=4b47e2ce-0100-41ce-97aa-9fdf12fa2713&created=1756713295473&expire=1756714195473; moe_uuid=950c1466-e923-4b91-bd6f-ae663115731b'
        );

        const raw = JSON.stringify({
            slug_name: params?.slugName,
            town: params?.town
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const res = await fetch(
            'https://sit-foodhub-uk.stage.t2sonline.com/api/franchise/takeaway/details?api_token=99b8ad5d2f9e80889efcd73bc31f7e7b&app_name=FRANCHISE&sid=mxkr-XRYB-yh',
            requestOptions
        );
        const json = await res.json();
        if (json.data?.[0]?.config_id) {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json, text/plain, */*");
            myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
            myHeaders.append("api-token", "J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx");
            myHeaders.append("authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOjg5MjU0NSwiaWF0IjoxNzU2NzA1MzkxLCJuYmYiOjE3NTY3MDUzOTEsImV4cCI6NDI0NTAyNTM5MSwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.Mz2mRqCa0pmiFX9rSmKjuLpjP0SUJ_ph2UECEpvBsRc");
            myHeaders.append("deviceinfo", "{\"os\":\"macOS\",\"version\":\"11.22 (0901R1)\",\"platform\":\"web\",\"device\":\"Computer_Chrome\",\"platform_id\":1,\"product_id\":\"14\",\"path\":\"https://sit-foodhub-uk.stage.t2sonline.com/stoke-on-trent/test-kaavya-takeaway/ordernow\"}");
            myHeaders.append("franchise", "sit-foodhub-uk.stage.t2sonline.com");
            myHeaders.append("language", "en-gb");
            myHeaders.append("locale", "united kingdom");
            myHeaders.append("passport", "1");
            myHeaders.append("priority", "u=1, i");
            myHeaders.append("referer", "https://sit-foodhub-uk.stage.t2sonline.com/stoke-on-trent/test-kaavya-takeaway/ordernow");
            myHeaders.append("sec-ch-ua", "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"");
            myHeaders.append("sec-ch-ua-mobile", "?0");
            myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
            myHeaders.append("sec-fetch-dest", "empty");
            myHeaders.append("sec-fetch-mode", "cors");
            myHeaders.append("sec-fetch-site", "same-origin");
            myHeaders.append("store", json.data?.[0]?.config_id);
            myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");
            myHeaders.append("Cookie", "_fbp=fb.1.1754639391613.572603390829669135; _ga=GA1.4.159782213.1754639394; _ga=GA1.1.159782213.1754639394; _ga_35KC3VWJ3J=GS2.1.s1754994213$o1$g1$t1754994735$j35$l0$h0; _gcl_au=1.1.1020154980.1755494882; _ga_SF7N5CMJMP=GS2.1.s1755521253$o2$g0$t1755521253$j60$l0$h0; _gid=GA1.4.1358295144.1756705386; moe_uuid=3ffdac18-3eb5-4c16-b906-84cb80e65dd5; _ga_27DP9TYFTS=GS2.1.s1756717539$o46$g1$t1756717546$j53$l0$h0; _ga_8VYB54SPHM=GS2.4.s1756717539$o44$g1$t1756717546$j53$l0$h0; _dd_s=logs=1&id=c9ff94ad-95f4-40a3-b381-008939a4798c&created=1756717546626&expire=1756718509880");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };
            const storeRes = await fetch("https://sit-foodhub-uk.stage.t2sonline.com/api/consumer/store?app_name=FRANCHISE&date=2025-09-01T09:06:50.148Z&host=sit-foodhub-uk.stage.t2sonline.com&WebDevice&poc2&storeId=8955860&sid=Izpt-7PPO-Ub", requestOptions)
            var storeData = await storeRes.json();
            return {
                props: {
                    currentPath,
                    params,
                    query,
                    data: json.data,
                    storeData
                }
            };
        } else {
            return {
                props: {
                    currentPath,
                    params,
                    query,
                    data: json.data,
                    storeData: null,
                    id: json.data
                }
            };
        }

    } catch (error) {
        console.error('SSR fetch error:', error);

        return {
            props: {
                error: JSON.stringify(error),
                currentPath,
                params,
                query,
                data: null,
                storeData: null
            }
        };
    }
}
export default TakeAwayDetail;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
        width: 120,
        height: 40,
        marginRight: 12,

    },
    location: {
        fontSize: 14,
        color: '#666'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    navItem: {
        marginLeft: 20
    },
    navText: {
        fontSize: 14,
        color: '#333'
    },
    safeAreaViewContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    container: {
        flex: 1
    },
    baseText: {
        fontFamily: 'Cochin'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },

    tagline: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },

    addressSelector: {
        marginBottom: 10
    },
    addressLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    navigation: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 20
    },

    orderButton: {
        backgroundColor: '#e74c3c',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    orderButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    // Restaurant Overview Styles
    restaurantOverview: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10
    },
    restaurantMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    metric: {
        fontSize: 14,
        color: '#666'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    starIcon: {
        fontSize: 16
    },
    rating: {
        fontSize: 14,
        color: '#666'
    },
    // Main Content Styles
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        gap: 30
    },
    leftColumn: {
        flex: 2
    },
    rightColumn: {
        flex: 1
    },
    // Section Styles
    section: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    aboutText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 10
    },
    readMore: {
        fontSize: 14,
        color: '#e74c3c',
        fontWeight: '500'
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10
    },
    phoneText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15
    },
    mapContainer: {
        height: 200,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    mapPlaceholder: {
        fontSize: 14,
        color: '#999'
    },
    weAreHere: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#e74c3c'
    },
    // Cuisines Styles
    cuisinesContainer: {
        flexDirection: 'row',
        gap: 15
    },
    cuisineItem: {
        alignItems: 'center'
    },
    cuisineImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    cuisineImageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666'
    },
    cuisineName: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    // Opening Hours Styles
    hoursTable: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5
    },
    hoursHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    hoursHeaderText: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
    },
    hoursRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    dayText: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center'
    },
    hoursText: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    }
});
