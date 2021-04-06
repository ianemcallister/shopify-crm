
ckc.directive('teamCookedSupplyLevels', teamCookedSupplyLevels);

/* @ngInject */
function teamCookedSupplyLevels() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-cookedSupplyLevels-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: teamCookedSupplyLevelsController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamCookedSupplyLevelsController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamCookedSupplyLevelsController($scope, $log, $firebaseObject) {


    };

    return directive;		
};