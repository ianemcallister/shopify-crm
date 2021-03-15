/*
*   COMMAND LINE INTERFACE
*/

var Firebase    = require('./firebase/stdops.js');

async function execute() {
    try {
        await Firebase.test()
    } catch (error) {
        console.log('error', error);
    }
};

execute();
