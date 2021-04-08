/*
*
*/

//  NOTIFY PROGRESS
//  DEFINE DEPENDENCEIES
const Square                = require('../square/stdops');
const Firebase              = require('../firebase/stdops');

//  LOCAL VARIABLES
var rcdSqurePayemnts = {
    usingPaymentId: UsingPaymentId
};

/*
*
*/
async function UsingPaymentId(paymentRecord) {
    //  NOTIFY PROGRESS
    //  DEFINE LOCAL VARIABLES
    var deviceId = paymentRecord.card_details.device_details.device_installation_id;
    
    //  EXECUTE
    try {
        //var paymentRecord = await Square.payments.get(paymentId);
        var report = await Firebase.Actualizations.Mfg.recordByDevice(deviceId);
        console.log('found this report');
        console.log(report);

        return true;
    } catch (error) {
        console.log('Error: ', error);
    };
};

//  EXECUTE

module.exports = rcdSqurePayemnts;
