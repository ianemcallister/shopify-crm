
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
        //	NOTIFY PROGRESS
        console.log('teamCookTimeChartController');
        //	DEFINE: PRIVATE VARIABLES
        //	DEFINE: VIEW MODEL VARIBLES
        var vm = this;
        $scope.vm.schedule = {
            minInt: "15",
            slots: {
                "2021-05-01T08:30:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T08:45:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T09:00:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T09:15:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T09:30:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T09:45:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T10:00:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T10:15:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T10:30:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T10:45:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T11:00:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T11:15:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" },
                "2021-05-01T11:30:00-08:00": { wasFullfilled: false, sku: "", hasAddnl: false, addSku: "" }
            }
        }
        //	DEFINE: PRIVATE FUNCTIONS
        //	DEFINE: VIEW MODEL FUNCITONS

    };

    return directive;		
};