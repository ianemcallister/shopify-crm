ckc
    .controller('teamMfgReportController', teamMfgReportController);

	teamMfgReportController.$inject = ['$scope','$log', '$routeParams', '$firebaseObject', 'logicService'];

/* @ngInject */
function teamMfgReportController($scope, $log, $routeParams, $firebaseObject, logicService) {
	//	NOTIFY PROGRESS
	$log.info('in the manufacturing report controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER

	//	DEFINE: PRIVATE VARIABLES
	var _path = 'Actualizations/Mfg/' + $routeParams.mfgReportId;
	var _db = firebase.database();
	var _reportRef = _db.ref(_path);

	//	DEFINE: VIEW MODEL VARIBLES
	var vm = this;
	var report = $firebaseObject(_reportRef);

	//	bind to the scope
	report.$bindTo($scope, 'vm.report')
	.then(function() {
		console.log(vm.report);
	}).catch(function(error) {
		console.log("Error: ", error);
	});

	//	DEFINE: PRIVATE FUNCTIONS
	//	DEFINE: VIEW MODEL FUNCITONS
	//	EXECUTE
	report.$loaded()
	.then(function(data) {
		//	When the data loads, process it

		//	BUILD SUPPLY LEVELS
		$scope.vm.report.supplies = logicService.buildMfgReportSupplyLevels(data);

		report.$save()
		.then(function(ref) {
			console.log('db load updates saved');
		}).catch(function(e) {
			console.log("error: ", e);
		})
		

	}).catch(function(e) {
		console.log("Error: ", e);
	});




}
