ckc
    .controller('adminChannelController', adminChannelController);

	adminChannelController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminChannelController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the admin channel controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER

	//	pull in a list of shifts for the day
	//	pull in a list of events for the day
	//	assign a shift to each event
}
