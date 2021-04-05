/*
*   COMMAND LINE INTERFACE: Add Inventory Items
*/
//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES
async function addInventoryItems(item) {
    //  notify
    //  LOCAL
    const templateFile  = fs.readFileSync('./server/models/inventoryItemTemplate.json', 'utf8');
    var postItem            = JSON.parse(templateFile);
    
    //  CUSTOMIZED ELEMENTS
    Object.keys(item).forEach(function(key) {
        postItem[key] = item[key];
    });
    

    //  EXECUTE
    try {
        await ops.Inventory.Items.create(postItem);
        console.log('item added');
    } catch (error) {
        console.log('addInventoryItems error: ');
        console.error(error);
    }
};
var allItems = [
    { "SKU": "",
    "name": "Green Kit Right Rear Weight",
    "role": "-MX8P_k5VGUrzgJv4MTt",
    "vendor": "29 Kettle",
    "manufacturer": "29 Kettle",
    "serial": "",
    "description": "Weights to hold down the canopy",
    "maintenance": [],
    "groups": {
        0: {
            "group": "Weights",
            "groupId": "-MXITgDrfztDSF4mdFS7"
        },
        1: {
            "group": "Green Kit",
            "groupId": "-MXIykptb75HQYHm8T2K"
        }
    },
    "usage": {
        "210401": {
            "status": "registered"
        }
    },
    "url": "" }
];

//  EXECUTEC

allItems.forEach(function(item) {
    addInventoryItems(item);
});
