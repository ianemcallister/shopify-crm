/*
*   COMMAND LINE INTERFACE: CREATE EVENTS
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
    var merchantId  = '-MVrZajcORbaTjkuZL2a';
    var channelId   = '-MWHyj8sJgIlGTkit-Vq';
    var seasonId    = '-MWeFJZmTri6IkEijs2S';
    var startsAt    = '';
    var isTemplate  = true;

    //  EXECUTE
    try {
        await ops.Events.createSeries(merchantId, channelId, seasonId, startsAt, isTemplate);
        console.log('finished saving');
        //process.exit();
    } catch (error) {
        console.log('CLI: Create Events Error');
        console.log(error);
    }
};

//  EXECUTE
CreateNewEvents();


