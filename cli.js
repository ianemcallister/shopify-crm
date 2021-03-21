/*
*   COMMAND LINE INTERFACE
*/

var Firebase    = require('./firebase/stdops.js');
var Shopify     = require('./shopify/stdops.js');
var CRM         = require('./app/crm.js');
var rewards     = require('./rewards/enrollment.js');
const Square    = require('./square/stdops.js');
const fs        = require('fs');

async function execute() {
    try {
        var recordFile = fs.readFileSync('./models/merchMRInstanceTemplate.json', 'utf8');
        var record = JSON.parse(recordFile);

        console.log(await Firebase.merchants.channels.mrInstances.create('-MVrZajcORbaTjkuZL2a', '-MWHyj8sJgIlGTkit-Vq', record));

    } catch (error) {
        console.log('error', error);
    }
};

execute();
