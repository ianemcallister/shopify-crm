/*
*
*/

//  DEFEIN DEPENDENCIES
const Square    = require('../square/stdops.js');
const fs        = require('fs');

async function GetPaymentsList() {
    var filename = 'squarePayments.json';
    var paymentsList = await Square.payments.list();

    console.log(paymentsList);
    console.log('found ', paymentsList.length, " customers");

    //var jsonList = JSON.stringify(customerList);

    //fs.writeFileSync(filename, jsonList, "utf8");
}

GetPaymentsList();

