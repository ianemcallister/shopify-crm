
ckc.directive('teamRawSupplyLevels', teamRawSupplyLevels);

/* @ngInject */
function teamRawSupplyLevels() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-rawSupplyLevels-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: teamRawSupplyLevelsController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamRawSupplyLevelsController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamRawSupplyLevelsController($scope, $log, $firebaseObject) {


    };

    return directive;		
};