/*
*   COMMAND LINE INTERFACE
*/

var Firebase    = require('./firebase/stdops.js');
var Shopify     = require('./shopify/stdops.js');
var CRM         = require('./app/crm.js');
var rewards     = require('./rewards/enrollment.js');
const squareStOps = require('./square/stdops.js');

async function execute() {
    try {
        
        //console.log('CLI: got this crmMerchantId', await CRM.get.crmMerchIdviaSqMrchId('DNFEDFQ5904GJ'));
        //await Shopify.get.merchCustomerId('+15034646354');
        console.log(await squareStOps.get.customerByPhone('+16192778852'));
        //console.log('New Customer Id: ', await Shopify.get.newMerchCustId('+14062082327', 'DNFEDFQ5904GJ'));
        //console.log('Enrolled?: ', await rewards.enrollmentInvite.viaSMS('+15034646354', 'ba2f8ab6-e131-46d9-9882-17714404eb49', 'DNFEDFQ5904GJ'));
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
