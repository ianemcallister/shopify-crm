ckc
    .controller('adminPlanningController', adminPlanningController);

	adminPlanningController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminPlanningController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;
    vm.model ={
        merchantId: $routeParams.merchId,
        channelId: "",
        seasonId: "",
        document: ""
    }

	$log.info('in the admin planning controller');	    //  TODO: TAKE THIS OUT LATER


}
