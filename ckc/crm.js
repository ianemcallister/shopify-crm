/*
*   CKC CRM Module
*/

//  DEFINE DEPENDENCIES

//  DEFINE MODULE
var ckccrm = {
    get: {
        customerRecordByPhoneFromSquare: GetCustomerRecordByPhoneFromSquare
    }
};

/*
*   GET CUSTOMER RECORD
*/
async function GetCustomerRecordByPhoneFromSquare(phone, sqLyltyId) {
    //  NOTIFY PROGRESS
    console.log('GetCustomerRecordByPhoneFromSquare', phone, sqLyltyId);
    
    //  RETURN
    return true;
};

//  EXPORT MODULE
module.exports = ckccrm;