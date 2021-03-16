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
    return await Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id);
     
};

/*
*   GET CUSTOMER RECORD
*/
async function GetMerchCustomerRecordViaPhone(crmMerchId, merchCustPhone, merchCustsqLyltyId) {
    //  NOTIFY PROGRESS
    console.log('GetMerchCustomerRecordViaPhone: ', crmMerchId, merchCustPhone, merchCustsqLyltyId);

    // EXECUTE ASYNC WORK
    try {
        var customerRecord = await Firebase.get.merchCustRecord(crmMerchId, merchCustPhone);
        return { shopifyId: customerRecord.shopifyId, rewardsEnrolled: customerRecord.rewardsEnrolled }
    } catch (error) {
        console.log('error', error);
    }

};

//  EXPORT MODULE
module.exports = ckccrm;