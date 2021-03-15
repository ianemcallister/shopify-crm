/*
*   COMMAND LINE INTERFACE
*/

var Firebase    = require('./firebase/stdops.js');
var CRM         = require('./app/crm.js');

async function execute() {
    try {
        
        //console.log('CLI: got this crmMerchantId', await CRM.get.crmMerchIdviaSqMrchId('DNFEDFQ5904GJ'));

        /*var recordId = await Firebase.create.newMerchCustomerRecord("-MVrZajcORbaTjkuZL2a", {
            first_name: "Daniel",
            last_name: "Mercer",
            phone: "+15034646354",
            sqId: "",
            shopifyId: ""
        })
        console.log('recordId: ', recordId);*/
    } catch (error) {
        console.log('error', error);
    }
};

execute();
