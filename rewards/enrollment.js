/*
*   DELIGHT CIRCLE ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
var CRM         = require('../app/crm.js');
var till        = require('../till/enrollment.js');

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

    //  1. GET CRM CUSTOMER ID
    var crmCustomerId = await CRM.get.crmCustomerIdViaSqMrchId(sq_merchant_id);

    //  2. GET SHOPIFY CUSTOMER ID
    var ckcCustomerRecord = await CRM.get.merchCustomerRecordViaPhone(crmCustomerId, merchCustPhone, merchCustsqLyltyId);

    return ckcCustomerRecord

};

/*
*   DELIGHT CIRCLE ENROLLMENT INVITE VIA SMS
*
*
*   @param(sqLyltyId) - String: '664c22ba-9460-45a5-8917-381ae72dcfdc'   
*   @param(phone) - String: "+15555555555" 12 character
*   @return(status) - Bool: Success | Failure
*/
async function EnrollmentInviteViaSMS(phone, sqLyltyId, sq_merchant_id) {
    //  DEFINE LOCAL VARIABLES
    var enrollmentUrlSent = false;

    //  NOTIFY PROGERSS
    console.log('EnrollmentInviteViaSMS: sqLyltyId(', sqLyltyId, '), phone(', phone,'), merchant_id(', sq_merchant_id, ")");
    
    //  1. Get Shopify Customer Id
    var ckcCustomerRecord = await _GetShopifyCustomerId(phone, sqLyltyId, sq_merchant_id);

    //  2. Check activation status
    if(customerRecord.dcEnrollmentCompleted) {

        //  3. Generate enrollment url
        var enrollmenturl = await shopify.get.customerActivationUrl(shopifyCustomerId);

        //  4. Send enrollment url
        enrollmentUrlSent = await till.send.enrollmentInvite(phone, enrollmenturl);
    }

    // RETURN
    return enrollmentUrlSent;
}

//  EXPORT MODULE
module.exports = rewards;