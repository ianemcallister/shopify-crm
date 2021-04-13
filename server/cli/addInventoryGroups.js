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
    var readpath = path.resolve(__dirname, './server/models/inventoryGroupTemplate.json');
    const templateFile  = fs.readFileSync(readpath, 'utf8');
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
    { name: 'Cooking Boxes', description: "All Boxes used for cooking", notes: "" },
    { name: 'Cleaning Boxes', description: "All Boxes used for cleaning and misc. supplies", notes: "" },
    { name: 'Packaging Boxes', description: "All Boxes used for packaging supplies", notes: "" },
    { name: 'Cooked Nuts Boxes', description: "All Boxes used for cooked nuts bins", notes: "" },
    { name: 'Staged Nuts Boxes', description: "All Boxes used for staged nuts", notes: "" }
];

//  EXECUTEC

allItems.forEach(function(item) {
    addInventoryGroup(item);
});
