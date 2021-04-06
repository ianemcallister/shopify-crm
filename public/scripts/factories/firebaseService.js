/*
*	FIREBASE
*
*/

//  DEFINE MODULE
ckc.factory('FirebaseService', FirebaseService);

//  DEPENDENCY INJECTION
FirebaseService.$inject = ['$log', '$http'];

//  DECLARE THE SERVICE
/* @ngInject */
function FirebaseService($log, $http) {

    //  NOTIFY PROGRESS
    $log.info('Instanciating FirebaseService Factory');

    //  DEFINE METHODS
    var firebaseMod = {
        value: "something",
        read: read,
        mfg: {
            recordCooking: RecordCookingBatch
        },
        test: function() { console.log('firebase Mod Test') }
    };

    /*
    *   READ
    */
    function read(path) {
        return 11
    };

    /*
    *   RECORD COOKING BATCH
    */
    function RecordCookingBatch(order) {
        //  NOTIFY PROGRESS
        console.log('RecordCookingBatch got this order: ', order);

        //  LOCAL VARIABLES
        //  EXECUTE
    };

    //   RETURN
    return firebaseMod;
};