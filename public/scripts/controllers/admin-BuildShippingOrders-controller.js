ckc
    .controller('adminBuildShippingOrdersController', adminBuildShippingOrdersController);

	adminBuildShippingOrdersController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function adminBuildShippingOrdersController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the build shipping orders controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}
