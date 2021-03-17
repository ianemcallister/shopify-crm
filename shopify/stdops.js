/*
*   SHOPIFY STANDARD OPS
*/

//  DEFINE DEPENDENICE
const shopifyAPINode = require('shopify-api-node');

//  INSTANCIATE
const shopifyCredentials ={
    shopName: process.env.CKC_SHOPIFY_SHOP_NAME,
    apiKey: process.env.CKCCRM_SHOPIFY_API_KEY,
    password: process.env.CKCCRM_SHOPIFY_API_SECRET
  }
const ShopifyAPI = new shopifyAPINode(shopifyCredentials);

//  DEFINE MODULE
var shopifyStandardOps = {
    get: {
        merchCustomerActivationUrl: GetMerchCustomerActivationUrl,
        merchCustomerId: GetMerchCustomerId,
        newMerchCustId: GetNewMerchCustId
    }
};

/*
*   PRIVATE: CUSTOMER ACCOUNT ACTIVATION URL
*/
async function _customerAcctActUrl(id) {
    //  NOTIFY PROGRESS
    console.log("shopify/stdops/_customerAcctActUrl", id);

    try {
        var activationUrl = await ShopifyAPI.customer.accountActivationUrl(id);
        return activationUrl;
    } catch (error) {
        console.log('_customerAcctActUrl error', error);
    }
};

/*
*   PRIVATE: CUSTOMER SEARCH
*/
async function _customerSearch(params) {
    //  NOTIFY PROGRESS
    console.log("shopify/stdops/_customerSearch", params);

    //  DEFINE LOCAL VARIABLS

    try {
        var customerRecord = await ShopifyAPI.customer.search(params);
        //console.log('got this customer record', customerRecord);
        return customerRecord;
    } catch (error) {
        console.log('error', error);
    }
};

/*
*   PRIVATE: CREATE A NEW CUSTOMER RECORD
*/
async function CreateNewCustomerRecord(params) {
    //  NOTIFY PROGRESS
    console.log('SHOPIFY/CreateNewCustomerRecord: ', params);

    var newCustomerRecord = await ShopifyAPI.customer.create(params);
    return newCustomerRecord; 
};

/*
*   GET MERCHANT CUSTOMER ACTIVATION URL
*/
async function GetMerchCustomerActivationUrl(merchCustShopifyId) {
    //  NOTIFY PROGRESS
    console.log('shopify/stdops/GetMerchCustomerActivationUrl: ', merchCustShopifyId);

    try {
        return await _customerAcctActUrl(merchCustShopifyId);
    } catch (error) {
        console.log('GetMerchCustomerActivationUrl error: ', error);
    }
    return true;
};

/*
*   GET MERCHANT CUSTOMER ID
*/
async function GetMerchCustomerId(phone) {
    //  NOTIFY PROGRESS
    console.log('shopify/stdops/GetMerchCustomerId: ', phone);

    //  DEFINE LOCAL VARIABLES
    var params = { phone: phone }

    try {
        var customerRecord = await _customerSearch(params);
        
    } catch (error) {
        console.log('error', error);
    }
    
};

/*
*   GET NEW MERCHANT CUSTOMER SHOPIFY ID
*/
async function GetNewMerchCustId(merchCustPhone, sq_merchant_id) {
    //  NOTIFY PRGORESS
    console.log('/shopify/stdops/GetNewMerchCustId: ', merchCustPhone, sq_merchant_id);

    //  LOCAL VARIABLES
    var newCustomerObject = {
        first_name: "(Temp)",
        last_name: "(Temp)",
        phone: merchCustPhone,
        addresses: [
            { phone: merchCustPhone }
        ]
    };

    var newCustomerRecord = await CreateNewCustomerRecord(newCustomerObject);
    var newCustomerShopifyId = newCustomerRecord.id;
    return newCustomerShopifyId;

};

//  EXPORT MODULE
module.exports = shopifyStandardOps;