
ckc.directive('teamCookTimeChart', teamCookTimeChart);

/* @ngInject */
function teamCookTimeChart() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-cookTimeChart-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: teamCookTimeChartController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamCookTimeChartController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamCookTimeChartController($scope, $log, $firebaseObject) {


    };

    return directive;		
};