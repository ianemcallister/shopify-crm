ckc
    .controller('adminPlanningController', adminPlanningController);

	adminPlanningController.$inject = ['$scope','$log', '$routeParams', '$firebaseObject'];

/* @ngInject */
function adminPlanningController($scope, $log, $routeParams, $firebaseObject) {
    //  notify progess
    console.log($routeParams);
	//define view model variable
	var vm = this;
    vm.model ={
        merchantId: $routeParams.merchId,
        channelId: $routeParams.channelId,
        seasonId: $routeParams.seasonId,
        eventId: $routeParams.eventId,
        eventData: {},
        document: ""
    };

    if($routeParams.eventId != undefined) {
        var db = firebase.database();
        var readpath = 'Merchants/' + $routeParams.merchId + "/Events/" + $routeParams.eventId;
        var ref = db.ref(readpath);
        vm.model.eventData = $firebaseObject(ref);
    }

	$log.info('in the admin planning controller');	    //  TODO: TAKE THIS OUT LATER


}
