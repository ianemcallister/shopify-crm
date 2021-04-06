ckc
    .controller('teamClosingReportController', teamClosingReportController);

	teamClosingReportController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamClosingReportController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the closing report controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
