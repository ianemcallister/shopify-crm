
ckc.directive('adminShippingOrder', adminShippingOrder);

/* @ngInject */
function adminShippingOrder() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminShippingOrder-directive.htm',
        replace: true,
        scope: {
            eventId: "=",
        },
        link: linkFunc,
        controller: adminShippingOrderController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('eventId', function(newValue, oldValue) {
            //console.log('merchant ', scope.vm.merchant);
            if(scope.vm.eventId != undefined) {
                var path = '/Projections/Shipping';
                //console.log('path: ', path);
                scope.vm.initFirebase(path);
            }
        });
    }
    
    adminShippingOrderController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminShippingOrderController($scope, $log, $firebaseObject) {
        //  NOTIFY PROGESS
        //console.log('adminShippingOrderController');
        //define local variables
        $scope.vm.order = {};
        var self = this;
        self.initFirebase = function(path) {
            console.log('init firebase', path);
            var db = firebase.database();
            var ref = db.ref(path).orderByChild('eventId').equalTo($scope.vm.eventId);
            $scope.vm.order = $firebaseObject(ref);
            console.log($scope.vm.order);
        };
        self.createBlankShippingOrder = function() {
            //  NOTIFY PROGRESS
            console.log('creating blank shipping order');

            //  DEFINE LOCAL VARIABLES
            var timestamp = new Date(Date.now()).toISOString();
            var db = firebase.database();
            var path = 'Projections/Shipping'
            var ref = db.ref(path);
            var recordId = ref.push().key
            var record = db.ref(path + "/" + recordId);
            record.set({
                "_createdAt": timestamp,
                "_updatedAt": timestamp,
                "_createdBy": 'admin',
                "_updatedBy": 'admin',
                "_id": recordId,
                "eventId": $scope.vm.eventId
            }, function(error) {
                if(error) console.log('write error', error);
                $scope.vm.order = $firebaseObject(record);
            });
        };
        self.createShippingOrderFromTemplate = function() {
            //  NOTIFY PROGERSS
            console.log('creating shiping order from template');
        };

    };

    return directive;		
};