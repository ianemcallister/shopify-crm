
ckc.directive('teamRecordCooking', teamRecordCooking);

/* @ngInject */
function teamRecordCooking() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-recordCooking-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: teamRecordCookingController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamRecordCookingController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function teamRecordCookingController($scope, $log, $firebaseObject) {


    };

    return directive;		
};