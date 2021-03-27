ckc
    .controller('inventoryReportController', inventoryReportController);

	inventoryReportController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function inventoryReportController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the inventory report controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
