ckc
    .controller('adminChannelsController', adminChannelsController);

	adminChannelsController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminChannelsController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the admin channels controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
