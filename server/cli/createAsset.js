/*
*   COMMAND LINE INTERFACE: CREATE ASSET
*/
//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES
async function createAssetAcct() {
    //  notify
    //  LOCAL
    var SKU = {
        sku: "310PECFB",
        serial: "",
        name: "31.0oz Staged Pecans",
        type: "staged_products",
        description: "Gallon ziploc of pecans and sugar",
        detail_type: "pecans",
        units: "count",
        locations: [ "", "Warehouse", "Kit 01", "Kit 02", "Kit 03", "Kit 04", "Kit 05", "Kit 06", "Kit 07", "Kit 08" ]
    };


    //  EXECUTE
    try {
        var result = await ops.Assets.create.SKUwithLocations(SKU)
        console.log(result);
    } catch (error) {
        console.log('createAssetAcct error: ');
        console.error(error);
    }
};

//  EXECUTEC
createAssetAcct();