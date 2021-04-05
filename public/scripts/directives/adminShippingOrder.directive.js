
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
            eventData: "="
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
        $scope.vm.roleOptions = {};
        var db = firebase.database();
        var rolesRef = db.ref('Inventory/Roles');
        var itemsRef = db.ref('Inventory/Items');
        $scope.vm.itemRoles = $firebaseObject(rolesRef);
        $scope.vm.allItems = $firebaseObject(itemsRef);
        var self = this;

        //  PRIVATE: BUILD SIMPLE DATE
        function _buildSimpleDate(dateString) {
            //  NOTIFY PROGESS
            //  LOCAL VARIABLES
            var returnObject = dateString.split('T');
            //  RETURN VALUE
            return returnObject[0];
        };
        self.initFirebase = function(path) {
            //  notify progress
            console.log('init firebase', path);

            //  DEFINE LOCAL VARIABLES
            var db = firebase.database();
            var ref = db.ref(path).orderByChild('eventId').equalTo($scope.vm.eventId);
            console.log('event data: ', $scope.vm.eventData);
            $scope.vm.eventData.simpleDate = _buildSimpleDate($scope.vm.eventData.schedule.startsAt);

            //  collect values from db
            ref.once('value', function(snapshot) {

                //  LOCAL VARIABLES
                var orders = snapshot.val();
                var orderId = "";
                
                //  PULL OUT THE ORDERID
                Object.keys(orders).forEach(function(key) {
                    orderId = key;
                });

                //  BUILD THE FIREBASE OBJECT
                var record = db.ref(path + "/" + orderId);
                $scope.vm.order = $firebaseObject(record);

                //  WAIT UNTIL THE MODEL IS LOADED
                $scope.vm.order.$loaded()
                .then(function(data) {
                    //  NOTIFY PROGRESS
                    console.log('order loaded', data.items);

                    //  build model for each item of the order
                    Object.keys(data.items).forEach(function(key) {
                        //  define local variables
                        var thisRole = data.items[key].role;
                        var path = 'Inventory/Items';
                        var ref = db.ref(path);
                        
                        $scope.vm.roleOptions[thisRole] = $firebaseObject(ref.orderByChild('role').equalTo(thisRole))
                    });

                }).catch(function(error) {
                    console.error("Error:", error);
                });
            });
            
        };
        self.createBlankShippingOrder = function() {
            //  NOTIFY PROGRESS
            console.log('creating blank shipping order');

            //  DEFINE LOCAL VARIABLES
            var timestamp = new Date(Date.now()).toISOString();
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
        self.loadRoleItems = function(roleId) {
            //  NOTIFY PROGRESS
            console.log('loading role id: ', roleId);
        }
        self.saveOrder = function() {
            // LOCAL VARIABLES
            var timestamp = new Date(Date.now()).toISOString();
            $scope.vm.order.updatedAt = timestamp;
            $scope.vm.order.updatedBy = "admin";

            //  NOTIFY PROGRESS
            console.log('saving order', $scope.vm.order);

            $scope.vm.order.$save()
            .then(function(success) {
                console.log('success: ', success);
            }).catch(function(error) {
                console.log('Error: ', error);
            });
        }
        self.addItem = function() {
            //  NOTIFY PROGRES
            //  LOCAL VARIABLES
            $scope.vm.order.items.push({category: "", role: ""})
            //  EXECUTE
        };
    };

    return directive;		
};