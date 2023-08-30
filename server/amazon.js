const scrapingbee = require('scrapingbee');

async function getAmazonProductInfo(url) {
    try {
        const apiKey = "WRC4WHPOUWI3RRXH4SLQKC7IQR6JT8PYWEHP1EMNSJ44BN30KAQ7BINSAA3SNN1D3KVNUSNRG7SK0RUD";
        const client = new scrapingbee.ScrapingBeeClient(apiKey);
        const response = await client.get({
            url: url,
            params: {
                'premium_proxy': 'True',
                'block_resources': false,
                'extract_rules': {
                    "productName": "#productTitle",
                    "price": ".a-price-whole",
                    "image": ".a-dynamic-image@src",
                    "rating": "//*[@id='acrPopover']/span[1]/a/span",
                    "highlights": {
                        "selector": "#feature-bullets .a-list-item",
                        "type": "list"
                    },
                    "productDetails": {
                        "selector": "#productDetails_techSpec_section_1",
                        "output": "table_json"
                    },
                    "productDetailsRight": {
                        "selector": "#productDetails_detailBullets_sections1",
                        "output": "table_json"
                    },
                },
            },
        });

        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(response.data);
        const parsedData = JSON.parse(text);

        const productDetailsLeftTable = parsedData?.productDetails?.reduce((result, item) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            result[key] = value;
            return result;
        }, {});

        const productDetailsLeftRight = parsedData?.productDetailsRight?.reduce((result, item) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            result[key] = value;
            return result;
        }, {});

        const productDetailsMerged = { ...productDetailsLeftTable, ...productDetailsLeftRight };
        let rating = parsedData?.rating * 2;
        rating = rating?.toFixed(1);

        // console.log(productDetailsMerged['Control Console'])


        return {
            productName: parsedData.productName,
            productImage: {
                url: parsedData.image,
                alt: "Washing Machine Photo",
            },
            rating: rating,
            highlights: parsedData.highlights,
            specs: {
                brand: productDetailsMerged.Brand,
                type: productDetailsMerged['Access Location'],
                capacity: productDetailsMerged.Capacity,
                tubType: "",
                functionType: "",
                weight: productDetailsMerged['Item Weight'],
                rotationSpeed: productDetailsMerged['Maximum Rotational Speed'],
            },
            specialFeatures: productDetailsMerged['Special Features'],
            videoReview: {
                title: "",
                id: "",
            },
            stores: {
                amazon: url,
                flipkart: "",
            },
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

module.exports = getAmazonProductInfo

// const productUrl = 'https://www.amazon.in/dp/B0C8TNNZFJ/ref=redir_mobile_desktop?_encoding=UTF8&aaxitk=7a445ad18a0b2ba7a4694497f6cf00d6&content-id=amzn1.sym.df9fe057-524b-4172-ac34-9a1b3c4e647d%3Aamzn1.sym.df9fe057-524b-4172-ac34-9a1b3c4e647d&hsa_cr_id=0&pd_rd_plhdr=t&pd_rd_r=7de83736-ab3c-4a5a-a9dd-dd55ca09c975&pd_rd_w=UcYCG&pd_rd_wg=qTbD1&qid=1692602938&ref_=sbx_be_s_sparkle_lsi4d_asin_1_img&sr=1-2-e0fa1fdd-d857-4087-adda-5bd576b25987'

// getAmazonProductInfo(productUrl)
//     .then(productInfo => {
//         if (productInfo) {
//             // console.log(productInfo);
//         } else {
//             console.log('Failed to fetch product information.');
//         }
//     });
