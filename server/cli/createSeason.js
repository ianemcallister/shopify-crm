/*
*   COMMAND LINE INTERFACE: CREATE SEASON
*/

//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES

async function CreateNewSeason() {
    //  NOTIFY PROGRESS
    console.log('creating a new channel');

    //  LOCAL VARIABLES
    var merchantId = '-MVrZajcORbaTjkuZL2a';
    var channelId = "-MWe4orVlZyjItAXclBF"
    const templateFile  = fs.readFileSync('../models/preBuilt/newSeason.json', 'utf8');
    let record = JSON.parse(templateFile);

    //  EXECUTE
    try {
        var seasonId = await ops.Seasons.create(merchantId, channelId, record);

        await ops.Events.createSeries(merchantId, channelId, seasonId, '', record.templateHours);
        //process.exit();
    } catch (error) {
        console.log('CLI: Create Season Error');
        console.log(error);
    }
};

//  EXECUTE
CreateNewSeason();


