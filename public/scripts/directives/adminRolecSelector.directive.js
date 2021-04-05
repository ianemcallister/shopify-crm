
ckc.directive('adminRoleSelector', adminRoleSelector);

/* @ngInject */
function adminRoleSelector() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminRoleSelector-directive.htm',
        replace: true,
        scope: {
            category: "=",
            role: "="
        },
        link: linkFunc,
        controller: adminRoleSelectorController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('vm.role', function(newValue, oldValue) {
            //  NOTIFY PROGRESS
            console.log('role: ', scope.vm.role);

            if(scope.vm.allRoles[newValue] != undefined) {
                scope.vm.category = scope.vm.allRoles[newValue].name;
            } else {
                scope.vm.category = '';
            }

        });
    }
    
    adminRoleSelectorController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminRoleSelectorController($scope, $log, $firebaseObject) {
        //  NOTIFY PROGESS
        console.log('in the adminRoleSelectorController');

        //  LOCAL VARIABLES
        var self = this;

        //  PRIVATE FUNCTIONS
        function _initFirebase() {
            //  NOTIYF PROGRESS
            //  LOCAL VARIABLES
            var db = firebase.database();
            var ref = db.ref('Inventory/Roles');
            $scope.vm.allRoles = $firebaseObject(ref);

            //  EXECUTE
        };
        //  LOCAL FUNCTIONS
        $scope.selectionChanged = function(value) {
            console.log('selection changed: ', value);
        };
        //  EXECUTE
        _initFirebase();
    };

    return directive;		
};