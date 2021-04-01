
ckc.directive('adminSeasonSellector', adminSeasonSellector);

/* @ngInject */
function adminSeasonSellector() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminSeasonSellector-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "=",
            seasonId: "="
        },
        link: linkFunc,
        controller: adminSeasonSellectorController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('seasonName', function(newValue, oldValue) {
            //console.log('Season Name: ', scope.vm.seasonName);
            if(newValue) {
                Object.keys(scope.vm.seasons).forEach(function(key) {
                    if(scope.vm.seasons[key] != null) {
                        if(scope.vm.seasons[key].name == newValue) {
                            scope.vm.seasonId = key
                        }
                    }  
                })
                //console.log(scope.channelId);
            }

        })
        scope.$watch('channelId', function(newValue, oldValue) {
            //console.log('merchant ', scope.vm.merchant);
            if(scope.vm.channelId != undefined) {
                var path = '/Merchants/' + scope.vm.merchantId + '/Channels/' + scope.vm.channelId + "/Seasons";
                //console.log('path: ', path);
                scope.vm.initFirebase(path);
            }
        });
    }
    
    adminSeasonSellectorController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminSeasonSellectorController($scope, $log, $firebaseObject) {
        //define local variables
        $scope.seasonName ="";
        var self = this;
        self.initFirebase = function(path) {
            console.log('init firebase', path);
            var db = firebase.database();
            var ref = db.ref(path);
            self.seasons = $firebaseObject(ref);
        };

    };

    return directive;		
};