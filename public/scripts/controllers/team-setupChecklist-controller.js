ckc
    .controller('teamSetupChecklistController', teamSetupChecklistController);

	teamSetupChecklistController.$inject = ['$scope','$log', '$routeParams', '$firebaseObject'];

/* @ngInject */
function teamSetupChecklistController($scope, $log, $routeParams, $firebaseObject) {
	//	NOTIFY PROGRESS
	$log.info('in the setup checklist controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER

	//	DEFINE: PRIVATE VARIABLES
	var _path = 'Actualizations/Mfg/' + $routeParams.shippingReportId;
	var _db = firebase.database();
	var _reportRef = _db.ref(_path);

	//	DEFINE: VIEW MODEL VARIBLES
	var vm = this;
	var report = $firebaseObject(_reportRef);

	//	bind to the scope
	report.$bindTo($scope, 'vm.report')
	.then(function() {

	});

	//	DEFINE: PRIVATE FUNCTIONS
	//	DEFINE: VIEW MODEL FUNCITONS

	
	
	


};
