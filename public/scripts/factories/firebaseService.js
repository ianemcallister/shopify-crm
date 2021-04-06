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
        var readPath = 'Inventory/MFG/' + order.sku;
        var _db = firebase.database();
        var _ref = _db.ref(readPath);
        //  EXECUTE
        return new Promise(function(resolve, reject) {

            //  COLLECT THE MODEL OF THE PRODUCED PRODUCT
            _ref.on('value', function(snapshot) {
                //  ITERATE OVER THE COMPONENTS
                //  UPDATE THE PRODUCT VALUES
                //  UPDATE THE RESOURCE VALUES
                //  EXECUTE UPDATES

                resolve(snapshot.val());
            });
            

            
        });
    };

    //   RETURN
    return firebaseMod;
};