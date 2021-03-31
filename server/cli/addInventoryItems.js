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
    "name": "Red Roaster",
    "roles": [],
    "vendor": "German Nut Roasters, UT",
    "manufacturer": "Mandelprofi",
    "serial": "",
    "description": "Mandelprofi Mini",
    "group": "Red Group",
    "groupId": "-MX8pvVkNlEYNn7TNWbR",
    "maintenance": [],
    "usage": [],
    "url": "" }
];

//  EXECUTEC

allItems.forEach(function(item) {
    addInventoryItems(item);
});
