ckc
    .controller('teamSetupChecklistController', teamSetupChecklistController);

	teamSetupChecklistController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamSetupChecklistController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the setup checklist controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
