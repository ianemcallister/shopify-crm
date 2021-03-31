/*
*   COMMAND LINE INTERFACE: Add Inventory Group
*/
//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES
async function addInventoryGroup(item) {
    //  notify
    //  LOCAL
    const templateFile  = fs.readFileSync('./server/models/inventoryGroupTemplate.json', 'utf8');
    var group            = JSON.parse(templateFile);
    
    //  CUSTOMIZED ELEMENTS
    group.name           = item.name;
    group.description    = item.description;
    group.notes          = item.notes;

    //  EXECUTE
    try {
        await ops.Inventory.Groups.create(group);
        console.log('group added');
    } catch (error) {
        console.log('addInventoryRole error: ');
        console.error(error);
    }
};
var allItems = [
    { name: 'Red Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Yellow Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Blue Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Green Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Silver Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Black Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'White Group', description: "All the components of the mobile retail setup.", notes: "" },
    { name: 'Orange Group', description: "All the components of the mobile retail setup.", notes: "" }
];

//  EXECUTEC

allItems.forEach(function(item) {
    addInventoryGroup(item);
});
