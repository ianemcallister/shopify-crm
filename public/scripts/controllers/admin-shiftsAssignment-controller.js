ckc
    .controller('adminShiftAssignmentController', adminShiftAssignmentController);

	adminShiftAssignmentController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminShiftAssignmentController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the admin shift assignment controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
