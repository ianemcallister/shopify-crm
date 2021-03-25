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
    const templateFile  = fs.readFileSync('./models/seasonsTemplate.json', 'utf8');
    let record = JSON.parse(templateFile);

    //  EXECUTE
    try {
        await ops.Seasons.create('-MVrZajcORbaTjkuZL2a', '-MWHyj8sJgIlGTkit-Vq', record);
        console.log('finished saving');
        //process.exit();
    } catch (error) {
        console.log('CLI: Create Season Error');
        console.log(error);
    }
};

//  EXECUTE
CreateNewSeason();


