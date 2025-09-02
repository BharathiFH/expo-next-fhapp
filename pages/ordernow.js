import React from 'react';
import pako from 'pako';
import { Buffer } from 'buffer';
import MenuComponent from '../Components/MenuComponent';

const OrderNowScreen = ({ takeAwayName, bannerUrl, logoUrl, menu }) => {
    return <MenuComponent takeAwayName={takeAwayName} bannerUrl={bannerUrl} logoUrl={logoUrl} menu={menu} />;
};

export async function getServerSideProps() {
    try {
        const resInfo = await fetch(
            'https://sit-foodhub-uk.stage.t2sonline.com/api/consumer/store?app_name=FRANCHISE&date=2025-08-29T11%3A37%3A50.207Z&host=sit-foodhub-uk.stage.t2sonline.com&WebDevice=null&poc2=null&storeId=8051103&sid=rE7v-Gdtl-Cw',
            {
                method: 'GET',
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'api-token': 'J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx',
                    authorization:
                        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOjg5MjU0NSwiaWF0IjoxNzU2NDY0OTk4LCJuYmYiOjE3NTY0NjQ5OTgsImV4cCI6NDI0NDc4NDk5OCwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.yGsFZUYzKRe2c2Vr32gPvFmjvRWY7RCxUUMrnk0n3nM',
                    deviceinfo:
                        '{"os":"macOS","version":"11.21 (0802R1)","platform":"web","platform_id":1,"product_id":"14","path":"http://localhost:8080/stoke-on-trent/test-test-apiautomation-uk8/ordernow"}',
                    franchise: 'sit-foodhub-uk.stage.t2sonline.com',
                    language: 'en-gb',
                    locale: 'united kingdom',
                    passport: '1',
                    store: '8051103',
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                }
            }
        );

        if (!resInfo.ok) {
            throw new Error(`Failed to fetch: ${resInfo.status}`);
        }

        const json = await resInfo.json();
        console.log('JSON in server', json.name);

        // 2️⃣ Fetch Menu Data
        const resMenu = await fetch(
            'https://sit-foodhub-uk.stage.t2sonline.com/api/consumer/store/8051103/menu/foodhub/v2/monday.json?v=1755605197&sid=MQJh-iuWq-Fw',
            {
                method: 'GET',
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'api-token': 'J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx',
                    authorization:
                        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOjg5MjU0NSwiaWF0IjoxNzU2NDY0OTk4LCJuYmYiOjE3NTY0NjQ5OTgsImV4cCI6NDI0NDc4NDk5OCwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.yGsFZUYzKRe2c2Vr32gPvFmjvRWY7RCxUUMrnk0n3nM',
                    deviceinfo:
                        '{"os":"macOS","version":"11.21 (0802R1)","platform":"web","platform_id":1,"product_id":"14","path":"http://localhost:8080/stoke-on-trent/test-test-apiautomation-uk8/ordernow"}',
                    franchise: 'sit-foodhub-uk.stage.t2sonline.com',
                    language: 'en-gb',
                    locale: 'united kingdom',
                    passport: '1',
                    // store: '8955860',
                    store: '8051103',
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                }
            }
        );

        if (!resMenu.ok) {
            throw new Error(`Failed to fetch menu: ${resMenu.status}`);
        }

        const menuResJson = await resMenu.json();
        console.log('menuResJson LOG', menuResJson);
        console.log('menuResJson keys >>>>>>>', Object.keys(menuResJson));
        console.log('menuResJson.data length >>>', menuResJson.data?.length);

        const compressedBase64 = menuResJson.data[0]; // not menuResJson.data
        const compressedData = Buffer.from(compressedBase64, 'base64');
        const decodedString = pako.inflate(compressedData, { to: 'string' });
        // const decodedJSON = JSON.parse(decodedString);
        const decodedJSON = JSON.parse(decodedString);

        console.log('decodedJSON LOG >>>', decodedJSON);

        return {
            props: {
                takeAwayName: json?.name,
                bannerUrl: json?.setting?.banner_url,
                logoUrl: json?.setting?.logo_url,
                menu: decodedJSON
            }
        };
    } catch (error) {
        console.error('SSR fetch error:', error);

        return {
            props: {
                name: null,
                bannerUrl: null,
                logoUrl: null,
                menu: null
            }
        };
    }
}

export default OrderNowScreen;
