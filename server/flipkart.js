const scrapingbee = require('scrapingbee');

async function getFlipkartProductInfo(url) {
    try {
        const apiKey = "WRC4WHPOUWI3RRXH4SLQKC7IQR6JT8PYWEHP1EMNSJ44BN30KAQ7BINSAA3SNN1D3KVNUSNRG7SK0RUD";
        const client = new scrapingbee.ScrapingBeeClient(apiKey);
        const response = await client.get({
            url: url,
            params: {
                'premium_proxy': 'True',
                'block_resources': false,
                'extract_rules': {
                    "productName": "span.B_NuCI",
                    "price": ".a-price-whole",
                    "image": "img._396cs4._2amPTt._3qGmMb@src",
                    "rating": "//*[@id='productRating_LSTWMNGAM87VCKXGHAZJ8MB2M_WMNGAM87VCKXGHAZ_']/div",
                    "highlights": {
                        "selector": "._21Ahn-",
                        "type": "list"
                    },
                    // "specialFeatures": "div._1mXcCf.RmoJUa p",
                    "productDetails": {
                        "selector": "._14cfVK",
                        "output": "table_json"
                    },
                    "productDetailsRight": {
                        "selector": "#productDetails_detailBullets_sections1",
                        "output": "table_json"
                    },
                    "productMaterial": "//td[text() = 'Tub Material']/following-sibling::td/ul/li",
                    "weight": "//td[text() = 'Weight']/following-sibling::td/ul/li"
                },
            },
        });

        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(response.data);
        const parsedData = JSON.parse(text);

        let rating = parsedData?.rating * 2;
        rating = rating?.toFixed(1);

        const productDetails = parsedData.productDetails;
        const formattedProductDetails = {};

        for (const item of productDetails) {
            const key = item['0'];
            const value = item['1'];
            formattedProductDetails[key] = value;
        }

        return {
            productName: parsedData.productName,
            productImage: {
                url: parsedData.image,
                alt: "Washing Machine Photo",
            },
            rating: rating,
            highlights: parsedData.highlights,
            specs: {
                brand: formattedProductDetails.Brand,
                type: formattedProductDetails['Function Type'],
                capacity: formattedProductDetails['Washing Capacity'],
                tubType: parsedData.productMaterial,
                functionType: "",
                weight: parsedData.weight,
                rotationSpeed: formattedProductDetails['Maximum Spin Speed'],
            },
            specialFeatures: '',
            videoReview: {
                title: "",
                id: "",
            },
            stores: {
                amazon: "",
                flipkart: url,
            },
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

module.exports = getFlipkartProductInfo

// getFlipkartProductInfo("https://www.flipkart.com/ifb-8-kg-steam-wash-aqua-energie-anti-allergen-4-years-comprehensive-warranty-fully-automatic-front-load-washing-machine-in-built-heater-silver/p/itm59971a092e671?pid=WMNGAM87VCKXGHAZ&lid=LSTWMNGAM87VCKXGHAZJ8MB2M&marketplace=FLIPKART&q=washing+machine&store=j9e%2Fabm%2F8qx&srno=s_1_1&otracker=search&fm=organic&iid=en_hisJzj1NhCoG7pJORfEy3pXdhWIcVJV2RVZ0hxhgRoP4a_6MLx_eO3GvhUa1g4Y8TIa1h_8M0279NpO3OGPvWg%3D%3D&ppt=None&ppn=None&ssid=di9juvcpa80000001692785452615&qH=b3522a5e7056c9c0")
//     .then(productInfo => {
//         if (productInfo) {
//             console.log(productInfo)
//             // res.status(200).json({
//             //     success: true,
//             //     message: 'Successfully retrived data from flipkart',
//             //     data: productInfo
//             // })
//         } else {
//             // res.status(400).json({
//             //     success: false,
//             //     message: 'Something went from while scraping flipkart',
//             //     data: {}
//             // })
//         }
//     });
