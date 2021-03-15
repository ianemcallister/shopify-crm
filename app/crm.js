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
    //console.log('CRM/GetCrmMerchIdViaSqMrchId: getting Merchent id from square merchant id: ', sq_merchant_id);

    //  1. COLLECT MERCHANT ID
    var id = await Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id);
    console.log('got this id ', id);
    return id;
     
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