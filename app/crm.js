/*
*   CKC CRM Module
*/

//  DEFINE DEPENDENCIES
var Firebase    = require('../firebase/stdops.js');

//  DEFINE MODULE
var ckccrm = {
    get: {
        crmMerchIdviaSqMrchId: GetCrmMerchIdViaSqMrchId,
        merchCustomerRecordViaPhone: GetMerchCustomerRecordViaPhone
    }
};

/*
*   GET SQUARE CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmMerchIdViaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    console.log('getting Merchent id from square merchant id: ', sq_merchant_id);

    //  DEFINE LOCAL VARIABLES
    var crmMerchId = await Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id);

    //  RETURN
    return crmMerchId;
};

/*
*   GET CUSTOMER RECORD
*/
async function GetMerchCustomerRecordViaPhone(crmMerchId, merchCustPhone, merchCustsqLyltyId) {
    //  NOTIFY PROGRESS
    console.log('GetMerchCustomerRecordViaPhone: ', crmMerchId, merchCustPhone, merchCustsqLyltyId);

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