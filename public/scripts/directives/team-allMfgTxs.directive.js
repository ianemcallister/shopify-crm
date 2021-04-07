
ckc.directive('teamAllMfgTxs', teamAllMfgTxs);

/* @ngInject */
function teamAllMfgTxs() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-allMfgTxs-directive.htm',
        replace: true,
        scope: {
            txs: "="
        },
        link: linkFunc,
        controller: teamAllMfgTxsController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch("vm.txs", function(newValue, oldValue) {
            //console.log('txs updated: ');
            //console.log(newValue);
        });
    }
    
    teamAllMfgTxsController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamAllMfgTxsController($scope, $log, $firebaseObject) {
        //  NOTIFY PROGRES
        //console.log('teamAllMfgTxsController: ');
        //  DEFINE PRIVATE VARIABLES
        //  DEFINE VIEW MODEL VARIBABLES
        //  PRIVATE FUNCTIONS
        //  VIEW MODEL FUNCTIONS


    };

    return directive;		
};