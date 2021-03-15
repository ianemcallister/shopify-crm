/*
*   FIREBASE STANDARD OPS
*/

//  DEFINE DEPENDENCIES

//  DEFINE MODULE
var firebaseStOps = {
    get: {
        crmCustomerIdviaSqMrchId: GetCrmCustomerIdviaSqMrchId
    }
};

/*
*   GET CRM CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmCustomerIdviaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    console.log('Getting the crm customer id via suqare merchant id: ', sq_merchant_id);

    return '11';
};

//  EXPORT MODULE
module.exports = firebaseStOps;