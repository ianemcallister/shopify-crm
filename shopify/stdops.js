/*
*   SHOPIFY STANDARD OPS
*/

//  DEFINE DEPENDENICE
var Shopify = require('shopify-api-node');

//  DEFINE MODULE
var shopifyStandardOps = {
    get: {
        merchCustomerActivationUrl: GetMerchCustomerActivationUrl
    }
};

/*
*   GET MERCHANT CUSTOMER ACTIVATION URL
*/
async function GetMerchCustomerActivationUrl() {
    return true;
};

//  EXPORT MODULE
module.exports = shopifyStandardOps;