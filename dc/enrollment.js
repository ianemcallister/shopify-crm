/*
*   DELIGHT CIRCLE ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
var CRM         = require('../ckc/crm.js');
var till        = require('../till/enrollment.js');

//  DEFINE MODULE
var dcEnrollment = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
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
async function EnrollmentInviteViaSMS(sqLyltyId, phone) {
    //  DEFINE LOCAL VARIABLES
    var enrollmentUrlSent = false;

    //  NOTIFY PROGERSS
    console.log('EnrollmentInviteViaSMS: sqLyltyId(', sqLyltyId, '), phone(', phone,')');

    //  1. Check for existing customer record with that phone
    var customerRecord = await CRM.get.customerRecordByPhoneFromSquare(phone, sqLyltyId);

    //  2. Check activation status
    if(customerRecord.dcEnrollmentCompleted) {
        //  3. Generate enrollment url
        var enrollmenturl = await shopify.get.customerActivationUrl(shopifyCustomerId);

        //  4. Send enrollment url
        enrollmentUrlSent = await till.send.enrollmentInvite();
    }

    // RETURN
    return enrollmentUrlSent;
}

//  EXPORT MODULE
module.exports = dcEnrollment