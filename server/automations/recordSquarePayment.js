/*
*
*/

//  NOTIFY PROGRESS
//  DEFINE DEPENDENCEIES
const Square        = require('../square/stdops');
const Firebase      = require('../firebase/stdops');
const Ops           = require('../operations/ops');
const moment        = require('moment');

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
    var eventDate              = moment(paymentRecord.created_at).format("YYYY-MM-DD");
    
    
    //  EXECUTE
    try {
        var sqOrder                 = await Square.orders.get(paymentRecord.order_id);
        var eventDayReportsSnapshot = await Firebase.Actualizations.Mfg.dailyReports(eventDate);
        var desiredReport           = Ops.Actualizations.Mfg.selectReportFromReports(paymentRecord, eventDayReportsSnapshot.val());
        var orderUpdates            = await Ops.Actualizations.Mfg.buildOrderUpdates(sqOrder, desiredReport);
        console.log('orderUpdates', orderUpdates);
        var suppliesUpdates         = await Ops.Actualizations.Mfg.buildSuppliesUpdates(orderUpdates);
        console.log('suppliesUpdates: ', suppliesUpdates);
        var orderUpdatesPromise     = Firebase.Actualizations.Mfg.updateOrders(orderUpdates);
        var suppliesUpdatesPromise  = Firebase.Actualizations.Mfg.updateSupplies(suppliesUpdates);
        
        

        /*Promise.all([
            orderUpdatesPromise,
            suppliesUpdatesPromise
        ]).then(function(success) {
            console.log('Promises Processed');
            return success;
        }).catch(function(error) {
            console.log("UsingPaymentId Error: ", error);
        })*/

        return true;
    } catch (error) {
        console.log('Error: ', error);
    };
};

//  EXECUTE

module.exports = rcdSqurePayemnts;
