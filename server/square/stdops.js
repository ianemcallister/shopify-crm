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
    payments: {
        get: GetPayment
    },
    orders: {
        get: GetOrderById
    },
    subscriptiosn: {},
    invoices: {},
    items: {
        catalog: {
            batchList: GetCatalogItemsBatchList,
            list: GetCatalogItemsList
        }
    },
    customers: {
        search: {
            byId: SearchCustomersById,
            byLoyaltyId: SearchCustomersByLoyaltyId
        }
    },
    loyalty: {},
    bookings: {},
    business: {
        locations: {
            list: ListLocations
        }
    },
    team: {
        team: {
            searchTeamMembers: SearchTeamMembers
        },
        employees: {
            list: listEmployees,
            retrieve: retrieveEmployee
        },
        labor: {
            createShift: CreateShift,
            searchShifts: SearchLaborShifts,
            deleteShift: "",
            getShift: "",
            updateShift: ""
        },
        cashDrawers: {}
    },
    financials: {},

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
*
*/
async function GetPayment(paymentId) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const paymentsApi = client.paymentsApi;

    //  EXECUTE
    try {
        const { result, ...httpResponse } = await paymentsApi.getPayment(paymentId);
        return result
    } catch (error) {
        console.log('GetPayment Error: ', error);
    }
};

/*
*
*/
async function GetOrderById(id) {
    //  NOTIFY PROGRESS
    console.log('GetOrderById: ', id);
    //  LOCAL VARIABLES
    const ordersApi = client.ordersApi;
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await ordersApi.retrieveOrder(id);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result;
    } catch(error) {
        console.log(error);
        if (error instanceof ApiError) {
            const errors = error.result;
            console.log("GetOrderById Error: ", errors);
            // const { statusCode, headers } = error;
        }
    }
};

/*
*
*/
async function GetCatalogItemsBatchList(list) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const catalogApi = client.catalogApi;
    const body = {
        objectIds: list,
    };
    body.includeRelatedObjects = true;
    body.catalogVersion = undefined;

    //  EXECTE
    try {
        const { result, ...httpResponse } = await catalogApi.batchRetrieveCatalogObjects(body);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result;
      } catch(error) {
        if (error instanceof ApiError) {
            console.log(error);
            const errors = error.result;
            // const { statusCode, headers } = error;
        }
      }
}

/*
*
*/
async function GetCatalogItemsList() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const catalogApi = client.catalogApi;
    const cursor = undefined;
    const types = undefined;
    const catalogVersion = undefined; //126;

    //  EXECTE
    
    try {
        const { result, ...httpResponse } = await catalogApi.listCatalog(cursor, types, catalogVersion);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch(error) {
        console.log(error);
        if (error instanceof ApiError) {
            const errors = error.result;
            // const { statusCode, headers } = error;
            console.log("GetCatalogItemsList Error: ", errors);
        }
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

/*
*   SEARCH LABOR SHIFTS
*/
async function SearchLaborShifts(params) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const laborApi = client.laborApi;
    console.log(params);
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await laborApi.searchShifts(params);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('SearchLaborShifts error: ');
        console.log(error);
    }
};

/*
*   SEARCH LABOR SHIFTS
*/
async function SearchTeamMembers(params) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const employeesApi = client.employeesApi;
    console.log(params);
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await employeesApi.searchTeamMembers(params);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('SearchTeamMembers error: ');
        console.log(error);
    }
};

/*
*   LIST LOCATIONS
*/
async function ListLocations() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const locationsApi = client.locationsApi;
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await locationsApi.listLocations();
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('ListLocations error: ');
        console.log(error);
    }
};

/*
*   LIST EMPLOYEES
*/
async function listEmployees() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const employeesApi = client.employeesApi;
    const locationId = 'RKNMKQF48TA6W';
    const status = 'ACTIVE';
    const limit = 10;
    const cursor = undefined;
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await employeesApi.listEmployees(locationId, status, limit, cursor)
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('ListLocations error: ');
        console.log(error);
    }
};

/*
*   RETREIVE EMPLOYEE
*/
async function retrieveEmployee() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const employeesApi = client.employeesApi;
    const locationId = 'RKNMKQF48TA6W';
    const status = 'ACTIVE';
    const limit = 10;
    const cursor = undefined;
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await employeesApi.listEmployees(locationId, status, limit, cursor)
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('ListLocations error: ');
        console.log(error);
    }
};


/*
*   CREATE SHIFT
*/
async function CreateShift(params) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    const laborApi = client.laborApi;
    
    //  EXECUTE
    try {
        const { result, ...httpResponse } = await laborApi.createShift(params);
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return result
    } catch (error) {
        console.log('CreateShift error: ');
        console.log(error);
    }
};


//  EXPORT MODULE
module.exports = squareStOps;