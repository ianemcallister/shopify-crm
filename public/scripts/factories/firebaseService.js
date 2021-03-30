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
        test: function() { return new Promise(function(resolve, reject) { resolve('testing again'); }) }
    };

    /*
    *   READ
    */
    function read(path) {
        return 11
    };


    //   RETURN
    return firebaseMod;
};