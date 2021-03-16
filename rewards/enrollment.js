/*
*   DELIGHT CIRCLE ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
var CRM         = require('../app/crm.js');
var till        = require('../till/enrollment.js');
var shopifyMod  = require('../shopify/stdops.js');

//  DEFINE MODULE
var rewards = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
    } 
};

/*
*   PRIVATE: GET SHOPIFY CUSTOMER ID
*/
async function _GetShopifyCustomerId(merchCustPhone, merchCustsqLyltyId, sq_merchant_id){
    //  NOTIFY PROGRESS
    console.log('_GetShopifyCustomerId: ', merchCustPhone, merchCustsqLyltyId, sq_merchant_id);

    //  1. GET CRM MERCHANT ID
    var crmMerchantId = await CRM.get.crmMerchIdviaSqMrchId(sq_merchant_id);

    //  2. GET SHOPIFY CUSTOMER ID
    var merchCustomerShopifyId = await CRM.get.merchCustomerRecordViaPhone(crmMerchantId, merchCustPhone, merchCustsqLyltyId);
    
    if(merchCustomerShopifyId == undefined || "") {
        //  NOTIFY PRGORESS
        console.log('need a new shopify customer id');
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
    var merchCustomerRecord = await _GetShopifyCustomerId(merchCustPhone, merchCustloyaltyId, sq_merchant_id);
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