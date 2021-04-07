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
        buildMfgReportSupplyLevels:     BuildMfgReportSupplyLevels
    };

    /*
    *   BUILD MANUFACTURING REPORT SUPPLY LEVELS
    */
    function BuildMfgReportSupplyLevels(data) {
        //  NOTIFY PROGRESS
        console.log('building mfg report supply levels', data);
        //  DEFINE LOCAL VARIABLES
        var supplies        = data.supplies;
        var orders          = data.orders;

        //  ZERO OUT SUPPLIES
        Object.keys(supplies).forEach(function(supplyKey) {
            supplies[supplyKey].qty = 0;
        });

        //  ITERATE OVER ORDERS
        Object.keys(orders).forEach(function(orderKey) {

            //  LOCAL VARIABLES
            var sku = orders[orderKey].sku;

            //  ITERATE OVER UPDATES - CONSUMED MATERIALS
            Object.keys(orders[orderKey].updates).forEach(function(updateKey) {

                //  REFLECT THE UPDATES
                supplies[updateKey].qty += orders[orderKey].updates[updateKey];
                //console.log(updateKey, orders[orderKey].updates[updateKey]);
            });

            //  ADDRESS PRODUCED MATERIALS
            if(sku == "330SSPCN" || sku == "360SSHZL" || sku == "360SSALM" || sku == "320SSCSH" || sku == "400SSPNT" || sku == "330BNPCN" || sku == "360BNHZL" || sku == "360BNALM") {
                supplies[sku].qty += orders[orderKey].qty
            }
            
        });

        //  UPDATE PRODUCED


        //  RETURN
        return supplies;
    };



    //   RETURN
    return logicMod;
};