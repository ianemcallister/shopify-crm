/*
*   COMMAND LINE INTERFACE: CREATE ASSET
*/
//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES
async function addInventoryRole(item) {
    //  notify
    //  LOCAL
    const templateFile  = fs.readFileSync('./server/models/inventoryRoleTemplate.json', 'utf8');
    var role            = JSON.parse(templateFile);
    
    //  CUSTOMIZED ELEMENTS
    role.name           = item.name;
    role.description    = item.description;
    role.parent         = item.parent;

    //  EXECUTE
    try {
        await ops.Inventory.Roles.create(role);
        console.log('roll added');
    } catch (error) {
        console.log('addInventoryRole error: ');
        console.error(error);
    }
};
var allItems = [
    { name: 'Pint Lids', description: "50x pint lids.", parent: "-MX8jNAp8ynkyxgLVUbE" },
    { name: 'Half Pint Lids', description: "50x half pint lids.", parent: "-MX8jNAwukh34erN2ZqZ" },
    { name: 'Platter Lids', description: "10x platter lids.", parent: "-MX8jNAxTar3jJEh0KFa" },
    { name: 'Platter Bottoms', description: "10x platter bottoms.", parent: "-MX8jNAxTar3jJEh0KFa" }
];

//  EXECUTEC

allItems.forEach(function(item) {
    addInventoryRole(item);
});
