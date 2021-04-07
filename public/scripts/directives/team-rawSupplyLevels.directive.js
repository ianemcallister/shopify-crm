
ckc.directive('teamRawSupplyLevels', teamRawSupplyLevels);

/* @ngInject */
function teamRawSupplyLevels() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-rawSupplyLevels-directive.htm',
        replace: true,
        scope: {
            supplies: "=",
            orders: "="
        },
        link: linkFunc,
        controller: teamRawSupplyLevelsController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('vm.supplies', function(newValue, oldValue) {
            if(scope.vm.supplies != undefined && scope.vm.orders) {
                scope._updateSupplyLevels();
            }
        });
    }
    
    teamRawSupplyLevelsController.$inject = ['$scope', '$log', '$firebaseObject', 'logicService'];

    /* @ngInject */
    function teamRawSupplyLevelsController($scope, $log, $firebaseObject, logicService) {
        //  NOTIFY PROGRES
        //	DEFINE: PRIVATE VARIABLES
        //	DEFINE: VIEW MODEL VARIBLES
        //  PRIVATE FUNCTIONS
        $scope._updateSupplyLevels = function() {
            console.log('updating supply levels');
            $scope.vm.supplies = logicService.buildMfgReportSupplyLevels({
                supplies: $scope.vm.supplies,
                orders: $scope.vm.orders
            });
        }
        //  VIEW MODEL FUNCTIONS

    };

    return directive;		
};