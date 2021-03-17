/*
*   REWARDS ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
const CRM         = require('../app/crm.js');
const till        = require('../till/enrollment.js');
const shopifyMod  = require('../shopify/stdops.js');
const Square      = require('../square/stdops.js');

//  DEFINE MODULE
var rewards = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
    } 
};

/*
*   PRIVATE: GET SHOPIFY CUSTOMER ID
*/
async function _GetMerchCustomerRecord(merchCustPhone, merchCustsqLyltyId, sq_merchant_id){
    //  NOTIFY PROGRESS
    console.log('_GetMerchCustomerRecord: ', merchCustPhone, merchCustsqLyltyId, sq_merchant_id);

    //  1. COLLECT PROFILES FROM ALL RESOURCES [Square, Shopify, Firebase]
    var squareMerchCustomerRecord = "";
    var shopifyMerchCustomerRecord = '';
    var firebaseMerchCustomerRecord = '';
    var allMerchCustRecords = await Promise.all([
        await Square.get.customer()
    ])
    
    //  2. CONSOLIDATE MERCHANT CUSTOMER RECORDS
    //  3. UPDATE ALL DATA STORES [Square, Shopify, Firebase]
    //  4. RETURN { SHOPIFY CUSTOMER ID, ENROLLMENT STATUS }

    //  1. GET CRM MERCHANT ID
    var crmMerchantId = await CRM.get.crmMerchIdviaSqMrchId(sq_merchant_id);

    //  2. GET SHOPIFY CUSTOMER ID
    var merchCustomerShopifyId = await CRM.get.merchCustomerRecordViaPhone(crmMerchantId, merchCustPhone, merchCustsqLyltyId);
    
    if(merchCustomerShopifyId == undefined || "") {
        //  NOTIFY PRGORESS
        console.log('need a new shopify customer id');
        var newMerchCustShopifyId = await shopifyMod.newMerchCustId(merchCustPhone, sq_merchant_id);
        return newMerchCustShopifyId;
    } else {
        return merchCustomerShopifyId
    }
    

};

/*
*   DELIGHT CIRCLE ENROLLMENT INVITE VIA SMS
*
*
*   @param(sqLyltyId) - String: '664c22ba-9460-45a5-8917-381ae72dcfdc'   
*   @param(phone) - String: "+15555555555" 12 character
*   @return(status) - Bool: Success | Failure
*/
async function EnrollmentInviteViaSMS(merchCustPhone, merchCustloyaltyId, sq_merchant_id) {
    //  DEFINE LOCAL VARIABLES
    var enrollmentUrlSent = false;

    //  NOTIFY PROGERSS
    console.log('EnrollmentInviteViaSMS: sqLyltyId(', merchCustloyaltyId, '), phone(', merchCustPhone,'), merchant_id(', sq_merchant_id, ")");
    
    //  1. Get Shopify Customer Id
    var merchCustomerRecord = await _GetMerchCustomerRecord(merchCustPhone, merchCustloyaltyId, sq_merchant_id);
    console.log('got this merchantCustomer Record: ' , merchCustomerRecord);

    //  2. Check activation status
    if(merchCustomerRecord.rewardsEnrolled) {

        //  3. Generate enrollment url
        var merchCustEnrollmentUrl = await shopifyMod.get.merchCustomerActivationUrl(merchCustomerRecord.shopifyId);

        //  4. Send enrollment url
        enrollmentUrlSent = await till.send.enrollmentInvite(merchCustPhone, merchCustEnrollmentUrl);
    }

    // RETURN
    return enrollmentUrlSent;
}

//  EXPORT MODULE
module.exports = rewards;