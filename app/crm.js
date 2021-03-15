/*
*   CKC CRM Module
*/

//  DEFINE DEPENDENCIES
var Firebase    = require('../firebase/stdops.js');

//  DEFINE MODULE
var ckccrm = {
    get: {
        crmCustomerIdViaSqMrchId: GetCrmCustomerIdViaSqMrchId,
        merchCustomerRecordViaPhone: GetMerchCustomerRecordViaPhone
    }
};

/*
*   GET SQUARE CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmCustomerIdViaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    console.log('getting customer id from square merchant id: ', sq_merchant_id);

    //  DEFINE LOCAL VARIABLES
    var crmCustomerId = Firebase.get.crmCustomerIdviaSqMrchId(sq_merchant_id);

    //  RETURN
    return crmCustomerId;
};

/*
*   GET CUSTOMER RECORD
*/
async function GetMerchCustomerRecordViaPhone(crmCustomerId, merchCustPhone, merchCustsqLyltyId) {
    //  NOTIFY PROGRESS
    console.log('GetMerchCustomerRecordViaPhone: ', crmCustomerId, merchCustPhone, merchCustsqLyltyId);

    //  DEFINE LOCAL VARIABLES
    var merchCustomerRecord = {
        shopifyId: "",
        dcEnrollmentCompleted: true
    };

    // EXEVUTE ASYNC WORK
    try {
        
    } catch (error) {
        
    }

    //  RETURN
    return merchCustomerRecord;
};

//  EXPORT MODULE
module.exports = ckccrm;