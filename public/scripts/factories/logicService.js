/*
*	FIREBASE
*
*/

//  DEFINE MODULE
ckc.factory('logicService', logicService);

//  DEPENDENCY INJECTION
logicService.$inject = ['$log'];

//  DECLARE THE SERVICE
/* @ngInject */
function logicService($log) {

    //  NOTIFY PROGRESS
    $log.info('Instanciating logicService Factory');

    //  DEFINE METHODS
    var logicMod = {
        buildMfgReportSupplyLevels: BuildMfgReportSupplyLevels
    };

    /*
    *   BUILD MANUFACTURING REPORT SUPPLY LEVELS
    */
    function BuildMfgReportSupplyLevels(data) {
        //  NOTIFY PROGRESS
        console.log('building mfg report supply levels');
        //  DEFINE LOCAL VARIABLES
        var supplies        = data.supplies;
        var orders          = data.orders;

        //  ZERO OUT SUPPLIES
        Object.keys(supplies).forEach(function(supplyKey) {
            supplies[supplyKey].qty = 0;
        });

        //  ITERATE OVER ORDERS
        Object.keys(orders).forEach(function(orderKey) {

            //  ITERATE OVER UPDATES
            Object.keys(orders[orderKey].updates).forEach(function(updateKey) {

                //  REFLECT THE UPDATES
                supplies[updateKey].qty += orders[orderKey].updates[updateKey];
                console.log(updateKey, orders[orderKey].updates[updateKey]);
            });

        });


        //  RETURN
        return supplies;
    };


    //   RETURN
    return logicMod;
};