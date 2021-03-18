/*
*   SHOPIFY STANDARD OPS
*/

//  DEFINE DEPENDENICE
const fs                = require('fs');
const shopifyAPINode    = require('shopify-api-node');

//  INSTANCIATE
const shopifyCredentials ={
    shopName: process.env.CKC_SHOPIFY_SHOP_NAME,
    apiKey: process.env.CKCCRM_SHOPIFY_API_KEY,
    password: process.env.CKCCRM_SHOPIFY_API_SECRET
  }
const ShopifyAPI = new shopifyAPINode(shopifyCredentials);

//  DEFINE MODULE
var shopifyStandardOps = {
    createNewShopifyCustomer: createNewShopifyCustomer,
    get: {
        merchCustomerActivationUrl: GetMerchCustomerActivationUrl,
        merchCustomerRecord: GetMerchCustomerRecord,
        newMerchCustId: GetNewMerchCustId,
        urlRedirect: GetUrlRedirect,
        referralCode: GetReferralCode,
        priceCodesList: GetPriceCodesList
    },
    create: {
        referralCode: CreateReferralCode,
        redirect: CreateRedirect
    }
};

/*
*   PRIVATE: HASH PHONE
*/
function _hashPhone(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var key = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    var phoneHash = "";

    //  EXECUTE
    for (var i = 0; i < phone.length; i++) {
        if(phone[i] != '+') {
            phoneHash += key[parseInt(phone[i])];
        }
    };

    return phoneHash;
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
*   PRIVATE: PARSE REFERRAL CODES
*/
function _praseReferralCodes(allCodes, query) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var returnObject = undefined;

    //  EXECUTE -- ITERATE OVER LIST
    allCodes.forEach(function(codeObject) {
        if(codeObject.code == query) { returnObject = codeObject }
    });

    return returnObject;
};

/*
*   PRIVATE: PARSE REDIRECTS
*/
function _parseRedirects(allRedirects, query) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var returnObject = undefined;

    //  EXECUTE
    allRedirects.forEach(function(redirectObject) {
        if(redirectObject.path == query) { returnObject = redirectObject }
    });

    return returnObject;
};

/*
*   CREATE NEW SHOPIFY CUSTOMER
*/
async function createNewShopifyCustomer(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var paramsFile = fs.readFileSync('./models/shopifyCustomer.json', 'utf8');
    var params = JSON.parse(paramsFile);
    params.first_name = "TEMPORARY"
    params.phone = phone;
    params.addresses[0].phone = phone;

    //  EXECUTE ASYNC WORK
    try {
        return await ShopifyAPI.customer.create(params)
        
    } catch (error) {
        console.log('createNewShopifyCustomer error: ', error);
    }
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
async function GetMerchCustomerRecord(phone) {
    //  NOTIFY PROGRESS
    console.log('shopify/stdops/GetMerchCustomerId: ', phone);

    //  DEFINE LOCAL VARIABLES
    var params = { phone: phone }

    try {
        var customerRecord = await _customerSearch(params);
        return customerRecord[0];
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

/*
*   GET URL REDIRECT
*/
async function GetUrlRedirect(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var path = '/' + _hashPhone(phone);
    var params = [{ path: path }];

    //  EXECUTE ASYNC WORK
    try {
        var returnObject = await ShopifyAPI.redirect.list(params)
        return _parseRedirects(returnObject);
    } catch (error) {
        console.log('GetUrlRedirect error: ', error)
    }
};

/*
*   CREATE REDIRECT 
*/
async function CreateRedirect(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var path = '/' + _hashPhone(phone);
    var target = '/discount/' + _hashPhone(phone) + '?redirect=/collections/all';
    var params = { path: path, target: target };

    //  EXECUTE ASYNC WORK
    try {
        var returnObject = await ShopifyAPI.redirect.create(params)
        return returnObject;
    } catch (error) {
        console.log('CreateRedirect error: ', error)
    }
};


/*
*   GET REFERRAL CODE
*/
async function GetReferralCode(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var priceRuleId = '913999855784';
    var code = _hashPhone(phone);

    //  EXECUTE ASYNC WORK
    try {
        var returnObject = await ShopifyAPI.discountCode.list(priceRuleId);
        return _praseReferralCodes(returnObject, code);

    } catch (error) {
        console.log('GetReferralCode error: ', error)
    }
};

/*
*   CREATE REFERAL CODE
*/
async function CreateReferralCode(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var priceRuleId = '913999855784';
    var params = { code: _hashPhone(phone) }

    //  EXECUTE ASYNC WORK
    try {
        var returnObject = await ShopifyAPI.discountCode.create(priceRuleId, params);
        return returnObject;
    } catch (error) {
        console.log('CreateReferralCode error: ', error)
    }
};

/*
*
*/
async function GetPriceCodesList() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var params = {};

    //  EXECUTE ASYNC FUNCTIONS
    try {
        var priceCodesList = ShopifyAPI.priceRule.list(params);
        return priceCodesList
    } catch (error) {
        console.log('GetPriceCodesList: ', error);
    }
};

//  EXPORT MODULE
module.exports = shopifyStandardOps;