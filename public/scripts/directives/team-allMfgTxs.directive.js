
ckc.directive('teamAllMfgTxs', teamAllMfgTxs);

/* @ngInject */
function teamAllMfgTxs() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-allMfgTxs-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: teamAllMfgTxsController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamAllMfgTxsController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamAllMfgTxsController($scope, $log, $firebaseObject) {


    };

    return directive;		
};