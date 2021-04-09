/*
*   COMMAND LINE INTERFACE: CREATE MANUFACTURING REPORT
*/

//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES

/*
*
*/
async function CreateNewEvents() {
    //  NOTIFY PROGRESS
    console.log('creating new events');

    //  LOCAL VARIABLES
    var data = {
        assignedTo: {
            id: "",
            name: "Ian"
        },
        channel: "Test channel 3",
        completedAt: "",
        device: {
            id: "C4F1253F-8969-4C88-B20D-4E89F622884D",
            name: ""
        },
        eventDate: "2021-04-08",
        eventId: "",
        id: "",
        isReady: false,
        orders: {
            "2021-04-07T18:00:00-07:00": {
                description: "Opening Balance",
                qty: 0,
                sku: "00000000",
                updates: {
                    "08FLOCPS" : 100,
                    "08FLOLDS" : 50,
                    "16FLOCPS" : 100,
                    "16FLOLDS" : 50,
                    "320SCSHG" : 6,
                    "330SPCNG" : 15,
                    "360SALMG" : 6,
                    "360SHZLG" : 6,
                    "400SPNTG" : 2
                }
            }
        },
        supplies: {
            "08FLOCPS" : {
            "name" : "Half Pint Cups",
            "qty" : 0,
            "size" : "half_pint",
            "type" : "packaging",
            "variety" : "cup"
            },
            "08FLOLDS" : {
            "name" : "Half Pint Lids",
            "qty" : 0,
            "size" : "half_pint",
            "type" : "packaging",
            "variety" : "lids"
            },
            "16FLOCPS" : {
            "name" : "Pint Cups",
            "qty" : 0,
            "size" : "pint",
            "type" : "packaging",
            "variety" : "cup"
            },
            "16FLOLDS" : {
            "name" : "Pint Lids",
            "qty" : 0,
            "size" : "pint",
            "type" : "packaging",
            "variety" : "lids"
            },
            "320SCSHG" : {
            "name" : "Staged Cashews: Full Batches",
            "qty" : 6,
            "size" : "full_batch",
            "type" : "staged_nuts",
            "variety" : "Cashews"
            },
            "330SPCNG" : {
            "name" : "Staged Pecans: Full Batches",
            "qty" : 0,
            "size" : "full_batch",
            "type" : "staged_nuts",
            "variety" : "Pecans"
            },
            "330SSPCN" : {
            "name" : "Cooked SS Pecans",
            "qty" : 0,
            "size" : "",
            "type" : "cooked_nuts",
            "variety" : "pecans"
            },
            "360SALMG" : {
            "name" : "Staged Almonds: Full Batches",
            "qty" : 0,
            "size" : "full_batch",
            "type" : "staged_nuts",
            "variety" : "Almonds"
            },
            "360SHZLG" : {
            "name" : "Staged Hazelnuts: Full Batches",
            "qty" : 0,
            "size" : "full_batch",
            "type" : "staged_nuts",
            "variety" : "Hazelnuts"
            },
            "360SSALM" : {
            "name" : "Cooked Sweet & Salty Almonds",
            "qty" : 0,
            "size" : "",
            "type" : "cooked_nuts",
            "variety" : "almonds"
            },
            "360SSHZL" : {
            "name" : "Cooked SS Hazelnuts",
            "qty" : 0,
            "size" : "",
            "type" : "cooked_nuts",
            "variety" : "hazelnuts"
            },
            "400SPNTG" : {
            "name" : "Staged Peanuts: Full Batches",
            "qty" : 0,
            "size" : "full_batch",
            "type" : "staged_nuts",
            "variety" : "Peanuts"
            },
            "68FLOPLB" : {
            "name" : "Platter Bases",
            "qty" : 0,
            "size" : "base",
            "type" : "packaging",
            "variety" : "platters"
            },
            "68FLOPLL" : {
            "name" : "Platter Lids",
            "qty" : 0,
            "size" : "lids",
            "type" : "packaging",
            "variety" : "platters"
            },
            "BURBONMX" : {
            "name" : "Bourbon Mix",
            "qty" : 0,
            "size" : "",
            "type" : "",
            "variety" : ""
            },
            "RAWSSALT" : {
            "name" : "Raw Sea Salt",
            "qty" : 0,
            "size" : "",
            "type" : "",
            "variety" : ""
            },
            "SWTSLTMX" : {
            "name" : "Sweet & Salty Mix",
            "qty" : 0,
            "size" : "",
            "type" : "",
            "variety" : ""
            }
        }
    }

    //  EXECUTE
    try {
        await ops.Actualizations.Mfg.create(data);
        //console.log('finished saving');
        //process.exit();
    } catch (error) {
        console.log('CLI: Create Events Error');
        console.log(error);
    }
};

//  EXECUTE
CreateNewEvents();


