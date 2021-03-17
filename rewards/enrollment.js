/*
*   REWARDS ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
const CRM       = require('../app/crm.js');
const till      = require('../till/enrollment.js');
const Shopify   = require('../shopify/stdops.js');
const Square    = require('../square/stdops.js');
const Firebase  = require('../firebase/stdops.js');

//  DEFINE MODULE
var rewards = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
    } 
};

/*
*   PRIVATE: GET SHOPIFY CUSTOMER ID
*/
async function _GetMerchCustomerRecord(merchCustPhone, merchCustsqLyltyId, sq_merchant_id, rewardsEnrollAt){
    //  NOTIFY PROGRESS
    //console.log('_GetMerchCustomerRecord: ', merchCustPhone, merchCustsqLyltyId, sq_merchant_id);

    try {
        //  1. COLLECT PROFILES FROM ALL RESOURCES [Square, Shopify, Firebase]
        var allRecords = await Promise.all([
            Shopify.get.merchCustomerRecord(merchCustPhone),
            Square.get.customerByPhone(merchCustPhone),
            Firebase.get.merchCustRecord(merchCustPhone),
            Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id),
            {phone: merchCustPhone, sqLoyalty: merchCustsqLyltyId, sqMercantId: sq_merchant_id, rewardsEnrolledAt: rewardsEnrollAt }
        ]);
        //console.log('_GetMerchCustomerRecord: ', allRecords);

        //  2. CONSOLIDATE MERCHANT CUSTOMER RECORDS
        var comprehensiveCustomerRecord = await CRM.consolidateCustomerRecords(allRecords);
        console.log('comprehensiveCustomerRecord: ', comprehensiveCustomerRecord);

        //  3. UPDATE FIREBASE
        await Firebase.updateCustomerRecord(comprehensiveCustomerRecord);

        //  4. RETURN CUSTOMER RECORD
        return comprehensiveCustomerRecord;
        
    } catch (error) {
        console.log('_GetMerchCustomerRecord Error: ', error);
    }


    //  1. GET CRM MERCHANT ID
    //var crmMerchantId = await CRM.get.crmMerchIdviaSqMrchId(sq_merchant_id);

    //  2. GET SHOPIFY CUSTOMER ID
    //var merchCustomerShopifyId = await CRM.get.merchCustomerRecordViaPhone(crmMerchantId, merchCustPhone, merchCustsqLyltyId);
    
    /*if(merchCustomerShopifyId == undefined || "") {
        //  NOTIFY PRGORESS
        console.log('need a new shopify customer id');
        var newMerchCustShopifyId = await shopifyMod.newMerchCustId(merchCustPhone, sq_merchant_id);
        return newMerchCustShopifyId;
    } else {
        return merchCustomerShopifyId
    }*/
    

};

/*
*   DELIGHT CIRCLE ENROLLMENT INVITE VIA SMS
*
*
*   @param(sqLyltyId) - String: '664c22ba-9460-45a5-8917-381ae72dcfdc'   
*   @param(phone) - String: "+15555555555" 12 character
*   @return(status) - Bool: Success | Failure
*/
async function EnrollmentInviteViaSMS(merchCustPhone, merchCustloyaltyId, sq_merchant_id, rewardsEnrolledAt) {
    //  DEFINE LOCAL VARIABLES

    //  NOTIFY PROGERSS
    //console.log('EnrollmentInviteViaSMS: sqLyltyId(', merchCustloyaltyId, '), phone(', merchCustPhone,'), merchant_id(', sq_merchant_id, ")");
    
    try {
        //  1. Retrieve Customer Record
        var customerRecord = await _GetMerchCustomerRecord(merchCustPhone, merchCustloyaltyId, sq_merchant_id, rewardsEnrolledAt);
        //console.log(merchCustomerRecord);   //  TODO: REMOVE THIS LATER

        //  2. Verify Enrollment Status
        if(!customerRecord.status.referralEnrolled) {

            //  3. Generate Enrollment Url
        //    var merchCustEnrollmentUrl = await shopifyMod.get.merchCustomerActivationUrl(merchCustomerRecord.externalIds.shopifyId);

            //  4. Send Enrollment SMS
        //    await till.send.enrollmentInvite(merchCustPhone, merchCustEnrollmentUrl);

            //  5. Record Touchpoint

            //  6. Notify Status
        //    console.log(merchCustPhone, ' sent a referral enrollment link');
        } else {
            //  3. Notify Status
            console.log(merchCustPhone, ' aready enrolled.');

        }  

    //  HANDLE ANY ERRORS THAT COME UP    
    } catch (error) {
        console.log('EnrollmentInviteViaSMS Error: ', error);
    }

}

//  EXPORT MODULE
module.exports = rewards;