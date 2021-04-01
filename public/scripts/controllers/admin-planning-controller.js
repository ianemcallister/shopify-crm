ckc
    .controller('adminPlanningController', adminPlanningController);

	adminPlanningController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminPlanningController($scope, $log, $routeParams) {
    //  notify progess
    console.log($routeParams);
	//define view model variable
	var vm = this;
    vm.model ={
        merchantId: $routeParams.merchId,
        channelId: $routeParams.channelId,
        seasonId: $routeParams.seasonId,
        eventId: $routeParams.eventId,
        eventData: {},
        document: ""
    }

	$log.info('in the admin planning controller');	    //  TODO: TAKE THIS OUT LATER


}
