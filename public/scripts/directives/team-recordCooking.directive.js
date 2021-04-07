
ckc.directive('teamRecordCooking', teamRecordCooking);

/* @ngInject */
function teamRecordCooking() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/directives/team-recordCooking-directive.htm',
        replace: true,
        scope: {
            orders: "=",
            supplies: "="
        },
        link: linkFunc,
        controller: teamRecordCookingController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        
    }
    
    teamRecordCookingController.$inject = ['$scope', '$log', '$firebaseObject', 'FirebaseService', 'logicService'];

    /* @ngInject */
    function teamRecordCookingController($scope, $log, $firebaseObject, FirebaseService, logicService) {
        //	NOTIFY PROGRESS
        console.log('teamRecordCookingController');
        //	DEFINE: PRIVATE VARIABLES
        //	DEFINE: VIEW MODEL VARIBLES
        var vm = this;
        $scope.vm.areFullBatches = true;
        $scope.vm.recipies = {
            "SS Pecans":    { isSelected: false, classes: ["btn-outline-info"],     product: { fbsku: "330SSPCN", hbsku: "", qty: 1}},
            "SS Hazelnuts": { isSelected: false, classes: ["btn-outline-info"],     product: { fbsku: "360SSHZL", hbsku: "", qty: 1}}, 
            "SS Almonds":   { isSelected: false, classes: ["btn-outline-info"],     product: { fbsku: "360SSALM", hbsku: "", qty: 1}}, 
            "SS Cashews":   { isSelected: false, classes: ["btn-outline-info"],     product: { fbsku: "320SSCSH", hbsku: "", qty: 1}}, 
            "SS Peanuts":   { isSelected: false, classes: ["btn-outline-info"],     product: { fbsku: "400SSPNT", hbsku: "", qty: 1}}, 
            "Bb Pecans":    { isSelected: false, classes: ["btn-outline-warning"],  product: { fbsku: "330BNPCN", hbsku: "", qty: 1}}, 
            "Bb Hazelnuts": { isSelected: false, classes: ["btn-outline-warning"],  product: { fbsku: "360BNHZL", hbsku: "", qty: 1}}, 
            "Bb Almonds":   { isSelected: false, classes: ["btn-outline-warning"],  product: { fbsku: "360BNALM", hbsku: "", qty: 1}} 
        }
        //	DEFINE: PRIVATE FUNCTIONS
	    //	DEFINE: VIEW MODEL FUNCITONS
        $scope.vm.btnClick = function(key) {
            //	NOTIFY PROGRESS
            console.log('clicked: ', key);
            //	DEFINE: PRIVATE VARIABLES
            //	Execute
            if(!$scope.vm.recipies[key].isSelected) {
                //  first click
                console.log('first click', $scope.vm.recipies[key].classes[0]);
                //  change the button
                if($scope.vm.recipies[key].classes[0] == "btn-outline-info") $scope.vm.recipies[key].classes = ["btn-info"];
                if($scope.vm.recipies[key].classes[0] == "btn-outline-warning") $scope.vm.recipies[key].classes = ["btn-warning"];

                //  reset all other buttons
                Object.keys($scope.vm.recipies).forEach(function(listKey) {
                    
                    if(listKey == key) {
                        //  do nothing
                    } else {
                        //  make sure it is not selected and class is not changes
                        $scope.vm.recipies[listKey].isSelected = false;
                        if($scope.vm.recipies[listKey].classes[0] == "btn-info") $scope.vm.recipies[listKey].classes = ["btn-outline-info"];
                        if($scope.vm.recipies[listKey].classes[0] == "btn-warning") $scope.vm.recipies[listKey].classes = ["btn-outline-warning"];
                    }
                });
                
            } else {
                // second click 
                console.log('second click');

                //  LOCAL VARIABLES
                var timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ')
                var newSku = "";
                var order = {
                    sku: "",
                    qty: 1,
                    description: "",
                    updates: {}
                };

                //  ASSIGN SKU
                if($scope.vm.areFullBatches) { newSku = $scope.vm.recipies[key].product.fbsku; } else { newSku = $scope.vm.recipies[key].product.hbsku; }
                
                //  BUILD ORDER VALUES
                order.sku = newSku;

                //  COLLECT FIREBASE RECORD
                FirebaseService.mfg.collectSku(newSku)
                .then(function(skuRecord) {

                    console.log('got this sku record: ', skuRecord);

                    order.description = skuRecord.name,
                    order.updates = skuRecord.components;

                    console.log('order to write: ', order);

                    //  EXECUTE UPDATES
                    //  1. ADD MFG TX
                    $scope.vm.orders[timestamp] = order;

                    //  2. UPDATE SUPPLY LEVELS
                    Object.keys(order.updates).forEach(function(key) {
                        $scope.vm.supplies[key].qty += order.updates[key];
                    });

                    $scope.$apply();

                }).catch(function(e) {
                    console.log('Error: ', e);
                });

            };

            //  flip the switch
            $scope.vm.recipies[key].isSelected = !$scope.vm.recipies[key].isSelected

        };

    };

    return directive;		
};