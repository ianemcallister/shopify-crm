/*
*
*/

//  DEFEIN DEPENDENCIES
const Square    = require('../square/stdops.js');
const fs        = require('fs');

async function GetCustomerList() {
    var filename = 'squareCustomers.json';
    var customerList = await Square.customers.list();

    console.log(customerList);
    console.log('found ', customerList.length, " customers");

    //var jsonList = JSON.stringify(customerList);

    //fs.writeFileSync(filename, jsonList, "utf8");
}

GetCustomerList();

