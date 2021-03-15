/*
*   COMMAND LINE INTERFACE
*/

var Firebase    = require('./firebase/stdops.js');

async function execute() {
    try {
        var recordId = await Firebase.create.newMerchantRecord({
            sqMerchId: "DNFEDFQ5904GJ",
            merchantName: "29 Kettle Confectionery"
        })
        console.log('recordId: ', recordId);
    } catch (error) {
        console.log('error', error);
    }
};

execute();
