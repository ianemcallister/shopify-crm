/*
*   DELIGHT CIRCLE ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
var CRM         = require('../app/crm.js');
var till        = require('../till/enrollment.js');
var shopify     = require('../shopify/stdops.js');

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

    //  2. GET SHOPIFY CUSTOMER ID
    return await CRM.get.merchCustomerRecordViaPhone(
        await CRM.get.crmMerchIdviaSqMrchId(sq_merchant_id),    // get crm merchant id
        merchCustPhone, 
        merchCustsqLyltyId
    );

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
    console.log('got this merchantCustomer REcord' , merchCustomerRecord);

    //  2. Check activation status
    if(merchCustomerRecord.dcEnrollmentCompleted) {

        //  3. Generate enrollment url
        var merchCustEnrollmentUrl = await shopify.get.merchCustomerActivationUrl(merchCustomerRecord.shopifyId);

        //  4. Send enrollment url
        enrollmentUrlSent = await till.send.enrollmentInvite(merchCustPhone, merchCustEnrollmentUrl);
    }

    // RETURN
    return enrollmentUrlSent;
}

//  EXPORT MODULE
module.exports = rewards;