const express = require('express');
const cors = require('cors');
const getFlipkartProductInfo = require('./flipkart.js');
const getAmazonProductInfo = require('./amazon.js');

const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'API Successufully running'
    })
})

app.post('/api/v1/data', (req, res, next) => {
    const { productUrl } = req.body;

    if (productUrl.includes("flipkart.com")) {
        getFlipkartProductInfo(productUrl)
            .then(productInfo => {
                if (productInfo) {
                    // console.log(productInfo)

                    res.status(200).json({
                        success: true,
                        message: 'Successfully retrived data from flipkart',
                        data: productInfo
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Something went from while scraping flipkart',
                        data: {}
                    })
                }
            });
    } else if (productUrl.includes("amazon.in")) {
        getAmazonProductInfo(productUrl)
            .then(productInfo => {
                if (productInfo) {
                    // console.log(productInfo);

                    res.status(200).json({
                        success: true,
                        message: 'Successfully retrived data from amazon',
                        data: productInfo
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Something went from while scraping amazon',
                        data: {}
                    })
                }
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Url is not related to amazon or flipkart',
            data: {}
        })
    }
})

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));