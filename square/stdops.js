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
    customers: {
        search: {
            byId: SearchCustomersById,
            byLoyaltyId: SearchCustomersByLoyaltyId
        }
    },
    get: {
        customerByLoyaltyId: GetcustomerByLoyaltyId,
        loyaltyAcctByPhone: GetLoyaltyAcctByPhone,
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
*   PRIVATE: SEARCH LOYALTY
*/
async function _SearchLoyalty(params) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const loyaltyApi = client.loyaltyApi;
    
    try {
        const { result, ...httpResponse } = await loyaltyApi.searchLoyaltyAccounts(params)
        return result;
    } catch (error) {
        console.log('_SearchLoyalty Error: ', error);
    }
}

/*
*   SEARCH CUSTOMERS BY LOYALTY ID
*/
async function SearchCustomersByLoyaltyId(loyaltyId) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const loyaltyApi = client.loyaltyApi;
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await loyaltyApi.retrieveLoyaltyAccount(loyaltyId);
        return result.loyaltyAccount;
    } catch (error) {
        console.log('SearchCustomersByLoyaltyId Error: ', error);
    }
};

/*
*   SEARCH CUSTOMERS BY ID
*/
async function SearchCustomersById(customerId) {
    //  NOTIFY PROGERSS
    //  LOCAL VARIABLES
    const customersApi = client.customersApi;
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await customersApi.retrieveCustomer(customerId);
        return result.customer;
    } catch (error) {
        console.log('SearchCustomersById Error: ', error);
    }
};

/*
*   GET
*/
async function GetcustomerByLoyaltyId(loyaltyId) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    //  EXECUTE
    try {
        var loyaltyRecord = await SearchCustomersByLoyaltyId(loyaltyId);
        var customerRecord = await SearchCustomersById(loyaltyRecord.customerId);
        return customerRecord;
    } catch (error) {
        console.log('GetcustomerByLoyaltyId error: ', error);
    }
};

/*
*   GET LOYALTY ACCOUNT BY PHONE
*/
async function GetLoyaltyAcctByPhone(phone) {
    //  NOTIFY PROGRESS
    console.log('GetLoyaltyAcctByPhone: ', phone);
    //  LOCAL VARIABLES
    try {
        var acctsList = await _SearchLoyalty({
            limit: 1,
            query: {
                mappings: [
                    {
                        type: 'PHONE',
                        value: phone
                    }
                ]
            }
        });

        if(acctsList.loyaltyAccounts == undefined) {
            console.log('Square/stdops/GetLoyaltyAcctByPhone: no loyalty with that phone number');
            console.log(acctsList.loyaltyAccounts);
            return undefined;
        } else if (typeof(acctsList.loyaltyAccounts) == 'object'){
            console.log('Square/stdops/GetLoyaltyAcctByPhone: found loyalty record');
            return acctsList.loyaltyAccounts[0];
        } else {
            console.log("Square didn't wait");
        }
        
        
    } catch (error) {
        console.log('GetLoyaltyAcctByPhone Error: ', error);
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