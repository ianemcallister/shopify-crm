ckc
    .controller('teamMfgReportController', teamMfgReportController);

	teamMfgReportController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamMfgReportController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the manufacturing report controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
