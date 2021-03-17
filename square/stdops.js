/*
*   SQAURE STANDARD OPS
*/

//  DECLARE DEPENDENCIES
const { Client, Environment } = require('square');

//  INITIALIZE
const client = new Client({
    environment: Environment.Production,
    accessToken: process.env.CKC_SQR_APP_TKN,
});

//  DEFINE MODULE
var squareStOps = {
    get: {
        customerByPhone: GetCustomerByPhone
    }
};

/*
*   PRIVATE: SEARCH CUSTOMERS
*/
async function _SearchCustomers(params) {
    // LOCAL VARIABLES
    const customersApi = client.customersApi;

    try {
        const { result, ...httpResponse } = await customersApi.searchCustomers(params)
        return result;
    } catch (error) {
        console.log('_SearchCustomers Error: ', error);
    }
}

/*
*   GET CUSTOMER BY PHONE
*/
async function GetCustomerByPhone(phone) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    try {
        var customerRecords = await _SearchCustomers({
            limit: 1,
            query: {
                filter: {
                    phoneNumber: {
                        exact: phone
                    }
                }
            }
        });
        
        if(customerRecords.customers == undefined) {
            console.log('Square/stdops/GetCustomerByPhone: no customers with that phone number');
            console.log(customerRecords);
            return undefined;
        } else if (typeof(customerRecords) == 'object'){
            console.log('Square/stdops/GetCustomerByPhone: found customer record');
            return customerRecords.customers[0];
        } else {
            console.log("Square didn't wait");
        }
        

    } catch (error) {
        console.log('GetCustomerByPhone Error: ', error);
    }
    //  RETURN VALUE
};

//  EXPORT MODULE
module.exports = squareStOps;