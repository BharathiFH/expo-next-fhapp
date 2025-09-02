import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import pako from 'pako';
import { Buffer } from 'buffer';

const MenuComponent = ({ takeAwayName, bannerUrl, logoUrl, menu }) => {
    const [orderType, setOrderType] = useState('delivery');
    const [activeCategory, setActiveCategory] = useState(null);
    const flatListRef = useRef(null);
    // const [bannerUrl, setBannerUrl] = useState('');
    // const [logoUrl,setLogoUrl] = useState('')
    // const [takeAwayName,setTakeAwayName] = useState('')
    // const [menu,setMenu] = useState({})
    console.log('Menu in Frontened', menu);
    console.log('Lenght', menu.length);
    console.log('Menu id in Frontened', menu[0].subcat);

    // 🔹 Fetch API in useEffect (client-side)
    //  useEffect(() => {
    //     const fetchStoreData = async () => {
    //         try {
    //             const resInfo = await fetch(
    //                 'https://sit-foodhub-uk.stage.t2sonline.com/api/consumer/store?app_name=FRANCHISE&date=2025-08-29T11%3A37%3A50.207Z&host=sit-foodhub-uk.stage.t2sonline.com&WebDevice=null&poc2=null&storeId=8051103&sid=rE7v-Gdtl-Cw',
    //                 {
    //                     method: 'GET',
    //                     headers: {
    //                         accept: 'application/json, text/plain, */*',
    //                         'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    //                         'api-token': 'J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx',
    //                         authorization:
    //                             'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOjg5MjU0NSwiaWF0IjoxNzU2NDY0OTk4LCJuYmYiOjE3NTY0NjQ5OTgsImV4cCI6NDI0NDc4NDk5OCwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.yGsFZUYzKRe2c2Vr32gPvFmjvRWY7RCxUUMrnk0n3nM',
    //                         deviceinfo:
    //                             '{"os":"macOS","version":"11.21 (0802R1)","platform":"web","platform_id":1,"product_id":"14","path":"http://localhost:8080/stoke-on-trent/test-test-apiautomation-uk8/ordernow"}',
    //                         franchise: 'sit-foodhub-uk.stage.t2sonline.com',
    //                         language: 'en-gb',
    //                         locale: 'united kingdom',
    //                         passport: '1',
    //                         store: '8051103',
    //                         'user-agent':
    //                             'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
    //                     }
    //                 }
    //             );

    //             if (!resInfo.ok) {
    //                 throw new Error(`Failed to fetch: ${resInfo.status}`);
    //             }

    //             const json = await resInfo.json();
    //             console.log('Fetched JSON:', json.name);

    //             // 🔹 Update state
    //             setTakeAwayName(json?.name || '');
    //             setBannerUrl(json?.setting?.banner_url || '');
    //             setLogoUrl(json?.setting?.logo_url || '');
    //         } catch (error) {
    //             console.error('Client fetch error:', error);
    //         }
    //     };

    //     fetchStoreData();
    // }, []);

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

    const renderInfo = () => {
        return (
            <View style={styles.halfOverlay}>
                {/* Small Logo (floating on center) */}
                <Image
                    source={{
                        uri: logoUrl
                    }}
                    style={styles.restaurantLogo}
                />

                {/* Row: Name + About */}
                <View style={styles.nameRow}>
                    <Text style={styles.restaurantName}>{takeAwayName}</Text>
                    <TouchableOpacity>
                        <Text style={styles.aboutText}>ℹ️ About</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.nameRow}>
                    {/* Address */}
                    <Text style={styles.address}>50 Victoria Park Road, Stoke On Trent • 0.02 mi • Delivery: £0.01 (min: £0.50)</Text>
                    {/* Row: Rating aligned right */}
                    <View style={styles.ratingRow}>
                        <Text style={styles.rating}>⭐ 3.5 (1.6k+)</Text>
                    </View>
                </View>

                {/* Toggle */}
                {renderToggle()}
            </View>
        );
    };

    const renderToggle = () => {
        return (
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleButton, orderType === 'delivery' && styles.activeToggle]}
                    onPress={() => setOrderType('delivery')}>
                    <Text style={[styles.toggleText, orderType === 'delivery' && styles.activeToggleText]}>Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleButton, orderType === 'pickup' && styles.activeToggle]}
                    onPress={() => setOrderType('pickup')}>
                    <Text style={[styles.toggleText, orderType === 'pickup' && styles.activeToggleText]}>Pickup</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderBanner = () => {
        return (
            <View style={styles.bannerWrapper}>
                {/* Banner Image */}
                <Image
                    source={{
                        uri: bannerUrl
                    }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />

                {/* Floating Overlay */}
                {renderInfo()}
            </View>
        );
    };

    const handleScrollToCategory = (catIndex) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: catIndex,
                animated: true,
                viewPosition: 0
            });
            setActiveCategory(catIndex);
        }
    };

    const renderMenu = () => {
        return (
            <View style={styles.menuContainer}>
                {/* left Sidebar */}
                <View style={styles.sidebar}>
                    <View style={{ width: 300, alignSelf: 'flex-end', backgroundColor: '#FFFFFF', borderRadius: 12, right: 10 }}>
                        <FlatList
                            style={{ height: 1000 }}
                            showsVerticalScrollIndicator={true} // 👈 adds scroll bar
                            nestedScrollEnabled={true}
                            data={menu}
                            keyExtractor={(item, index) => `sidebar-${index}`}
                            // contentContainerStyle={{ paddingBottom: 40 }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[styles.categoryItem, activeCategory === index && styles.activeCategory]}
                                    onPress={() => handleScrollToCategory(index)}>
                                    <Text style={[styles.categoryText, activeCategory === index && styles.activeCategoryText]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>

                {/* Right side (categories & items) */}
                <FlatList
                    ref={flatListRef}
                    data={menu}
                    keyExtractor={(item, index) => `content-${index}`}
                    style={styles.content}
                    onMomentumScrollEnd={(event) => {
                        // Auto highlight active category while scrolling
                        const offsetY = event.nativeEvent.contentOffset.y;
                        let currentIndex = 0;
                        for (let i = 0; i < menu.length; i++) {
                            if (offsetY >= i * 300) currentIndex = i; // rough estimate, can be improved
                        }
                        setActiveCategory(currentIndex);
                    }}
                    onScrollToIndexFailed={(info) => {
                        flatListRef.current?.scrollToOffset({
                            offset: info.averageItemLength * info.index,
                            animated: true
                        });
                        setTimeout(() => {
                            flatListRef.current?.scrollToIndex({
                                index: info.index,
                                animated: true
                            });
                        }, 100);
                    }}
                    renderItem={({ item }) => (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryHeader}>{item.name}</Text>

                            {item.subcat.map((sub, subIndex) => (
                                <View key={subIndex} style={styles.subCategoryContainer}>
                                    <Text style={styles.subCategoryTitle}>{sub.name}</Text>

                                    <View style={styles.itemsGrid}>
                                        {sub.item.map((itm, itmIndex) => (
                                            <View key={itmIndex} style={styles.itemCard}>
                                                <View style={{ width: '100%', height: 350 }}>
                                                    <Image
                                                        source={{
                                                            uri: 'https://assets.foodhub.com/images/placeholder/subcat_noimage.png'
                                                        }}
                                                        style={{ width: '100%', height: '100%' }}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                                <View style={{ marginTop: 35 }}>
                                                    <Text style={styles.itemName}>{itm.name}</Text>
                                                    <Text style={styles.itemPrice}>£{itm.price}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                />
            </View>
        );
    };

    return (
        <>
            {renderHeader()}
            {renderBanner()}
            {renderMenu()}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    takeawayListScreenView: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
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
        marginRight: 12
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
    bannerOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 8
    },
    bannerImage: {
        width: '100%',
        height: '100%'
    },
    bannerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    bannerWrapper: {
        position: 'relative',
        width: '100%',
        height: 200
    },
    halfOverlay: {
        position: 'absolute',
        bottom: -80,
        left: '10%',
        right: '10%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,

        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8
    },
    restaurantLogo: {
        width: 60,
        height: 60,
        borderRadius: 12,
        position: 'absolute',
        top: -30, // float half above the overlay
        left: '50%', // push to the horizontal center
        transform: [{ translateX: -30 }], // offset half of logo’s width (60/2)
        backgroundColor: '#fff'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    optionButton: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingVertical: 8,
        alignItems: 'center'
    },
    optionText: {
        fontSize: 12,
        color: '#333'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    // aboutText: {
    //     fontSize: 12,
    //     color: '#007AFF'
    // },
    // rating: {
    //     fontSize: 12,
    //     color: '#333',
    //     fontWeight: 'bold'
    // },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    restaurantName: {
        color: '#111111',
        flex: 1,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0
    },
    aboutText: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 10
    },
    address: {
        color: '#111111',
        marginBottom: 8,
        fontSize: 14,
        lineHeight: 20
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end' // pushes rating to the right
    },
    rating: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'bold'
    },
    orderTypeText: {
        fontSize: 12,
        color: '#111111',
        marginRight: 3
    },
    boldText: {
        color: '##111111'
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 12,
        width: 300,
        backgroundColor: '#eeeeee',
        height: 40,
        borderRadius: 25
    },
    toggleButton: {
        flex: 1,
        marginHorizontal: 6,
        paddingVertical: 10,
        alignItems: 'center'
    },
    activeToggle: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 25
    },
    toggleText: {
        fontSize: 14,
        color: '#555'
    },
    activeToggleText: {
        fontWeight: 'bold',
        color: '#111'
    },

    //menu
    menuContainer: {
        flexDirection: 'row',
        marginTop: 100,
        width: '100%',
        flex: 1
    },

    // Sidebar (fixed width control)
    sidebar: {
        width: '25%', // control with % or set fixed px like 250
        backgroundColor: '#fafafa',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
        paddingVertical: 8,
        height: '100%'
    },

    categoryItem: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginVertical: 4
        // backgroundColor: 'blue',
        // width: 100,
        // flexDirection: 'row',
        // justifyContent: 'flex-end'
    },

    categoryText: {
        fontSize: 15,
        color: '#444'
    },

    activeCategory: {
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        borderLeftColor: '#e63946',
        elevation: 2
    },

    activeCategoryText: {
        color: '#e63946',
        fontWeight: '700'
    },

    // Content (right side view, remaining width)
    content: {
        width: '75%', // control with %
        padding: 12,
        backgroundColor: '#fafafa'
    },

    categorySection: {
        marginBottom: 20,
        // backgroundColor:'red',

        width: 1000
    },

    categoryHeader: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222'
    },

    subCategoryContainer: {
        marginBottom: 20
    },

    subCategoryTitle: {
        fontSize: 17,
        fontWeight: '600',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        marginBottom: 10,
        color: '#333'
    },

    // Grid
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
        // backgroundColor:'red',
        // borderBottom: 500
        // marginLeft: 50
        // padding: 20
        // justifyContent: 'space-between'
        // marginRight: 10
    },

    itemCard: {
        width: 400,
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 12,
        height: 450,
        borderRadius: 10,
        margin: 30,

        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 1 }, // shift shadow to left
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2
    },

    itemName: {
        fontSize: 18,
        color: '#111111',
        fontWeight: 'bold'
    },

    itemPrice: {
        fontSize: 15,
        color: '#111111',
        marginTop: 6
    }
});

export default MenuComponent;
