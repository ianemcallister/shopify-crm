/*
*   COMMAND LINE INTERFACE: CREATE CHANNELS
*/

//  DEFINE DEPENDENCIES
const fs                = require('fs');
const ops               = require('../operations/ops');

//  LOCAL VARIABLES

async function CreateNewChannel() {
    //  NOTIFY PROGRESS
    console.log('creating a new channel');

    //  LOCAL VARIABLES
    const templateFile  = fs.readFileSync('./models/preBuilt/newChannel.json', 'utf8');
    let record = JSON.parse(templateFile);

    //  EXECUTE
    try {
        await ops.Channels.create('-MVrZajcORbaTjkuZL2a', record);
        console.log('finished saving');
        //process.exit();
    } catch (error) {
        console.log('CLI: Create Channels Error');
        console.log(error);
    }
};

//  EXECUTE
CreateNewChannel();


