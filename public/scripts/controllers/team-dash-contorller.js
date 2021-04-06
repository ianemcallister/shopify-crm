ckc
    .controller('teamDashController', teamDashController);

	teamDashController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamDashController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the team dash controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
